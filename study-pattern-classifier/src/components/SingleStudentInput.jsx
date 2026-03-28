import { useState } from 'react';

export default function SingleStudentInput({ onSubmit }) {
  const [numDays, setNumDays] = useState(5);
  const [minutes, setMinutes] = useState(['', '', '', '', '']);
  const [studentId, setStudentId] = useState('');

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value) || 5;
    const clamped = Math.min(Math.max(days, 2), 10);
    setNumDays(clamped);
    
    // Adjust minutes array
    const newMinutes = [...minutes];
    while (newMinutes.length < clamped) newMinutes.push('');
    while (newMinutes.length > clamped) newMinutes.pop();
    setMinutes(newMinutes);
  };

  const handleMinuteChange = (index, value) => {
    const newMinutes = [...minutes];
    newMinutes[index] = value;
    setMinutes(newMinutes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const days = minutes.map(m => parseFloat(m) || 0);
    if (days.every(d => d === 0)) {
      alert('Please enter study minutes for at least one day');
      return;
    }

    onSubmit({
      id: studentId || 'Student_1',
      days: days
    });
  };

  const handleClear = () => {
    setMinutes(Array(numDays).fill(''));
    setStudentId('');
  };

  return (
    <div className="single-input-container">
      <h3>Single Student Analysis</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <label>
            Student ID (optional):
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g., John Doe"
              className="text-input"
            />
          </label>
          
          <label>
            Number of Days:
            <input
              type="number"
              min="2"
              max="10"
              value={numDays}
              onChange={handleDaysChange}
              className="num-input"
            />
          </label>
        </div>

        <div className="days-grid">
          {minutes.map((val, idx) => (
            <div key={idx} className="day-input">
              <label>Day {idx + 1}</label>
              <input
                type="number"
                min="0"
                max="1440"
                value={val}
                onChange={(e) => handleMinuteChange(idx, e.target.value)}
                placeholder="mins"
                className="minute-input"
              />
            </div>
          ))}
        </div>

        <p className="input-hint">
          Enter study minutes per day (0-1440)
        </p>

        <div className="button-row">
          <button type="submit" className="submit-btn">
            Classify Pattern
          </button>
          <button type="button" onClick={handleClear} className="clear-btn">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
