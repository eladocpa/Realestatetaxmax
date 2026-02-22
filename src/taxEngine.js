/**
 * מנוע חישוב מס לקבלנים - שנת מס 2026
 * Tax Calculation Engine for Contractors - Tax Year 2026
 *
 * Based on:
 * - Section 8a of the Israeli Income Tax Ordinance (פקודת מס הכנסה)
 * - Accounting Standard No. 2 (תקן חשבונאות מספר 2) - Building Contractor
 * - Accounting Standard No. 4 (תקן חשבונאות מספר 4) - Operating Contractor
 * - 2026 Tax Brackets (מדרגות מס הכנסה 2026)
 */

// מדרגות מס הכנסה 2026 - הכנסה מיגיעה אישית
export const TAX_BRACKETS_2026_EARNED = [
  { from: 0, to: 84120, rate: 0.10 },
  { from: 84120, to: 120720, rate: 0.14 },
  { from: 120720, to: 193800, rate: 0.20 },
  { from: 193800, to: 269280, rate: 0.31 },
  { from: 269280, to: 560280, rate: 0.35 },
  { from: 560280, to: 721560, rate: 0.47 },
  { from: 721560, to: Infinity, rate: 0.50 }, // כולל מס יסף 3%
];

// מדרגות מס הכנסה 2026 - הכנסה שלא מיגיעה אישית (מתחת לגיל 60)
export const TAX_BRACKETS_2026_UNEARNED = [
  { from: 0, to: 269280, rate: 0.31 },
  { from: 269280, to: 560280, rate: 0.35 },
  { from: 560280, to: 721560, rate: 0.47 },
  { from: 721560, to: Infinity, rate: 0.52 }, // כולל מס יסף 5%
];

// סף מס יסף 2026
export const SURTAX_THRESHOLD = 721560;
export const SURTAX_RATE_EARNED = 0.03; // 3% מס יסף על הכנסה מיגיעה אישית
export const SURTAX_RATE_UNEARNED = 0.05; // 5% מס יסף על הכנסה שלא מיגיעה אישית

// ערך נקודת זיכוי 2026
export const CREDIT_POINT_VALUE = 2904; // שנתי

// ביטוח לאומי ומס בריאות - שיעורים לעצמאים 2026
export const NATIONAL_INSURANCE = {
  reducedThreshold: 7522 * 12, // 60% מהשכר הממוצע - שנתי
  reducedRate: 0.0266, // שיעור מופחת ביטוח לאומי
  fullRate: 0.1217, // שיעור מלא ביטוח לאומי
  maxIncome: 49030 * 12, // תקרת הכנסה חייבת - שנתי
};

export const HEALTH_TAX = {
  reducedThreshold: 7522 * 12,
  reducedRate: 0.031,
  fullRate: 0.05,
  maxIncome: 49030 * 12,
};

// הפרשה לאחריות - עד 1.5% מעלויות הפרויקט
export const WARRANTY_PROVISION_RATE = 0.015;

/**
 * חישוב מס הכנסה לפי מדרגות
 */
export function calculateIncomeTax(taxableIncome, brackets = TAX_BRACKETS_2026_EARNED) {
  let tax = 0;
  const breakdown = [];

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.from) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.to) - bracket.from;
    const taxForBracket = taxableInBracket * bracket.rate;
    tax += taxForBracket;

    breakdown.push({
      from: bracket.from,
      to: Math.min(taxableIncome, bracket.to),
      rate: bracket.rate,
      taxableAmount: taxableInBracket,
      tax: taxForBracket,
    });
  }

  return { totalTax: tax, breakdown };
}

/**
 * חישוב ביטוח לאומי לעצמאים
 */
export function calculateNationalInsurance(annualIncome) {
  const cappedIncome = Math.min(annualIncome, NATIONAL_INSURANCE.maxIncome);
  const reducedPortion = Math.min(cappedIncome, NATIONAL_INSURANCE.reducedThreshold);
  const fullPortion = Math.max(0, cappedIncome - NATIONAL_INSURANCE.reducedThreshold);

  return reducedPortion * NATIONAL_INSURANCE.reducedRate + fullPortion * NATIONAL_INSURANCE.fullRate;
}

/**
 * חישוב מס בריאות לעצמאים
 */
export function calculateHealthTax(annualIncome) {
  const cappedIncome = Math.min(annualIncome, HEALTH_TAX.maxIncome);
  const reducedPortion = Math.min(cappedIncome, HEALTH_TAX.reducedThreshold);
  const fullPortion = Math.max(0, cappedIncome - HEALTH_TAX.reducedThreshold);

  return reducedPortion * HEALTH_TAX.reducedRate + fullPortion * HEALTH_TAX.fullRate;
}

/**
 * חישוב נקודות זיכוי
 */
export function calculateCreditPoints(points) {
  return points * CREDIT_POINT_VALUE;
}

// ============================================================
// קבלן מבצע - Operating Contractor (Section 8a(a), 8a(b))
// ============================================================

/**
 * חישוב שיעור השלמה לפי עלות - קבלן מבצע
 * Percentage of completion by cost method
 *
 * @param {number} actualCosts - עלויות בפועל עד כה
 * @param {number} estimatedTotalCosts - סך עלויות צפויות
 * @returns {number} שיעור השלמה (0-1)
 */
export function completionPercentageByCost(actualCosts, estimatedTotalCosts) {
  if (estimatedTotalCosts <= 0) return 0;
  return Math.min(actualCosts / estimatedTotalCosts, 1);
}

/**
 * חישוב שיעור השלמה הנדסי - קבלן מבצע
 * Engineering percentage of completion
 *
 * @param {number} engineeringPercentage - אחוז השלמה כפי שנקבע ע"י מהנדס (0-100)
 * @returns {number} שיעור השלמה (0-1)
 */
export function completionPercentageByEngineering(engineeringPercentage) {
  return Math.min(Math.max(engineeringPercentage / 100, 0), 1);
}

/**
 * הכרה בהכנסה - קבלן מבצע - שיטת שיעור השלמה
 * Revenue recognition - Operating contractor - Percentage of completion
 *
 * Section 8a(a): Revenue recognized when completion >= 25%
 * Loss recognized when completion >= 50%
 *
 * @param {object} params
 * @param {number} params.contractAmount - סכום ההזמנה/החוזה
 * @param {number} params.estimatedTotalCosts - סך עלויות צפויות
 * @param {number} params.actualCostsToDate - עלויות בפועל עד כה
 * @param {number} params.actualCostsPriorYears - עלויות בפועל בשנים קודמות
 * @param {number} params.revenueRecognizedPrior - הכנסה שהוכרה בשנים קודמות
 * @param {string} params.completionMethod - שיטת חישוב: 'cost' או 'engineering'
 * @param {number} params.engineeringPct - אחוז השלמה הנדסי (אם רלוונטי)
 * @returns {object}
 */
export function calcOperatingContractorPercentage(params) {
  const {
    contractAmount,
    estimatedTotalCosts,
    actualCostsToDate,
    actualCostsPriorYears = 0,
    revenueRecognizedPrior = 0,
    completionMethod = 'cost',
    engineeringPct = 0,
  } = params;

  // חישוב שיעור השלמה
  let completionRate;
  if (completionMethod === 'cost') {
    completionRate = completionPercentageByCost(actualCostsToDate, estimatedTotalCosts);
  } else {
    completionRate = completionPercentageByEngineering(engineeringPct);
  }

  // שיעור השלמה בשנים קודמות
  let priorCompletionRate;
  if (completionMethod === 'cost') {
    priorCompletionRate = completionPercentageByCost(actualCostsPriorYears, estimatedTotalCosts);
  } else {
    priorCompletionRate = 0; // יש לספק בנפרד
  }

  const estimatedProfit = contractAmount - estimatedTotalCosts;
  const isProfit = estimatedProfit >= 0;

  // בדיקת סף 25% להכרה בהכנסה
  const meetsRevenueThreshold = completionRate >= 0.25;
  // בדיקת סף 50% להכרה בהפסד
  const meetsLossThreshold = completionRate >= 0.50;

  let recognizedRevenue = 0;
  let recognizedCosts = 0;
  let recognizedProfit = 0;
  let currentYearRevenue = 0;
  let currentYearCosts = 0;
  let currentYearProfit = 0;

  if (isProfit && meetsRevenueThreshold) {
    // הכרה ברווח: הכנסה מוכרת = שיעור השלמה × סכום החוזה
    recognizedRevenue = completionRate * contractAmount;
    recognizedCosts = completionRate * estimatedTotalCosts;
    recognizedProfit = recognizedRevenue - recognizedCosts;

    currentYearRevenue = recognizedRevenue - revenueRecognizedPrior;
    currentYearCosts = actualCostsToDate - actualCostsPriorYears;
    currentYearProfit = currentYearRevenue - currentYearCosts;
  } else if (!isProfit && meetsLossThreshold) {
    // הכרה בהפסד: רק כאשר שיעור השלמה >= 50%
    recognizedRevenue = completionRate * contractAmount;
    recognizedCosts = completionRate * estimatedTotalCosts;
    recognizedProfit = recognizedRevenue - recognizedCosts;

    currentYearRevenue = recognizedRevenue - revenueRecognizedPrior;
    currentYearCosts = actualCostsToDate - actualCostsPriorYears;
    currentYearProfit = currentYearRevenue - currentYearCosts;
  } else if (!isProfit && !meetsLossThreshold && meetsRevenueThreshold) {
    // מצב מיוחד: יש הפסד אבל אין סף 50% - מכירים בהכנסות ועלויות לפי השלמה
    recognizedRevenue = completionRate * contractAmount;
    recognizedCosts = completionRate * contractAmount; // לא מכירים בהפסד
    recognizedProfit = 0;

    currentYearRevenue = recognizedRevenue - revenueRecognizedPrior;
    currentYearCosts = currentYearRevenue;
    currentYearProfit = 0;
  }

  return {
    completionRate,
    completionPercentage: (completionRate * 100).toFixed(1),
    meetsRevenueThreshold,
    meetsLossThreshold,
    isProfit,
    estimatedProfit,
    contractAmount,
    estimatedTotalCosts,
    recognizedRevenue,
    recognizedCosts,
    recognizedProfit,
    currentYearRevenue,
    currentYearCosts,
    currentYearProfit,
    taxableIncome: Math.max(0, currentYearProfit),
  };
}

/**
 * קבלן מבצע - שיטת מזומנים
 * Operating contractor - Cash basis method
 *
 * @param {object} params
 * @param {number} params.cashReceived - מזומנים שנתקבלו בשנת המס
 * @param {number} params.expensesPaid - הוצאות ששולמו בשנת המס
 * @returns {object}
 */
export function calcOperatingContractorCash(params) {
  const { cashReceived, expensesPaid } = params;

  const taxableIncome = Math.max(0, cashReceived - expensesPaid);

  return {
    cashReceived,
    expensesPaid,
    currentYearProfit: cashReceived - expensesPaid,
    taxableIncome,
  };
}

// ============================================================
// קבלן בונה - Building Contractor (Section 8a(c))
// ============================================================

/**
 * חישוב ייחוס עלויות לחלק נמכר - נוסחת סעיף 8א
 * Cost allocation formula per Section 8a
 *
 * עלויות מיוחסות = (שטח הנמכר / שטח כל הבניין) × עלויות בניה כולל קרקע
 * (Excluding parking from area calculations)
 *
 * @param {number} soldArea - שטח החלק הנמכר (ללא חניה)
 * @param {number} totalBuildingArea - שטח הבניין כולו (ללא חניה)
 * @param {number} totalCosts - עלויות בניה כולל קרקע
 * @returns {number} עלויות מיוחסות
 */
export function allocateCostsByArea(soldArea, totalBuildingArea, totalCosts) {
  if (totalBuildingArea <= 0) return 0;
  return (soldArea / totalBuildingArea) * totalCosts;
}

/**
 * הכרה בהכנסה - קבלן בונה (יזם) - שיטת שיעור השלמה
 * Revenue recognition - Building contractor - Percentage of completion
 *
 * Per Accounting Standard No. 2:
 * - Completion >= 25%
 * - Accumulated sales >= 50% of projected sales
 * - Building must be "ready for use" (connected to grid / meets completion certificate conditions)
 *
 * @param {object} params
 * @param {number} params.totalProjectedSales - סך מכירות צפויות
 * @param {number} params.accumulatedSales - מכירות שנצברו (חוזים חתומים)
 * @param {number} params.estimatedTotalCosts - סך עלויות צפויות (כולל קרקע)
 * @param {number} params.actualCostsToDate - עלויות בפועל עד כה
 * @param {number} params.actualCostsPriorYears - עלויות בשנים קודמות
 * @param {number} params.revenueRecognizedPrior - הכנסה שהוכרה בשנים קודמות
 * @param {number} params.costsRecognizedPrior - עלויות שהוכרו בשנים קודמות
 * @param {boolean} params.isReadyForUse - האם הבניין ראוי לשימוש
 * @param {number} params.soldArea - שטח שנמכר (ללא חניה)
 * @param {number} params.totalArea - שטח כולל (ללא חניה)
 * @param {number} params.warrantyProvisionRate - שיעור הפרשה לאחריות (ברירת מחדל 1.5%)
 * @returns {object}
 */
export function calcBuildingContractorPercentage(params) {
  const {
    totalProjectedSales,
    accumulatedSales,
    estimatedTotalCosts,
    actualCostsToDate,
    actualCostsPriorYears = 0,
    revenueRecognizedPrior = 0,
    costsRecognizedPrior = 0,
    isReadyForUse = false,
    soldArea = 0,
    totalArea = 0,
    warrantyProvisionRate = WARRANTY_PROVISION_RATE,
  } = params;

  // שיעור השלמה לפי עלות
  const completionRate = completionPercentageByCost(actualCostsToDate, estimatedTotalCosts);
  const completionPercentage = (completionRate * 100).toFixed(1);

  // בדיקת תנאים להכרה בהכנסה - תקן 2
  const meetsCompletionThreshold = completionRate >= 0.25;
  const salesRatio = totalProjectedSales > 0 ? accumulatedSales / totalProjectedSales : 0;
  const meetsSalesThreshold = salesRatio >= 0.50;

  // עלויות מיוחסות לחלק הנמכר (נוסחת סעיף 8א)
  const allocatedCosts = allocateCostsByArea(soldArea, totalArea, estimatedTotalCosts);

  // הפרשה לאחריות
  const warrantyProvision = estimatedTotalCosts * warrantyProvisionRate;

  const estimatedProfit = totalProjectedSales - estimatedTotalCosts - warrantyProvision;
  const isProfit = estimatedProfit >= 0;

  let recognizedRevenue = 0;
  let recognizedCosts = 0;
  let recognizedProfit = 0;
  let currentYearRevenue = 0;
  let currentYearCosts = 0;
  let currentYearProfit = 0;

  // התנאים להכרה בהכנסה אצל קבלן בונה:
  // 1. הבניין ראוי לשימוש (חיבור חשמל או תנאי תעודת גמר)
  // 2. שיעור השלמה >= 25%
  // 3. מכירות מצטברות >= 50% מסך המכירות הצפויות
  const canRecognizeRevenue = isReadyForUse && meetsCompletionThreshold && meetsSalesThreshold;

  if (canRecognizeRevenue) {
    // הכנסה מוכרת = שיעור השלמה × סך מכירות
    recognizedRevenue = completionRate * totalProjectedSales;
    // עלויות מוכרות = שיעור השלמה × סך עלויות + הפרשה לאחריות
    recognizedCosts = completionRate * (estimatedTotalCosts + warrantyProvision);

    recognizedProfit = recognizedRevenue - recognizedCosts;

    currentYearRevenue = recognizedRevenue - revenueRecognizedPrior;
    currentYearCosts = recognizedCosts - costsRecognizedPrior;
    currentYearProfit = currentYearRevenue - currentYearCosts;
  }

  return {
    completionRate,
    completionPercentage,
    meetsCompletionThreshold,
    meetsSalesThreshold,
    salesRatio: (salesRatio * 100).toFixed(1),
    isReadyForUse,
    canRecognizeRevenue,
    isProfit,
    estimatedProfit,
    totalProjectedSales,
    estimatedTotalCosts,
    allocatedCosts,
    warrantyProvision,
    recognizedRevenue,
    recognizedCosts,
    recognizedProfit,
    currentYearRevenue,
    currentYearCosts,
    currentYearProfit,
    taxableIncome: Math.max(0, currentYearProfit),
  };
}

/**
 * קבלן בונה - שיטת מכירות (דווח בשנת מסירה)
 * Building contractor - Sales method (report in year of delivery)
 *
 * Revenue recognized in the first year the building is ready for use.
 *
 * @param {object} params
 * @param {number} params.salesRevenue - הכנסות ממכירות בשנת המס
 * @param {number} params.totalCosts - סך עלויות הפרויקט (כולל קרקע)
 * @param {number} params.soldArea - שטח שנמכר
 * @param {number} params.totalArea - שטח כולל
 * @param {boolean} params.isReadyForUse - האם הבניין ראוי לשימוש
 * @param {number} params.warrantyProvisionRate - שיעור הפרשה לאחריות
 * @returns {object}
 */
export function calcBuildingContractorSales(params) {
  const {
    salesRevenue,
    totalCosts,
    soldArea,
    totalArea,
    isReadyForUse = false,
    warrantyProvisionRate = WARRANTY_PROVISION_RATE,
  } = params;

  // ייחוס עלויות לפי שטח (נוסחת סעיף 8א)
  const allocatedCosts = allocateCostsByArea(soldArea, totalArea, totalCosts);
  const warrantyProvision = totalCosts * warrantyProvisionRate;
  const allocatedWarranty = allocateCostsByArea(soldArea, totalArea, warrantyProvision);

  let recognizedRevenue = 0;
  let recognizedCosts = 0;
  let currentYearProfit = 0;

  if (isReadyForUse) {
    recognizedRevenue = salesRevenue;
    recognizedCosts = allocatedCosts + allocatedWarranty;
    currentYearProfit = recognizedRevenue - recognizedCosts;
  }

  return {
    isReadyForUse,
    salesRevenue,
    totalCosts,
    allocatedCosts,
    warrantyProvision: allocatedWarranty,
    recognizedRevenue,
    recognizedCosts,
    currentYearProfit,
    taxableIncome: Math.max(0, currentYearProfit),
  };
}

/**
 * חישוב מס כולל - סיכום כולל
 * Full tax calculation summary
 *
 * @param {number} taxableIncome - הכנסה חייבת
 * @param {number} creditPoints - נקודות זיכוי
 * @param {boolean} isEarnedIncome - האם הכנסה מיגיעה אישית
 * @returns {object}
 */
export function calculateFullTax(taxableIncome, creditPoints = 2.25, isEarnedIncome = true) {
  const brackets = isEarnedIncome ? TAX_BRACKETS_2026_EARNED : TAX_BRACKETS_2026_UNEARNED;
  const { totalTax, breakdown } = calculateIncomeTax(taxableIncome, brackets);

  const creditAmount = calculateCreditPoints(creditPoints);
  const incomeTaxAfterCredits = Math.max(0, totalTax - creditAmount);

  const nationalInsurance = calculateNationalInsurance(taxableIncome);
  const healthTax = calculateHealthTax(taxableIncome);

  const totalPayments = incomeTaxAfterCredits + nationalInsurance + healthTax;
  const effectiveRate = taxableIncome > 0 ? (totalPayments / taxableIncome) * 100 : 0;
  const netIncome = taxableIncome - totalPayments;

  return {
    taxableIncome,
    incomeTaxBeforeCredits: totalTax,
    creditPoints,
    creditAmount,
    incomeTaxAfterCredits,
    nationalInsurance,
    healthTax,
    totalPayments,
    effectiveRate: effectiveRate.toFixed(1),
    netIncome,
    breakdown,
  };
}
