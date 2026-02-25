import { useState } from 'react';
import ContractorTypeSelector from './components/ContractorTypeSelector';
import OperatingContractorForm from './components/OperatingContractorForm';
import BuildingContractorForm from './components/BuildingContractorForm';
import CorporationForm from './components/CorporationForm';
import TaxResults from './components/TaxResults';
import './App.css';

function App() {
  const [contractorType, setContractorType] = useState(null);
  const [results, setResults] = useState(null);

  const handleReset = () => {
    setContractorType(null);
    setResults(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>מחשבון מס לקבלנים</h1>
        <p className="subtitle">שנת מס 2026 | על פי סעיף 8א לפקודת מס הכנסה</p>
      </header>

      <main className="app-main">
        {!contractorType && (
          <ContractorTypeSelector onSelect={setContractorType} />
        )}

        {contractorType === 'operating' && !results && (
          <OperatingContractorForm
            onCalculate={setResults}
            onBack={handleReset}
          />
        )}

        {contractorType === 'building' && !results && (
          <BuildingContractorForm
            onCalculate={setResults}
            onBack={handleReset}
          />
        )}

        {contractorType === 'corporation' && !results && (
          <CorporationForm
            onCalculate={setResults}
            onBack={handleReset}
          />
        )}

        {results && (
          <TaxResults results={results} onReset={handleReset} />
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
