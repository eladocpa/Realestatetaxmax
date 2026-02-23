import { useState } from 'react';

function ContractorTypeSelector({ onSelect }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleConditions = (e, card) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === card ? null : card);
  };

  return (
    <div>
      <div className="card">
        <h2>בחר סוג קבלן</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ההבחנה בין סוגי הקבלנים משפיעה על שיטת הכרה בהכנסה ועל אופן חישוב המס
        </p>
      </div>

      <div className="type-selector">
        <div className="type-card" onClick={() => onSelect('operating')}>
          <div className="icon">🏗️</div>
          <h3>קבלן מבצע</h3>
          <div className="section-ref">סעיף 8א(א), 8א(ב)</div>
          <p>מבצע עבודות בניה עבור אחרים. עבודה ממושכת שביצועה עולה על שנה.</p>
          <ul className="features">
            <li>שיטת שיעור השלמה (עלות / הנדסי)</li>
            <li>שיטת מזומנים</li>
            <li>סף הכרה בהכנסה: 25%</li>
            <li>סף הכרה בהפסד: 50%</li>
            <li>תקן חשבונאות מספר 4</li>
          </ul>
          <button
            className="conditions-toggle"
            onClick={(e) => toggleConditions(e, 'operating')}
          >
            {expandedCard === 'operating' ? 'הסתר תנאים ▲' : 'תנאים להגדרה כקבלן מבצע ▼'}
          </button>
          {expandedCard === 'operating' && (
            <div className="conditions-panel" onClick={(e) => e.stopPropagation()}>
              <h4>מתי מסווגים כקבלן מבצע?</h4>
              <ul className="conditions-list">
                <li>
                  <strong>ביצוע עבודה עבור אחרים</strong> — מבצע עבודות בניה
                  על פי הזמנתו של אדם אחר (המזמין), להבדיל מבניה על קרקע שבבעלותו
                </li>
                <li>
                  <strong>עבודה ממושכת (מעל 12 חודשים)</strong> — משך ביצוע העבודה
                  עולה על שנה (12 חודשים קלנדריים, לא שנת מס). הפקודה אינה
                  מגבילה לקבלני בניין — כל מי שמבצע עבודה ממושכת נכנס להגדרה
                </li>
                <li>
                  <strong>הקרקע אינה בבעלות הקבלן</strong> — הקבלן אינו הבעלים
                  של הקרקע עליה מתבצעת הבניה. אם הקרקע בבעלותו — ייחשב כקבלן בונה
                </li>
                <li>
                  <strong>הכנסה לפי סעיף 2(1)</strong> — ההכנסות הן הכנסות מעסק
                  או משלח יד, בין מביצוע ובין ממכירה
                </li>
              </ul>

              <h4>מבחן הלכלוך (מבחן העפר)</h4>
              <p className="conditions-detail">
                על פי פס&quot;ד עקיבא לומינץ, ספירת משך העבודה מתחילה
                עם <strong>יציקת היסודות</strong> בפועל (לא ממועד החתימה על
                החוזה). הספירה נמשכת גם בעת הפסקות שהן חלק אינטגרלי מהבניה
                (גשמים, תזמון), אך נעצרת בהפסקות שאינן חלק מתהליך הבניה.
              </p>

              <h4>חריגים ומקרים מיוחדים</h4>
              <ul className="conditions-list">
                <li>
                  עבודה הניתנת להפרדה חוזית ובפועל לתתי-יחידות נפרדות,
                  והקבלן מדווח על בסיס הכנסות והוצאות בפועל — ייתכן שלא תיחשב
                  כעבודה ממושכת
                </li>
                <li>
                  קבלן מבצע שעבודתו קצרה משנה — לא ייכנס לגדרי סעיף 8א,
                  ולא לסעיף 18(ד) (יחידת עבודה)
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="type-card" onClick={() => onSelect('building')}>
          <div className="icon">🏢</div>
          <h3>קבלן בונה (יזם)</h3>
          <div className="section-ref">סעיף 8א(ג)</div>
          <p>בונה בניין על קרקע שבבעלותו ומוכר דירות. משך בניה מעל שנה.</p>
          <ul className="features">
            <li>שיטת שיעור השלמה</li>
            <li>שיטת מכירות (דווח בשנת מסירה)</li>
            <li>סף השלמה: 25% + מכירות: 50%</li>
            <li>נוסחת ייחוס עלויות לפי שטח</li>
            <li>תקן חשבונאות מספר 2</li>
          </ul>
          <button
            className="conditions-toggle"
            onClick={(e) => toggleConditions(e, 'building')}
          >
            {expandedCard === 'building' ? 'הסתר תנאים ▲' : 'תנאים להגדרה כקבלן בונה ▼'}
          </button>
          {expandedCard === 'building' && (
            <div className="conditions-panel" onClick={(e) => e.stopPropagation()}>
              <h4>מתי מסווגים כקבלן בונה?</h4>
              <ul className="conditions-list">
                <li>
                  <strong>בעלות על הקרקע</strong> — הנישום רוכש מגרש (או בעל
                  זכויות בקרקע), בונה עליו ומוכר את המוצר שבנה. זהו המאפיין
                  המרכזי המבדיל מקבלן מבצע
                </li>
                <li>
                  <strong>בניית בניין בידי בעלו</strong> — הפקודה מגדירה
                  &quot;בניין&quot; כבניין שבנה בעלו, אשר משך בנייתו עולה על שנה
                  (12 חודשים). ההגדרה ממעטת בניה על ידי אדם אחר
                </li>
                <li>
                  <strong>משך בניה מעל 12 חודשים</strong> — הכוונה ל-12 חודשים
                  קלנדריים (לא שנת מס). הספירה מתחילה מיציקת היסודות
                  ומסתיימת כשהבניין ראוי לשימוש
                </li>
                <li>
                  <strong>מכירת המוצר כהכנסה מעסק</strong> — ההכנסות הן ממכירת
                  הבניין לפי סעיף מקור 2(1). אין חשיבות לצורת השיווק
                  (דירות, משרדים, מסחרי וכו&apos;)
                </li>
              </ul>

              <h4>מתי הבניין &quot;ראוי לשימוש&quot;?</h4>
              <p className="conditions-detail">
                לפי סעיף 8א(ג), הבניין ראוי לשימוש כאשר התקיים <strong>אחד
                מהתנאים</strong>: (1) הבניין חובר לרשת החשמל, או (2) נתקיימו
                לגביו התנאים לקבלת תעודת גמר בניה — אין דרישה לקבלת תעודה
                בפועל. ההכנסה מוכרת בשנת המס הראשונה בה הבניין ראוי לשימוש
                ובוצעה מכירה.
              </p>

              <h4>נוסחת ייחוס עלויות (מכירה חלקית)</h4>
              <p className="conditions-detail">
                כאשר נמכר חלק מהבניין, העלויות המיוחסות מחושבות לפי הנוסחה:
                (שטח החלק הנמכר ללא חניה ÷ שטח הבניין כולו ללא חניה) × עלויות
                הבניה של כל הבניין (כולל עלות הקרקע). בנוסף, ניתן להכיר בהפרשה
                לאחריות של עד 1.5% מעלויות הפרויקט.
              </p>

              <h4>הגדרת &quot;בניין&quot;</h4>
              <p className="conditions-detail">
                ההגדרה בסעיף 8א אינה מפורטת. בהתאם לחוק התכנון והבניה, בניין
                הוא &quot;היחידה התכנונית בגינה יש להוציא היתר בניה&quot; — כל
                יחידה תכנונית שניתן להוציא עבורה היתר בניה נחשבת כבניין לצורך
                הסעיף.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractorTypeSelector;
