const patternColors = {
  'Consistent': '#22c55e',
  'Irregular': '#eab308',
  'Last-minute': '#ef4444'
};

export default function DataTable({ students, selectedId, onSelect }) {
  if (!students || students.length === 0) {
    return <p className="no-data">No data loaded yet. Upload a CSV file to begin.</p>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Day 1</th>
            <th>Day 2</th>
            <th>Day 3</th>
            <th>Day 4</th>
            <th>Day 5</th>
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
