import { useState } from 'react';
import {
  calcBuildingContractorPercentage,
  calcBuildingContractorSales,
  calculateFullTax,
} from '../taxEngine';

function BuildingContractorForm({ onCalculate, onBack }) {
  const [method, setMethod] = useState('percentage'); // 'percentage' | 'sales'

  // שיטת שיעור השלמה
  const [totalProjectedSales, setTotalProjectedSales] = useState('');
  const [accumulatedSales, setAccumulatedSales] = useState('');
  const [estimatedTotalCosts, setEstimatedTotalCosts] = useState('');
  const [actualCostsToDate, setActualCostsToDate] = useState('');
  const [actualCostsPriorYears, setActualCostsPriorYears] = useState('');
  const [revenueRecognizedPrior, setRevenueRecognizedPrior] = useState('');
  const [costsRecognizedPrior, setCostsRecognizedPrior] = useState('');
  const [isReadyForUse, setIsReadyForUse] = useState(false);
  const [soldArea, setSoldArea] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [warrantyRate, setWarrantyRate] = useState('1.5');

  // שיטת מכירות
  const [salesRevenue, setSalesRevenue] = useState('');
  const [salesTotalCosts, setSalesTotalCosts] = useState('');
  const [salesSoldArea, setSalesSoldArea] = useState('');
  const [salesTotalArea, setSalesTotalArea] = useState('');
  const [salesReadyForUse, setSalesReadyForUse] = useState(false);

  // הגדרות מס
  const [creditPoints, setCreditPoints] = useState('2.25');
  const [isEarnedIncome, setIsEarnedIncome] = useState(true);

  const num = (v) => parseFloat(v) || 0;

  const getPercentageResult = () => {
    return calcBuildingContractorPercentage({
      totalProjectedSales: num(totalProjectedSales),
      accumulatedSales: num(accumulatedSales),
      estimatedTotalCosts: num(estimatedTotalCosts),
      actualCostsToDate: num(actualCostsToDate),
      actualCostsPriorYears: num(actualCostsPriorYears),
      revenueRecognizedPrior: num(revenueRecognizedPrior),
      costsRecognizedPrior: num(costsRecognizedPrior),
      isReadyForUse,
      soldArea: num(soldArea),
      totalArea: num(totalArea),
      warrantyProvisionRate: num(warrantyRate) / 100,
    });
  };

  const getSalesResult = () => {
    return calcBuildingContractorSales({
      salesRevenue: num(salesRevenue),
      totalCosts: num(salesTotalCosts),
      soldArea: num(salesSoldArea),
      totalArea: num(salesTotalArea),
      isReadyForUse: salesReadyForUse,
      warrantyProvisionRate: num(warrantyRate) / 100,
    });
  };

  const handleCalculate = () => {
    const revenueResult = method === 'percentage' ? getPercentageResult() : getSalesResult();
    const taxResult = calculateFullTax(revenueResult.taxableIncome, num(creditPoints), isEarnedIncome);

    onCalculate({
      contractorType: 'building',
      method,
      revenue: revenueResult,
      tax: taxResult,
    });
  };

  const handleCompare = () => {
    const percentageRevenue = getPercentageResult();
    const salesRevResult = getSalesResult();

    const cp = num(creditPoints);
    const earned = isEarnedIncome;

    const percentageTax = calculateFullTax(percentageRevenue.taxableIncome, cp, earned);
    const salesTax = calculateFullTax(salesRevResult.taxableIncome, cp, earned);

    const percentageTotalPayments = percentageTax.totalPayments;
    const salesTotalPayments = salesTax.totalPayments;

    let recommended;
    if (percentageTotalPayments < salesTotalPayments) {
      recommended = 'percentage';
    } else if (salesTotalPayments < percentageTotalPayments) {
      recommended = 'sales';
    } else {
      recommended = 'equal';
    }

    onCalculate({
      contractorType: 'building',
      method,
      revenue: method === 'percentage' ? percentageRevenue : salesRevResult,
      tax: method === 'percentage' ? percentageTax : salesTax,
      methodComparison: {
        percentage: { revenue: percentageRevenue, tax: percentageTax },
        sales: { revenue: salesRevResult, tax: salesTax },
        recommended,
        savings: Math.abs(percentageTotalPayments - salesTotalPayments),
      },
    });
  };

  // Check if we have enough data for both methods
  const hasBothMethodsData = num(totalProjectedSales) > 0 && num(salesRevenue) > 0;

  return (
    <div>
      <div className="card">
        <h2>קבלן בונה (יזם) - חישוב הכנסה חייבת</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
          סעיף 8א(ג) לפקודת מס הכנסה | תקן חשבונאות מספר 2
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
              <p>הכרה בהכנסה לפי התקדמות הפרויקט ומכירות</p>
            </div>
            <div
              className={`method-option ${method === 'sales' ? 'active' : ''}`}
              onClick={() => setMethod('sales')}
            >
              <h4>שיטת מכירות</h4>
              <p>דיווח בשנת מסירה (בניין ראוי לשימוש)</p>
            </div>
          </div>
        </div>

        {method === 'percentage' && (
          <>
            <div className="form-section">
              <h3>נתוני הפרויקט</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>סך מכירות צפויות (₪)</label>
                  <input
                    type="number"
                    value={totalProjectedSales}
                    onChange={(e) => setTotalProjectedSales(e.target.value)}
                    placeholder="0"
                  />
                  <div className="help-text">סך כל ההכנסות הצפויות ממכירת דירות</div>
                </div>
                <div className="form-group">
                  <label>מכירות מצטברות (חוזים חתומים) (₪)</label>
                  <input
                    type="number"
                    value={accumulatedSales}
                    onChange={(e) => setAccumulatedSales(e.target.value)}
                    placeholder="0"
                  />
                  <div className="help-text">סך חוזי מכירה שנחתמו עד כה</div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>סך עלויות צפויות כולל קרקע (₪)</label>
                  <input
                    type="number"
                    value={estimatedTotalCosts}
                    onChange={(e) => setEstimatedTotalCosts(e.target.value)}
                    placeholder="0"
                  />
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

              <div className="form-row">
                <div className="form-group">
                  <label>עלויות בשנים קודמות (₪)</label>
                  <input
                    type="number"
                    value={actualCostsPriorYears}
                    onChange={(e) => setActualCostsPriorYears(e.target.value)}
                    placeholder="0"
                  />
                </div>
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

              <div className="form-group">
                <label>עלויות שהוכרו בשנים קודמות (₪)</label>
                <input
                  type="number"
                  value={costsRecognizedPrior}
                  onChange={(e) => setCostsRecognizedPrior(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>נתוני שטח (נוסחת ייחוס עלויות - סעיף 8א)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>שטח שנמכר - ללא חניה (מ"ר)</label>
                  <input
                    type="number"
                    value={soldArea}
                    onChange={(e) => setSoldArea(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>שטח כולל של הבניין - ללא חניה (מ"ר)</label>
                  <input
                    type="number"
                    value={totalArea}
                    onChange={(e) => setTotalArea(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>מצב הבניין</h3>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="readyForUse"
                  checked={isReadyForUse}
                  onChange={(e) => setIsReadyForUse(e.target.checked)}
                />
                <label htmlFor="readyForUse">
                  הבניין ראוי לשימוש (חובר לרשת חשמל / עומד בתנאי תעודת גמר)
                </label>
              </div>
            </div>

            <div className="info-box">
              <div className="info-title">תנאי הכרה בהכנסה - קבלן בונה (תקן 2)</div>
              <p>
                יש לעמוד בכל התנאים הבאים: שיעור השלמה 25% ומעלה, מכירות מצטברות 50% ומעלה מסך המכירות
                הצפויות, הבניין ראוי לשימוש, וודאות לגבי עלויות והכנסות.
              </p>
            </div>
          </>
        )}

        {method === 'sales' && (
          <>
            <div className="form-section">
              <h3>נתוני מכירות בשנת המס</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>הכנסות ממכירות בשנת המס (₪)</label>
                  <input
                    type="number"
                    value={salesRevenue}
                    onChange={(e) => setSalesRevenue(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>סך עלויות הפרויקט כולל קרקע (₪)</label>
                  <input
                    type="number"
                    value={salesTotalCosts}
                    onChange={(e) => setSalesTotalCosts(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>נתוני שטח (נוסחת ייחוס עלויות - סעיף 8א)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>שטח שנמכר - ללא חניה (מ"ר)</label>
                  <input
                    type="number"
                    value={salesSoldArea}
                    onChange={(e) => setSalesSoldArea(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>שטח כולל של הבניין - ללא חניה (מ"ר)</label>
                  <input
                    type="number"
                    value={salesTotalArea}
                    onChange={(e) => setSalesTotalArea(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>מצב הבניין</h3>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="salesReadyForUse"
                  checked={salesReadyForUse}
                  onChange={(e) => setSalesReadyForUse(e.target.checked)}
                />
                <label htmlFor="salesReadyForUse">
                  הבניין ראוי לשימוש (חובר לרשת חשמל / עומד בתנאי תעודת גמר)
                </label>
              </div>
            </div>

            <div className="info-box">
              <div className="info-title">שיטת מכירות - קבלן בונה</div>
              <p>
                ההכנסה מוכרת בשנה הראשונה בה הבניין ראוי לשימוש.
                עלויות מיוחסות לפי נוסחת סעיף 8א: (שטח נמכר / שטח כולל) × עלויות בניה כולל קרקע.
                שטחי חניה אינם נכללים בחישוב השטחים.
              </p>
            </div>
          </>
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
        </div>

        {hasBothMethodsData && (
          <div className="info-box" style={{ background: 'rgba(167, 139, 250, 0.08)', borderColor: 'rgba(167, 139, 250, 0.2)' }}>
            <div className="info-title" style={{ color: '#a78bfa' }}>השוואת שיטות</div>
            <p>
              יש לך נתונים לשתי השיטות. לחץ על "השווה שיטות" כדי לראות איזו שיטה כדאית יותר מבחינת מס.
            </p>
          </div>
        )}

        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleCalculate}>
            חשב מס
          </button>
          {hasBothMethodsData && (
            <button className="btn btn-compare" onClick={handleCompare}>
              השווה שיטות
            </button>
          )}
          <button className="btn btn-secondary" onClick={onBack}>
            חזור
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildingContractorForm;
