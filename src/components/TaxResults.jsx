const fmt = (n) => new Intl.NumberFormat('he-IL').format(Math.round(n));
const fmtPct = (n) => `${n}%`;

function TaxResults({ results, onReset }) {
  const { contractorType, method, revenue, tax } = results;

  const isBuilding = contractorType === 'building';
  const isPercentage = method === 'percentage';
  const isCash = method === 'cash';
  const isSales = method === 'sales';

  return (
    <div className="results-container">
      {/* Summary Cards */}
      <div className="card">
        <h2>
          {isBuilding ? 'קבלן בונה (יזם)' : 'קבלן מבצע'} - תוצאות חישוב
        </h2>

        <div className="result-summary">
          <div className="result-box">
            <div className="label">הכנסה חייבת</div>
            <div className={`value ${tax.taxableIncome > 0 ? 'highlight' : ''}`}>
              ₪{fmt(tax.taxableIncome)}
            </div>
          </div>
          <div className="result-box">
            <div className="label">מס הכנסה (אחרי זיכויים)</div>
            <div className="value negative">₪{fmt(tax.incomeTaxAfterCredits)}</div>
          </div>
          <div className="result-box">
            <div className="label">ביטוח לאומי</div>
            <div className="value negative">₪{fmt(tax.nationalInsurance)}</div>
          </div>
          <div className="result-box">
            <div className="label">מס בריאות</div>
            <div className="value negative">₪{fmt(tax.healthTax)}</div>
          </div>
          <div className="result-box">
            <div className="label">סה"כ תשלומים</div>
            <div className="value negative">₪{fmt(tax.totalPayments)}</div>
          </div>
          <div className="result-box">
            <div className="label">הכנסה נטו</div>
            <div className={`value ${tax.netIncome >= 0 ? 'positive' : 'negative'}`}>
              ₪{fmt(tax.netIncome)}
            </div>
          </div>
          <div className="result-box">
            <div className="label">שיעור מס אפקטיבי</div>
            <div className="value">{tax.effectiveRate}%</div>
          </div>
        </div>
      </div>

      {/* Revenue Recognition Details */}
      <div className="card">
        <h2>פירוט הכרה בהכנסה</h2>

        {/* Percentage of completion - Operating */}
        {!isBuilding && isPercentage && (
          <>
            <div className="result-summary">
              <div className="result-box">
                <div className="label">שיעור השלמה</div>
                <div className="value highlight">{revenue.completionPercentage}%</div>
              </div>
              <div className="result-box">
                <div className="label">סף הכרה בהכנסה (25%)</div>
                <div className="value">
                  <span className={`status-badge ${revenue.meetsRevenueThreshold ? 'met' : 'not-met'}`}>
                    {revenue.meetsRevenueThreshold ? 'עומד בתנאי' : 'לא עומד'}
                  </span>
                </div>
              </div>
              {!revenue.isProfit && (
                <div className="result-box">
                  <div className="label">סף הכרה בהפסד (50%)</div>
                  <div className="value">
                    <span className={`status-badge ${revenue.meetsLossThreshold ? 'met' : 'not-met'}`}>
                      {revenue.meetsLossThreshold ? 'עומד בתנאי' : 'לא עומד'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <table className="tax-table">
              <thead>
                <tr>
                  <th>פריט</th>
                  <th>מצטבר</th>
                  <th>שנה נוכחית</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>הכנסות מוכרות</td>
                  <td>₪{fmt(revenue.recognizedRevenue)}</td>
                  <td>₪{fmt(revenue.currentYearRevenue)}</td>
                </tr>
                <tr>
                  <td>עלויות מוכרות</td>
                  <td>₪{fmt(revenue.recognizedCosts)}</td>
                  <td>₪{fmt(revenue.currentYearCosts)}</td>
                </tr>
                <tr className="total-row">
                  <td>רווח / (הפסד)</td>
                  <td>₪{fmt(revenue.recognizedProfit)}</td>
                  <td>₪{fmt(revenue.currentYearProfit)}</td>
                </tr>
              </tbody>
            </table>

            <div className="info-box">
              <div className="info-title">נתוני הפרויקט</div>
              <p>
                סכום החוזה: ₪{fmt(revenue.contractAmount)} |
                סך עלויות צפויות: ₪{fmt(revenue.estimatedTotalCosts)} |
                רווח צפוי: ₪{fmt(revenue.estimatedProfit)}
              </p>
            </div>
          </>
        )}

        {/* Cash basis - Operating */}
        {!isBuilding && isCash && (
          <table className="tax-table">
            <thead>
              <tr>
                <th>פריט</th>
                <th>סכום</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>מזומנים שנתקבלו</td>
                <td>₪{fmt(revenue.cashReceived)}</td>
              </tr>
              <tr>
                <td>הוצאות ששולמו</td>
                <td>₪{fmt(revenue.expensesPaid)}</td>
              </tr>
              <tr className="total-row">
                <td>הכנסה חייבת</td>
                <td>₪{fmt(revenue.taxableIncome)}</td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Percentage of completion - Building */}
        {isBuilding && isPercentage && (
          <>
            <div className="result-summary">
              <div className="result-box">
                <div className="label">שיעור השלמה</div>
                <div className="value highlight">{revenue.completionPercentage}%</div>
              </div>
              <div className="result-box">
                <div className="label">סף השלמה (25%)</div>
                <div className="value">
                  <span className={`status-badge ${revenue.meetsCompletionThreshold ? 'met' : 'not-met'}`}>
                    {revenue.meetsCompletionThreshold ? 'עומד' : 'לא עומד'}
                  </span>
                </div>
              </div>
              <div className="result-box">
                <div className="label">סף מכירות (50%)</div>
                <div className="value">
                  <span className={`status-badge ${revenue.meetsSalesThreshold ? 'met' : 'not-met'}`}>
                    {revenue.meetsSalesThreshold ? `${revenue.salesRatio}%` : `${revenue.salesRatio}%`}
                  </span>
                </div>
              </div>
              <div className="result-box">
                <div className="label">בניין ראוי לשימוש</div>
                <div className="value">
                  <span className={`status-badge ${revenue.isReadyForUse ? 'met' : 'not-met'}`}>
                    {revenue.isReadyForUse ? 'כן' : 'לא'}
                  </span>
                </div>
              </div>
            </div>

            {!revenue.canRecognizeRevenue && (
              <div className="warning-box">
                <p>
                  לא ניתן להכיר בהכנסה - יש לעמוד בכל התנאים:
                  שיעור השלמה 25%+, מכירות מצטברות 50%+, והבניין ראוי לשימוש.
                </p>
              </div>
            )}

            <table className="tax-table">
              <thead>
                <tr>
                  <th>פריט</th>
                  <th>מצטבר</th>
                  <th>שנה נוכחית</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>הכנסות מוכרות</td>
                  <td>₪{fmt(revenue.recognizedRevenue)}</td>
                  <td>₪{fmt(revenue.currentYearRevenue)}</td>
                </tr>
                <tr>
                  <td>עלויות מוכרות</td>
                  <td>₪{fmt(revenue.recognizedCosts)}</td>
                  <td>₪{fmt(revenue.currentYearCosts)}</td>
                </tr>
                <tr className="total-row">
                  <td>רווח / (הפסד)</td>
                  <td>₪{fmt(revenue.recognizedProfit)}</td>
                  <td>₪{fmt(revenue.currentYearProfit)}</td>
                </tr>
              </tbody>
            </table>

            <div className="info-box">
              <div className="info-title">נתוני הפרויקט</div>
              <p>
                סך מכירות צפויות: ₪{fmt(revenue.totalProjectedSales)} |
                סך עלויות צפויות: ₪{fmt(revenue.estimatedTotalCosts)} |
                הפרשה לאחריות: ₪{fmt(revenue.warrantyProvision)} |
                עלויות מיוחסות (סעיף 8א): ₪{fmt(revenue.allocatedCosts)}
              </p>
            </div>
          </>
        )}

        {/* Sales method - Building */}
        {isBuilding && isSales && (
          <>
            {!revenue.isReadyForUse && (
              <div className="warning-box">
                <p>
                  הבניין אינו ראוי לשימוש - לא ניתן להכיר בהכנסה בשיטת מכירות.
                  ההכנסה תוכר בשנה הראשונה בה הבניין ראוי לשימוש.
                </p>
              </div>
            )}

            <table className="tax-table">
              <thead>
                <tr>
                  <th>פריט</th>
                  <th>סכום</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>הכנסות ממכירות</td>
                  <td>₪{fmt(revenue.recognizedRevenue)}</td>
                </tr>
                <tr>
                  <td>עלויות מיוחסות (סעיף 8א)</td>
                  <td>₪{fmt(revenue.allocatedCosts)}</td>
                </tr>
                <tr>
                  <td>הפרשה לאחריות</td>
                  <td>₪{fmt(revenue.warrantyProvision)}</td>
                </tr>
                <tr className="total-row">
                  <td>הכנסה חייבת</td>
                  <td>₪{fmt(revenue.taxableIncome)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Tax Breakdown */}
      <div className="card">
        <h2>פירוט מס הכנסה - מדרגות 2026</h2>

        <table className="tax-table">
          <thead>
            <tr>
              <th>מדרגה</th>
              <th>הכנסה במדרגה</th>
              <th>שיעור</th>
              <th>מס</th>
            </tr>
          </thead>
          <tbody>
            {tax.breakdown.map((b, i) => (
              <tr key={i}>
                <td>₪{fmt(b.from)} - ₪{fmt(b.to)}</td>
                <td>₪{fmt(b.taxableAmount)}</td>
                <td>{(b.rate * 100).toFixed(0)}%</td>
                <td>₪{fmt(b.tax)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="3">סה"כ מס הכנסה (לפני זיכויים)</td>
              <td>₪{fmt(tax.incomeTaxBeforeCredits)}</td>
            </tr>
          </tbody>
        </table>

        <table className="tax-table" style={{ marginTop: '1rem' }}>
          <tbody>
            <tr>
              <td>מס הכנסה לפני זיכויים</td>
              <td>₪{fmt(tax.incomeTaxBeforeCredits)}</td>
            </tr>
            <tr>
              <td>נקודות זיכוי ({tax.creditPoints} × ₪{fmt(2904)})</td>
              <td>(₪{fmt(tax.creditAmount)})</td>
            </tr>
            <tr>
              <td>מס הכנסה אחרי זיכויים</td>
              <td>₪{fmt(tax.incomeTaxAfterCredits)}</td>
            </tr>
            <tr>
              <td>ביטוח לאומי (עצמאי)</td>
              <td>₪{fmt(tax.nationalInsurance)}</td>
            </tr>
            <tr>
              <td>מס בריאות</td>
              <td>₪{fmt(tax.healthTax)}</td>
            </tr>
            <tr className="total-row">
              <td>סה"כ תשלומי מס ואגרות</td>
              <td>₪{fmt(tax.totalPayments)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="btn-group" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onReset}>
          חישוב חדש
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          הדפסה
        </button>
      </div>
    </div>
  );
}

export default TaxResults;
