import { useState } from 'react';

const fmt = (n) => new Intl.NumberFormat('he-IL').format(Math.round(n));

function getCalcSummary(results) {
  const { contractorType, entityType, method, revenue, tax } = results;

  const typeLabels = {
    operating: 'קבלן מבצע',
    building: 'קבלן בונה (יזם)',
  };
  const methodLabels = {
    percentage: 'שיעור השלמה',
    cash: 'מזומנים',
    sales: 'מכירות',
  };

  const label = entityType === 'corporation'
    ? `תאגיד — ${typeLabels[contractorType] || contractorType}`
    : typeLabels[contractorType] || contractorType;

  return {
    label,
    method: methodLabels[method] || method,
    taxableIncome: revenue?.taxableIncome || 0,
    totalPayments: tax?.totalPayments || 0,
    isCorporation: entityType === 'corporation',
  };
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SavedCalculations({ calculations, onView, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const startEditing = (calc, e) => {
    e.stopPropagation();
    setEditingId(calc.id);
    setEditName(calc.name || '');
  };

  const saveEdit = (id, e) => {
    e.stopPropagation();
    onRename(id, editName.trim());
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="card saved-calculations">
      <h2>חישובים שמורים ({calculations.length})</h2>

      <div className="saved-list">
        {calculations.map((calc) => {
          const summary = getCalcSummary(calc.results);
          const isEditing = editingId === calc.id;

          return (
            <div
              key={calc.id}
              className="saved-item"
              onClick={() => onView(calc)}
            >
              <div className="saved-item-header">
                <div className="saved-item-name">
                  {isEditing ? (
                    <div className="edit-name-row" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="שם הפרויקט"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(calc.id, e);
                          if (e.key === 'Escape') cancelEdit(e);
                        }}
                      />
                      <button className="btn-icon" onClick={(e) => saveEdit(calc.id, e)} title="שמור">V</button>
                      <button className="btn-icon" onClick={cancelEdit} title="ביטול">X</button>
                    </div>
                  ) : (
                    <span className="saved-project-name">
                      {calc.name || `חישוב ${formatDate(calc.date)}`}
                    </span>
                  )}
                </div>
                <div className="saved-item-actions">
                  {!isEditing && (
                    <button
                      className="btn-icon"
                      onClick={(e) => startEditing(calc, e)}
                      title="שנה שם"
                    >
                      &#9998;
                    </button>
                  )}
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(calc.id);
                    }}
                    title="מחק"
                  >
                    &#10005;
                  </button>
                </div>
              </div>
              <div className="saved-item-details">
                <span className="saved-tag">{summary.label}</span>
                <span className="saved-tag">{summary.method}</span>
                <span className="saved-detail">
                  הכנסה חייבת: <strong>₪{fmt(summary.taxableIncome)}</strong>
                </span>
                <span className="saved-detail">
                  {summary.isCorporation ? 'מס חברות' : 'סה"כ תשלומים'}: <strong>₪{fmt(summary.totalPayments)}</strong>
                </span>
              </div>
              {!calc.name && (
                <div className="saved-item-date">{formatDate(calc.date)}</div>
              )}
              {calc.name && (
                <div className="saved-item-date">{formatDate(calc.date)}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SavedCalculations;
