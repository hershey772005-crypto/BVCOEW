const patternColors = {
  'Consistent': '#2d6a7a',
  'Irregular': '#5a9cad',
  'Last-minute': '#8fbfd0'
};

export default function Summary({ students }) {
  if (!students || students.length === 0) return null;

  const counts = students.reduce((acc, s) => {
    acc[s.pattern] = (acc[s.pattern] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="summary-container">
      <h3>Summary</h3>
      <div className="summary-cards">
        {['Consistent', 'Irregular', 'Last-minute'].map(pattern => (
          <div 
            key={pattern}
            className="summary-card"
            style={{ borderColor: patternColors[pattern] }}
          >
            <span className="count">{counts[pattern] || 0}</span>
            <span className="label">{pattern}</span>
          </div>
        ))}
        <div className="summary-card total">
          <span className="count">{students.length}</span>
          <span className="label">Total</span>
        </div>
      </div>
    </div>
  );
}
