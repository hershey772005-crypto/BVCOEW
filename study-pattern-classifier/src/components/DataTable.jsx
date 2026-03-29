const patternColors = {
  'Consistent': '#043f49',
  'Irregular': '#4e8c97',
  'Last-minute': '#6e6e6e'
};

export default function DataTable({ students, selectedId, onSelect }) {
  if (!students || students.length === 0) {
    return <p className="no-data">No data loaded yet. Upload a CSV file to begin.</p>;
  }

  // Get number of days from first student
  const numDays = students[0]?.days?.length || 0;

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student ID</th>
            {Array.from({ length: numDays }, (_, i) => (
              <th key={i}>Day {i + 1}</th>
            ))}
            <th>Pattern</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr 
              key={student.id}
              onClick={() => onSelect(student)}
              className={selectedId === student.id ? 'selected' : ''}
              style={{ cursor: 'pointer' }}
            >
              <td>{student.id}</td>
              {student.days.map((day, i) => (
                <td key={i}>{day}</td>
              ))}
              <td>
                <span 
                  className="pattern-badge"
                  style={{ backgroundColor: patternColors[student.pattern] }}
                >
                  {student.pattern}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
