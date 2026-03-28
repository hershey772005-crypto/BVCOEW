const patternColors = {
  'Consistent': '#22c55e',
  'Irregular': '#eab308',
  'Last-minute': '#ef4444'
};

export default function ExplanationCard({ student }) {
  if (!student) {
    return (
      <div className="explanation-placeholder">
        <p>🔍 Click on a student row to see detailed analysis</p>
      </div>
    );
  }

  const { pattern, features, reasoning, confidence } = student;

  return (
    <div className="explanation-card">
      <div 
        className="pattern-header"
        style={{ backgroundColor: patternColors[pattern] }}
      >
        <h3>{pattern}</h3>
        {confidence && <span className="confidence">Confidence: {confidence}</span>}
      </div>
      
      <div className="features-grid">
        <div className="feature-item">
          <span className="feature-label">Procrastination Index</span>
          <span className="feature-value">{features.PI}</span>
          <span className="feature-desc">(Day4 + Day5) / Total</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Coeff. of Variation</span>
          <span className="feature-value">{features.cv}</span>
          <span className="feature-desc">Normalized variability</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Standard Deviation</span>
          <span className="feature-value">{features.std}</span>
          <span className="feature-desc">Spread of study time</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Trend</span>
          <span className="feature-value">{features.trend}</span>
          <span className="feature-desc">Linear slope over days</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Early Index</span>
          <span className="feature-value">{features.EI}</span>
          <span className="feature-desc">(Day1 + Day2) / Total</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Total Minutes</span>
          <span className="feature-value">{features.total}</span>
          <span className="feature-desc">Sum of all days</span>
        </div>
      </div>

      <div className="reasoning-box">
        <h4>📝 Classification Reasoning</h4>
        <p>{reasoning}</p>
      </div>
    </div>
  );
}
