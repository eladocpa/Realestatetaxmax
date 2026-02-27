import { useState, useEffect } from 'react';
import ContractorTypeSelector from './components/ContractorTypeSelector';
import OperatingContractorForm from './components/OperatingContractorForm';
import BuildingContractorForm from './components/BuildingContractorForm';
import CorporationForm from './components/CorporationForm';
import TaxResults from './components/TaxResults';
import SavedCalculations from './components/SavedCalculations';
import './App.css';

const STORAGE_KEY = 'realestatetaxmax_saved';

function loadSaved() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function persistSaved(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function App() {
  const [contractorType, setContractorType] = useState(null);
  const [results, setResults] = useState(null);
  const [savedCalcs, setSavedCalcs] = useState(loadSaved);
  const [viewingSavedId, setViewingSavedId] = useState(null);

  useEffect(() => {
    persistSaved(savedCalcs);
  }, [savedCalcs]);

  const handleCalculate = (calcResults) => {
    const saved = {
      id: Date.now(),
      date: new Date().toISOString(),
      name: '',
      results: calcResults,
    };
    setSavedCalcs((prev) => [saved, ...prev]);
    setResults(calcResults);
    setViewingSavedId(saved.id);
  };

  const handleReset = () => {
    setContractorType(null);
    setResults(null);
    setViewingSavedId(null);
  };

  const handleViewSaved = (calc) => {
    setResults(calc.results);
    setViewingSavedId(calc.id);
    setContractorType('__saved__');
  };

  const handleDeleteSaved = (id) => {
    setSavedCalcs((prev) => prev.filter((c) => c.id !== id));
    if (viewingSavedId === id) {
      handleReset();
    }
  };

  const handleRenameSaved = (id, newName) => {
    setSavedCalcs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>מחשבון מס לקבלנים</h1>
        <p className="subtitle">שנת מס 2026 | על פי סעיף 8א לפקודת מס הכנסה</p>
      </header>

      <main className="app-main">
        {!contractorType && (
          <>
            <ContractorTypeSelector onSelect={setContractorType} />
            {savedCalcs.length > 0 && (
              <SavedCalculations
                calculations={savedCalcs}
                onView={handleViewSaved}
                onDelete={handleDeleteSaved}
                onRename={handleRenameSaved}
              />
            )}
          </>
        )}

        {contractorType === 'operating' && !results && (
          <OperatingContractorForm
            onCalculate={handleCalculate}
            onBack={handleReset}
          />
        )}

        {contractorType === 'building' && !results && (
          <BuildingContractorForm
            onCalculate={handleCalculate}
            onBack={handleReset}
          />
        )}

        {contractorType === 'corporation' && !results && (
          <CorporationForm
            onCalculate={handleCalculate}
            onBack={handleReset}
          />
        )}

        {results && (
          <TaxResults
            results={results}
            onReset={handleReset}
            savedId={viewingSavedId}
            savedName={savedCalcs.find((c) => c.id === viewingSavedId)?.name || ''}
            onRename={(name) => viewingSavedId && handleRenameSaved(viewingSavedId, name)}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          <strong>אזהרה:</strong> מחשבון זה מהווה כלי עזר בלבד ואינו מהווה ייעוץ מס.
          יש להתייעץ עם רואה חשבון או יועץ מס מוסמך.
        </p>
        <p className="legal-refs">
          סעיף 8א לפקודת מס הכנסה | תקן חשבונאות 2 | תקן חשבונאות 4 | IFRS 15
        </p>
      </footer>
    </div>
  );
}

export default App;
