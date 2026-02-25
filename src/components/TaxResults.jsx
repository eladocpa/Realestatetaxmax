const fmt = (n) => new Intl.NumberFormat('he-IL').format(Math.round(n));

function TaxResults({ results, onReset }) {
  const { contractorType, entityType, method, revenue, tax, comparison, methodComparison } = results;

  const isBuilding = contractorType === 'building';
  const isCorporation = entityType === 'corporation';
  const isPercentage = method === 'percentage';
  const isCash = method === 'cash';
  const isSales = method === 'sales';

  const contractorLabel = isBuilding ? 'קבלן בונה (יזם)' : 'קבלן מבצע';

  return (
    <div className="results-container">
      {/* Method Comparison - Recommendation */}
      {methodComparison && (
        <div className="card">
          <h2>המלצת שיטת דיווח</h2>

          <div className="recommendation-box">
            {methodComparison.recommended === 'equal' ? (
              <p className="recommendation-text">
                שתי השיטות מניבות תוצאה זהה מבחינת מס.
              </p>
            ) : (
              <p className="recommendation-text">
                <span className="recommendation-label">השיטה המומלצת:</span>{' '}
                <strong className="recommended-method">
                  {methodComparison.recommended === 'percentage' && 'שיטת שיעור השלמה'}
                  {methodComparison.recommended === 'cash' && 'שיטת מזומנים'}
                  {methodComparison.recommended === 'sales' && 'שיטת מכירות'}
                </strong>
                <br />
                חיסכון של <strong>₪{fmt(methodComparison.savings)}</strong> בתשלומי מס
              </p>
            )}
          </div>

          <div className="comparison-grid">
            {Object.entries(methodComparison).map(([key, val]) => {
              if (key === 'recommended' || key === 'savings') return null;
              const methodName = key === 'percentage' ? 'שיעור השלמה' : key === 'cash' ? 'מזומנים' : 'מכירות';
              const isRecommended = methodComparison.recommended === key;

              return (
                <div key={key} className={`comparison-card ${isRecommended ? 'recommended' : ''}`}>
                  {isRecommended && <div className="recommended-badge">מומלץ</div>}
                  <h4>{methodName}</h4>
                  <div className="comparison-details">
                    <div className="comparison-row">
                      <span>הכנסה חייבת</span>
                      <span>₪{fmt(val.revenue.taxableIncome)}</span>
                    </div>
                    <div className="comparison-row">
                      <span>מס הכנסה</span>
                      <span>₪{fmt(val.tax.incomeTaxAfterCredits)}</span>
                    </div>
                    <div className="comparison-row">
                      <span>ביטוח לאומי</span>
                      <span>₪{fmt(val.tax.nationalInsurance)}</span>
                    </div>
                    <div className="comparison-row">
                      <span>מס בריאות</span>
                      <span>₪{fmt(val.tax.healthTax)}</span>
                    </div>
                    <div className="comparison-row total">
                      <span>סה"כ תשלומים</span>
                      <span>₪{fmt(val.tax.totalPayments)}</span>
                    </div>
                    <div className="comparison-row">
                      <span>הכנסה נטו</span>
                      <span>₪{fmt(val.tax.netIncome)}</span>
                    </div>
                    <div className="comparison-row">
                      <span>שיעור מס אפקטיבי</span>
                      <span>{val.tax.effectiveRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Corporate vs Individual Comparison */}
      {isCorporation && comparison && (
        <div className="card">
          <h2>השוואת מיסוי: חברה מול יחיד</h2>

          <div className="recommendation-box">
            {comparison.corporate.totalPayments < comparison.individual.totalPayments ? (
              <p className="recommendation-text">
                <span className="recommendation-label">מיסוי כחברה כדאי יותר</span>
                <br />
                חיסכון במס חברות (ללא חלוקת דיבידנד): <strong>₪{fmt(comparison.individual.totalPayments - comparison.corporate.totalPayments)}</strong>
                {comparison.corporate.totalTaxWithDividend < comparison.individual.totalPayments && (
                  <>
                    <br />
                    גם עם חלוקת דיבידנד מלאה, החיסכון: <strong>₪{fmt(comparison.individual.totalPayments - comparison.corporate.totalTaxWithDividend)}</strong>
                  </>
                )}
                {comparison.corporate.totalTaxWithDividend >= comparison.individual.totalPayments && (
                  <>
                    <br />
                    <span style={{ color: '#fbbf24' }}>שימו לב: בעת חלוקת דיבידנד מלאה, המיסוי כיחיד עשוי להיות כדאי יותר</span>
                  </>
                )}
              </p>
            ) : (
              <p className="recommendation-text">
                <span className="recommendation-label">מיסוי כיחיד כדאי יותר</span>
                <br />
                חיסכון: <strong>₪{fmt(comparison.corporate.totalPayments - comparison.individual.totalPayments)}</strong> לעומת מס חברות
              </p>
            )}
          </div>

          <div className="comparison-grid">
            {/* חברה */}
            <div className={`comparison-card ${comparison.corporate.totalPayments <= comparison.individual.totalPayments ? 'recommended' : ''}`}>
              {comparison.corporate.totalPayments <= comparison.individual.totalPayments && <div className="recommended-badge">כדאי יותר</div>}
              <h4>חברה (מס חברות)</h4>
              <div className="comparison-details">
                <div className="comparison-row">
                  <span>הכנסה חייבת</span>
                  <span>₪{fmt(comparison.corporate.taxableIncome)}</span>
                </div>
                <div className="comparison-row">
                  <span>מס חברות (23%)</span>
                  <span>₪{fmt(comparison.corporate.corporateTax)}</span>
                </div>
                <div className="comparison-row total">
                  <span>רווח לאחר מס חברות</span>
                  <span>₪{fmt(comparison.corporate.profitAfterCorporateTax)}</span>
                </div>
                <div className="comparison-row" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>מס על דיבידנד ({(comparison.corporate.dividendRate * 100)}%)</span>
                  <span>₪{fmt(comparison.corporate.dividendTax)}</span>
                </div>
                {comparison.corporate.surtax > 0 && (
                  <div className="comparison-row" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span>מס יסף (3%)</span>
                    <span>₪{fmt(comparison.corporate.surtax)}</span>
                  </div>
                )}
                <div className="comparison-row" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>סה"כ עם דיבידנד</span>
                  <span>₪{fmt(comparison.corporate.totalTaxWithDividend)}</span>
                </div>
                <div className="comparison-row">
                  <span>שיעור אפקטיבי (ברמת החברה)</span>
                  <span>{comparison.corporate.effectiveRateCorporateOnly}%</span>
                </div>
                <div className="comparison-row" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>שיעור אפקטיבי (כולל דיבידנד)</span>
                  <span>{comparison.corporate.effectiveRateWithDividend}%</span>
                </div>
              </div>
            </div>

            {/* יחיד */}
            <div className={`comparison-card ${comparison.individual.totalPayments < comparison.corporate.totalPayments ? 'recommended' : ''}`}>
              {comparison.individual.totalPayments < comparison.corporate.totalPayments && <div className="recommended-badge">כדאי יותר</div>}
              <h4>יחיד (עצמאי)</h4>
              <div className="comparison-details">
                <div className="comparison-row">
                  <span>הכנסה חייבת</span>
                  <span>₪{fmt(comparison.individual.taxableIncome)}</span>
                </div>
                <div className="comparison-row">
                  <span>מס הכנסה (אחרי זיכויים)</span>
                  <span>₪{fmt(comparison.individual.incomeTaxAfterCredits)}</span>
                </div>
                <div className="comparison-row">
                  <span>ביטוח לאומי</span>
                  <span>₪{fmt(comparison.individual.nationalInsurance)}</span>
                </div>
                <div className="comparison-row">
                  <span>מס בריאות</span>
                  <span>₪{fmt(comparison.individual.healthTax)}</span>
                </div>
                <div className="comparison-row total">
                  <span>סה"כ תשלומים</span>
                  <span>₪{fmt(comparison.individual.totalPayments)}</span>
                </div>
                <div className="comparison-row">
                  <span>הכנסה נטו</span>
                  <span>₪{fmt(comparison.individual.netIncome)}</span>
                </div>
                <div className="comparison-row">
                  <span>שיעור מס אפקטיבי</span>
                  <span>{comparison.individual.effectiveRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="card">
        <h2>
          {isCorporation ? `תאגיד — ${contractorLabel}` : contractorLabel} - תוצאות חישוב
        </h2>

        {isCorporation ? (
          <div className="result-summary">
            <div className="result-box">
              <div className="label">הכנסה חייבת</div>
              <div className={`value ${tax.taxableIncome > 0 ? 'highlight' : ''}`}>
                ₪{fmt(tax.taxableIncome)}
              </div>
            </div>
            <div className="result-box">
              <div className="label">מס חברות (23%)</div>
              <div className="value negative">₪{fmt(tax.corporateTax)}</div>
            </div>
            <div className="result-box">
              <div className="label">רווח אחרי מס חברות</div>
              <div className={`value ${tax.profitAfterCorporateTax >= 0 ? 'positive' : 'negative'}`}>
                ₪{fmt(tax.profitAfterCorporateTax)}
              </div>
            </div>
            <div className="result-box">
              <div className="label">מס על דיבידנד ({(tax.dividendRate * 100)}%)</div>
              <div className="value negative">₪{fmt(tax.dividendTax)}</div>
            </div>
            <div className="result-box">
              <div className="label">סה"כ מס (כולל דיבידנד)</div>
              <div className="value negative">₪{fmt(tax.totalTaxWithDividend)}</div>
            </div>
            <div className="result-box">
              <div className="label">נטו אחרי דיבידנד</div>
              <div className={`value ${tax.netIncomeAfterDividend >= 0 ? 'positive' : 'negative'}`}>
                ₪{fmt(tax.netIncomeAfterDividend)}
              </div>
            </div>
            <div className="result-box">
              <div className="label">שיעור אפקטיבי (חברה)</div>
              <div className="value">{tax.effectiveRateCorporateOnly}%</div>
            </div>
          </div>
        ) : (
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
        )}
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
        <h2>{isCorporation ? 'פירוט מס חברות' : 'פירוט מס הכנסה - מדרגות 2026'}</h2>

        {isCorporation ? (
          <table className="tax-table">
            <tbody>
              <tr>
                <td>הכנסה חייבת</td>
                <td>₪{fmt(tax.taxableIncome)}</td>
              </tr>
              <tr>
                <td>מס חברות ({(tax.corporateTaxRate * 100)}%)</td>
                <td>₪{fmt(tax.corporateTax)}</td>
              </tr>
              <tr className="total-row">
                <td>רווח לאחר מס חברות</td>
                <td>₪{fmt(tax.profitAfterCorporateTax)}</td>
              </tr>
              <tr>
                <td colSpan="2" style={{ color: '#94a3b8', fontSize: '0.85rem', paddingTop: '1rem' }}>
                  חישוב מס על דיבידנד (בהנחת חלוקה מלאה):
                </td>
              </tr>
              <tr>
                <td>מס על דיבידנד ({(tax.dividendRate * 100)}%{tax.isMajorShareholder ? ' — בעל מניות מהותי' : ''})</td>
                <td>₪{fmt(tax.dividendTax)}</td>
              </tr>
              {tax.surtax > 0 && (
                <tr>
                  <td>מס יסף (3%)</td>
                  <td>₪{fmt(tax.surtax)}</td>
                </tr>
              )}
              <tr className="total-row">
                <td>סה"כ מס (כולל דיבידנד)</td>
                <td>₪{fmt(tax.totalTaxWithDividend)}</td>
              </tr>
              <tr>
                <td>שיעור מס אפקטיבי (ברמת החברה)</td>
                <td>{tax.effectiveRateCorporateOnly}%</td>
              </tr>
              <tr>
                <td>שיעור מס אפקטיבי (כולל דיבידנד)</td>
                <td>{tax.effectiveRateWithDividend}%</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
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
          </>
        )}
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
