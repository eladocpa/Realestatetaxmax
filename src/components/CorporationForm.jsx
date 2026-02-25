import { useState } from 'react';
import {
  calcOperatingContractorPercentage,
  calcOperatingContractorCash,
  calcBuildingContractorPercentage,
  calcBuildingContractorSales,
  calculateFullTax,
  calculateCorporateTax,
} from '../taxEngine';

function CorporationForm({ onCalculate, onBack }) {
  const [subType, setSubType] = useState('operating'); // 'operating' | 'building'
  const [method, setMethod] = useState('percentage');
  const [completionMethod, setCompletionMethod] = useState('cost');
  const [isMajorShareholder, setIsMajorShareholder] = useState(true);

  // שדות קבלן מבצע - שיעור השלמה
  const [contractAmount, setContractAmount] = useState('');
  const [estimatedTotalCosts, setEstimatedTotalCosts] = useState('');
  const [actualCostsToDate, setActualCostsToDate] = useState('');
  const [actualCostsPriorYears, setActualCostsPriorYears] = useState('');
  const [revenueRecognizedPrior, setRevenueRecognizedPrior] = useState('');
  const [engineeringPct, setEngineeringPct] = useState('');

  // שדות קבלן מבצע - מזומנים
  const [cashReceived, setCashReceived] = useState('');
  const [expensesPaid, setExpensesPaid] = useState('');

  // שדות קבלן בונה - שיעור השלמה
  const [totalProjectedSales, setTotalProjectedSales] = useState('');
  const [accumulatedSales, setAccumulatedSales] = useState('');
  const [bEstimatedTotalCosts, setBEstimatedTotalCosts] = useState('');
  const [bActualCostsToDate, setBActualCostsToDate] = useState('');
  const [bActualCostsPriorYears, setBActualCostsPriorYears] = useState('');
  const [bRevenueRecognizedPrior, setBRevenueRecognizedPrior] = useState('');
  const [costsRecognizedPrior, setCostsRecognizedPrior] = useState('');
  const [isReadyForUse, setIsReadyForUse] = useState(false);
  const [soldArea, setSoldArea] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [warrantyRate, setWarrantyRate] = useState('1.5');

  // שדות קבלן בונה - מכירות
  const [salesRevenue, setSalesRevenue] = useState('');
  const [salesTotalCosts, setSalesTotalCosts] = useState('');
  const [salesSoldArea, setSalesSoldArea] = useState('');
  const [salesTotalArea, setSalesTotalArea] = useState('');
  const [salesReadyForUse, setSalesReadyForUse] = useState(false);

  const num = (v) => parseFloat(v) || 0;

  const getRevenueResult = () => {
    if (subType === 'operating') {
      if (method === 'percentage') {
        return calcOperatingContractorPercentage({
          contractAmount: num(contractAmount),
          estimatedTotalCosts: num(estimatedTotalCosts),
          actualCostsToDate: num(actualCostsToDate),
          actualCostsPriorYears: num(actualCostsPriorYears),
          revenueRecognizedPrior: num(revenueRecognizedPrior),
          completionMethod,
          engineeringPct: num(engineeringPct),
        });
      } else {
        return calcOperatingContractorCash({
          cashReceived: num(cashReceived),
          expensesPaid: num(expensesPaid),
        });
      }
    } else {
      if (method === 'percentage') {
        return calcBuildingContractorPercentage({
          totalProjectedSales: num(totalProjectedSales),
          accumulatedSales: num(accumulatedSales),
          estimatedTotalCosts: num(bEstimatedTotalCosts),
          actualCostsToDate: num(bActualCostsToDate),
          actualCostsPriorYears: num(bActualCostsPriorYears),
          revenueRecognizedPrior: num(bRevenueRecognizedPrior),
          costsRecognizedPrior: num(costsRecognizedPrior),
          isReadyForUse,
          soldArea: num(soldArea),
          totalArea: num(totalArea),
          warrantyProvisionRate: num(warrantyRate) / 100,
        });
      } else {
        return calcBuildingContractorSales({
          salesRevenue: num(salesRevenue),
          totalCosts: num(salesTotalCosts),
          soldArea: num(salesSoldArea),
          totalArea: num(salesTotalArea),
          isReadyForUse: salesReadyForUse,
          warrantyProvisionRate: num(warrantyRate) / 100,
        });
      }
    }
  };

  const handleCalculate = () => {
    const revenueResult = getRevenueResult();

    // חישוב מס חברות
    const corporateTax = calculateCorporateTax(revenueResult.taxableIncome, isMajorShareholder);

    // חישוב מס יחיד להשוואה (הכנסה מיגיעה אישית כברירת מחדל)
    const individualTax = calculateFullTax(revenueResult.taxableIncome, 2.25, true);

    onCalculate({
      contractorType: subType,
      entityType: 'corporation',
      method,
      completionMethod: subType === 'operating' && method === 'percentage' ? completionMethod : null,
      revenue: revenueResult,
      tax: corporateTax,
      comparison: {
        corporate: corporateTax,
        individual: individualTax,
      },
    });
  };

  // Reset method when changing subType
  const handleSubTypeChange = (newType) => {
    setSubType(newType);
    setMethod('percentage');
  };

  return (
    <div>
      <div className="card">
        <h2>תאגיד / חברה - חישוב מס</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
          מס חברות 23% | ההכנסה מחושבת לפי סוג הקבלן ושיטת הדיווח
        </p>

        {/* בחירת סוג קבלן */}
        <div className="form-section">
          <h3>סוג פעילות קבלנית</h3>
          <div className="method-selector">
            <div
              className={`method-option ${subType === 'operating' ? 'active' : ''}`}
              onClick={() => handleSubTypeChange('operating')}
            >
              <h4>קבלן מבצע</h4>
              <p>עבודות בניה עבור אחרים</p>
            </div>
            <div
              className={`method-option ${subType === 'building' ? 'active' : ''}`}
              onClick={() => handleSubTypeChange('building')}
            >
              <h4>קבלן בונה (יזם)</h4>
              <p>בניה על קרקע בבעלות החברה</p>
            </div>
          </div>
        </div>

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
              className={`method-option ${method === (subType === 'operating' ? 'cash' : 'sales') ? 'active' : ''}`}
              onClick={() => setMethod(subType === 'operating' ? 'cash' : 'sales')}
            >
              <h4>{subType === 'operating' ? 'שיטת מזומנים' : 'שיטת מכירות'}</h4>
              <p>{subType === 'operating' ? 'הכרה לפי תקבולים ותשלומים' : 'דיווח בשנת מסירה'}</p>
            </div>
          </div>
        </div>

        {/* טפסי קבלן מבצע */}
        {subType === 'operating' && method === 'percentage' && (
          <>
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

            <div className="form-section">
              <h3>נתוני הפרויקט</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>סכום החוזה / ההזמנה (₪)</label>
                  <input type="number" value={contractAmount} onChange={(e) => setContractAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>סך עלויות צפויות (₪)</label>
                  <input type="number" value={estimatedTotalCosts} onChange={(e) => setEstimatedTotalCosts(e.target.value)} placeholder="0" />
                </div>
              </div>

              {completionMethod === 'cost' ? (
                <div className="form-row">
                  <div className="form-group">
                    <label>עלויות בפועל עד כה (₪)</label>
                    <input type="number" value={actualCostsToDate} onChange={(e) => setActualCostsToDate(e.target.value)} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label>עלויות בשנים קודמות (₪)</label>
                    <input type="number" value={actualCostsPriorYears} onChange={(e) => setActualCostsPriorYears(e.target.value)} placeholder="0" />
                  </div>
                </div>
              ) : (
                <div className="form-row">
                  <div className="form-group">
                    <label>שיעור השלמה הנדסי (%)</label>
                    <input type="number" value={engineeringPct} onChange={(e) => setEngineeringPct(e.target.value)} placeholder="0" min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>עלויות בפועל עד כה (₪)</label>
                    <input type="number" value={actualCostsToDate} onChange={(e) => setActualCostsToDate(e.target.value)} placeholder="0" />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>הכנסה שהוכרה בשנים קודמות (₪)</label>
                <input type="number" value={revenueRecognizedPrior} onChange={(e) => setRevenueRecognizedPrior(e.target.value)} placeholder="0" />
              </div>
            </div>
          </>
        )}

        {subType === 'operating' && method === 'cash' && (
          <div className="form-section">
            <h3>תקבולים ותשלומים בשנת המס</h3>
            <div className="form-row">
              <div className="form-group">
                <label>מזומנים שנתקבלו בשנת המס (₪)</label>
                <input type="number" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} placeholder="0" />
              </div>
              <div className="form-group">
                <label>הוצאות ששולמו בשנת המס (₪)</label>
                <input type="number" value={expensesPaid} onChange={(e) => setExpensesPaid(e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>
        )}

        {/* טפסי קבלן בונה */}
        {subType === 'building' && method === 'percentage' && (
          <>
            <div className="form-section">
              <h3>נתוני הפרויקט</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>סך מכירות צפויות (₪)</label>
                  <input type="number" value={totalProjectedSales} onChange={(e) => setTotalProjectedSales(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>מכירות מצטברות (חוזים חתומים) (₪)</label>
                  <input type="number" value={accumulatedSales} onChange={(e) => setAccumulatedSales(e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>סך עלויות צפויות כולל קרקע (₪)</label>
                  <input type="number" value={bEstimatedTotalCosts} onChange={(e) => setBEstimatedTotalCosts(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>עלויות בפועל עד כה (₪)</label>
                  <input type="number" value={bActualCostsToDate} onChange={(e) => setBActualCostsToDate(e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>עלויות בשנים קודמות (₪)</label>
                  <input type="number" value={bActualCostsPriorYears} onChange={(e) => setBActualCostsPriorYears(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>הכנסה שהוכרה בשנים קודמות (₪)</label>
                  <input type="number" value={bRevenueRecognizedPrior} onChange={(e) => setBRevenueRecognizedPrior(e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>עלויות שהוכרו בשנים קודמות (₪)</label>
                <input type="number" value={costsRecognizedPrior} onChange={(e) => setCostsRecognizedPrior(e.target.value)} placeholder="0" />
              </div>
            </div>

            <div className="form-section">
              <h3>נתוני שטח (נוסחת ייחוס עלויות - סעיף 8א)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>שטח שנמכר - ללא חניה (מ"ר)</label>
                  <input type="number" value={soldArea} onChange={(e) => setSoldArea(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>שטח כולל של הבניין - ללא חניה (מ"ר)</label>
                  <input type="number" value={totalArea} onChange={(e) => setTotalArea(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>מצב הבניין</h3>
              <div className="checkbox-group">
                <input type="checkbox" id="corpReadyForUse" checked={isReadyForUse} onChange={(e) => setIsReadyForUse(e.target.checked)} />
                <label htmlFor="corpReadyForUse">הבניין ראוי לשימוש (חובר לרשת חשמל / עומד בתנאי תעודת גמר)</label>
              </div>
            </div>
          </>
        )}

        {subType === 'building' && method === 'sales' && (
          <>
            <div className="form-section">
              <h3>נתוני מכירות בשנת המס</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>הכנסות ממכירות בשנת המס (₪)</label>
                  <input type="number" value={salesRevenue} onChange={(e) => setSalesRevenue(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>סך עלויות הפרויקט כולל קרקע (₪)</label>
                  <input type="number" value={salesTotalCosts} onChange={(e) => setSalesTotalCosts(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>נתוני שטח (נוסחת ייחוס עלויות - סעיף 8א)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>שטח שנמכר - ללא חניה (מ"ר)</label>
                  <input type="number" value={salesSoldArea} onChange={(e) => setSalesSoldArea(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>שטח כולל של הבניין - ללא חניה (מ"ר)</label>
                  <input type="number" value={salesTotalArea} onChange={(e) => setSalesTotalArea(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>מצב הבניין</h3>
              <div className="checkbox-group">
                <input type="checkbox" id="corpSalesReadyForUse" checked={salesReadyForUse} onChange={(e) => setSalesReadyForUse(e.target.checked)} />
                <label htmlFor="corpSalesReadyForUse">הבניין ראוי לשימוש (חובר לרשת חשמל / עומד בתנאי תעודת גמר)</label>
              </div>
            </div>
          </>
        )}

        {/* הגדרות מס חברות */}
        <div className="form-section">
          <h3>הגדרות מס חברות</h3>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="majorShareholder"
              checked={isMajorShareholder}
              onChange={(e) => setIsMajorShareholder(e.target.checked)}
            />
            <label htmlFor="majorShareholder">
              בעל מניות מהותי (מחזיק מעל 10%) — מס דיבידנד 30% במקום 25%
            </label>
          </div>
          {subType === 'building' && (
            <div className="form-group">
              <label>שיעור הפרשה לאחריות (%)</label>
              <input
                type="number"
                value={warrantyRate}
                onChange={(e) => setWarrantyRate(e.target.value)}
                placeholder="1.5"
                step="0.1"
                min="0"
                max="5"
              />
              <div className="help-text">עד 1.5% מעלויות הפרויקט (חוזר מס הכנסה)</div>
            </div>
          )}
        </div>

        <div className="info-box">
          <div className="info-title">השוואת מיסוי חברה מול יחיד</div>
          <p>
            המחשבון יחשב את המס כחברה (23% מס חברות + מס על דיבידנד) ויציג
            השוואה מול מיסוי כיחיד/עצמאי (מדרגות מס + ביטוח לאומי + מס בריאות).
          </p>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleCalculate}>
            חשב מס והשוואה
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            חזור
          </button>
        </div>
      </div>
    </div>
  );
}

export default CorporationForm;
