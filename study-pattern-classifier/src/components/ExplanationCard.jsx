const patternColors = {
  'Consistent': '#2d6a7a',
  'Irregular': '#5a9cad',
  'Last-minute': '#8fbfd0'
};

export default function ExplanationCard({ student }) {
  if (!student) {
    return (
      <div className="explanation-placeholder">
        <p>Click on a student row to see detailed analysis</p>
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
        {confidence && <span className="confidence">{confidence} confidence</span>}
      </div>
      
      <div className="features-grid">
        <div className="feature-item">
          <span className="feature-label">PI</span>
          <span className="feature-value">{features.PI}</span>
          <span className="feature-desc">Procrastination</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">CV</span>
          <span className="feature-value">{features.cv}</span>
          <span className="feature-desc">Variability</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Std</span>
          <span className="feature-value">{features.std}</span>
          <span className="feature-desc">Deviation</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Trend</span>
          <span className="feature-value">{features.trend}</span>
          <span className="feature-desc">Slope</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">EI</span>
          <span className="feature-value">{features.EI}</span>
          <span className="feature-desc">Early Index</span>
        </div>
        
        <div className="feature-item">
          <span className="feature-label">Total</span>
          <span className="feature-value">{features.total}</span>
          <span className="feature-desc">Minutes</span>
        </div>
      </div>

      <div className="reasoning-box">
        <h4>Classification Reasoning</h4>
        <p>{reasoning}</p>
      </div>
    </div>
  );
}
