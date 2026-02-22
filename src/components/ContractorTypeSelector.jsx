function ContractorTypeSelector({ onSelect }) {
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
        </div>
      </div>
    </div>
  );
}

export default ContractorTypeSelector;
