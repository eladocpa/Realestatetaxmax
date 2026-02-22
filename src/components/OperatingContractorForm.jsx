import { useState } from 'react';
import {
  calcOperatingContractorPercentage,
  calcOperatingContractorCash,
  calculateFullTax,
} from '../taxEngine';

const formatNumber = (n) => new Intl.NumberFormat('he-IL').format(Math.round(n));

function OperatingContractorForm({ onCalculate, onBack }) {
  const [method, setMethod] = useState('percentage'); // 'percentage' | 'cash'
  const [completionMethod, setCompletionMethod] = useState('cost'); // 'cost' | 'engineering'

  // שיטת שיעור השלמה
  const [contractAmount, setContractAmount] = useState('');
  const [estimatedTotalCosts, setEstimatedTotalCosts] = useState('');
  const [actualCostsToDate, setActualCostsToDate] = useState('');
  const [actualCostsPriorYears, setActualCostsPriorYears] = useState('');
  const [revenueRecognizedPrior, setRevenueRecognizedPrior] = useState('');
  const [engineeringPct, setEngineeringPct] = useState('');

  // שיטת מזומנים
  const [cashReceived, setCashReceived] = useState('');
  const [expensesPaid, setExpensesPaid] = useState('');

  // הגדרות מס
  const [creditPoints, setCreditPoints] = useState('2.25');
  const [isEarnedIncome, setIsEarnedIncome] = useState(true);

  const num = (v) => parseFloat(v) || 0;

  const handleCalculate = () => {
    let revenueResult;

    if (method === 'percentage') {
      revenueResult = calcOperatingContractorPercentage({
        contractAmount: num(contractAmount),
        estimatedTotalCosts: num(estimatedTotalCosts),
        actualCostsToDate: num(actualCostsToDate),
        actualCostsPriorYears: num(actualCostsPriorYears),
        revenueRecognizedPrior: num(revenueRecognizedPrior),
        completionMethod,
        engineeringPct: num(engineeringPct),
      });
    } else {
      revenueResult = calcOperatingContractorCash({
        cashReceived: num(cashReceived),
        expensesPaid: num(expensesPaid),
      });
    }

    const taxResult = calculateFullTax(
      revenueResult.taxableIncome,
      num(creditPoints),
      isEarnedIncome
    );

    onCalculate({
      contractorType: 'operating',
      method,
      completionMethod: method === 'percentage' ? completionMethod : null,
      revenue: revenueResult,
      tax: taxResult,
    });
  };

  return (
    <div>
      <div className="card">
        <h2>קבלן מבצע - חישוב הכנסה חייבת</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
          סעיף 8א(א), 8א(ב) לפקודת מס הכנסה | תקן חשבונאות מספר 4
        </p>

        {/* בחירת שיטת דיווח */}
        <div className="form-section">
          <h3>שיטת דיווח</h3>
          <div className="method-selector">
            <div
              className={`method-option ${method === 'percentage' ? 'active' : ''}`}
              onClick={() => setMethod('percentage')}
            >
              <h4>שיטת שיעור השלמה</h4>
              <p>הכרה בהכנסה לפי התקדמות הפרויקט</p>
            </div>
            <div
              className={`method-option ${method === 'cash' ? 'active' : ''}`}
              onClick={() => setMethod('cash')}
            >
              <h4>שיטת מזומנים</h4>
              <p>הכרה בהכנסה לפי תקבולים ותשלומים</p>
            </div>
          </div>
        </div>

        {method === 'percentage' && (
          <>
            {/* בחירת שיטת שיעור השלמה */}
            <div className="form-section">
              <h3>שיטת חישוב שיעור השלמה</h3>
              <div className="method-selector">
                <div
                  className={`method-option ${completionMethod === 'cost' ? 'active' : ''}`}
                  onClick={() => setCompletionMethod('cost')}
                >
                  <h4>לפי עלות</h4>
                  <p>עלויות בפועל / סך עלויות צפויות</p>
                </div>
                <div
                  className={`method-option ${completionMethod === 'engineering' ? 'active' : ''}`}
                  onClick={() => setCompletionMethod('engineering')}
                >
                  <h4>הנדסי</h4>
                  <p>קביעת מהנדס הבניין</p>
                </div>
              </div>
            </div>

            {/* נתוני הפרויקט */}
            <div className="form-section">
              <h3>נתוני הפרויקט</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>סכום החוזה / ההזמנה (₪)</label>
                  <input
                    type="number"
                    value={contractAmount}
                    onChange={(e) => setContractAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>סך עלויות צפויות (₪)</label>
                  <input
                    type="number"
                    value={estimatedTotalCosts}
                    onChange={(e) => setEstimatedTotalCosts(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {completionMethod === 'cost' ? (
                <div className="form-row">
                  <div className="form-group">
                    <label>עלויות בפועל עד כה (₪)</label>
                    <input
                      type="number"
                      value={actualCostsToDate}
                      onChange={(e) => setActualCostsToDate(e.target.value)}
                      placeholder="0"
                    />
                    <div className="help-text">סך כל העלויות מתחילת הפרויקט</div>
                  </div>
                  <div className="form-group">
                    <label>עלויות בשנים קודמות (₪)</label>
                    <input
                      type="number"
                      value={actualCostsPriorYears}
                      onChange={(e) => setActualCostsPriorYears(e.target.value)}
                      placeholder="0"
                    />
                    <div className="help-text">עלויות שכבר דווחו בשנים קודמות</div>
                  </div>
                </div>
              ) : (
                <div className="form-row">
                  <div className="form-group">
                    <label>שיעור השלמה הנדסי (%)</label>
                    <input
                      type="number"
                      value={engineeringPct}
                      onChange={(e) => setEngineeringPct(e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <div className="help-text">כפי שנקבע על ידי מהנדס הבניין</div>
                  </div>
                  <div className="form-group">
                    <label>עלויות בפועל עד כה (₪)</label>
                    <input
                      type="number"
                      value={actualCostsToDate}
                      onChange={(e) => setActualCostsToDate(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>הכנסה שהוכרה בשנים קודמות (₪)</label>
                <input
                  type="number"
                  value={revenueRecognizedPrior}
                  onChange={(e) => setRevenueRecognizedPrior(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="info-box">
              <div className="info-title">כללי הכרה בהכנסה - קבלן מבצע</div>
              <p>
                הכנסה מוכרת כאשר שיעור ההשלמה מגיע ל-25% לפחות מההיקף הכמותי או הכספי של ההזמנה.
                הפסד מוכר רק כאשר שיעור ההשלמה מגיע ל-50% ומעלה.
              </p>
            </div>
          </>
        )}

        {method === 'cash' && (
          <div className="form-section">
            <h3>תקבולים ותשלומים בשנת המס</h3>
            <div className="form-row">
              <div className="form-group">
                <label>מזומנים שנתקבלו בשנת המס (₪)</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>הוצאות ששולמו בשנת המס (₪)</label>
                <input
                  type="number"
                  value={expensesPaid}
                  onChange={(e) => setExpensesPaid(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* הגדרות מס */}
        <div className="form-section">
          <h3>הגדרות מס</h3>
          <div className="form-row">
            <div className="form-group">
              <label>נקודות זיכוי</label>
              <input
                type="number"
                value={creditPoints}
                onChange={(e) => setCreditPoints(e.target.value)}
                placeholder="2.25"
                step="0.25"
              />
              <div className="help-text">תושב ישראל: 2.25 נקודות (ברירת מחדל)</div>
            </div>
            <div className="form-group">
              <label>סוג הכנסה</label>
              <select
                value={isEarnedIncome ? 'earned' : 'unearned'}
                onChange={(e) => setIsEarnedIncome(e.target.value === 'earned')}
              >
                <option value="earned">הכנסה מיגיעה אישית</option>
                <option value="unearned">הכנסה שלא מיגיעה אישית</option>
              </select>
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleCalculate}>
            חשב מס
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            חזור
          </button>
        </div>
      </div>
    </div>
  );
}

export default OperatingContractorForm;
