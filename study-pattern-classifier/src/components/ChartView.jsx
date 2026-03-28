import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const patternColors = {
  'Consistent': '#22c55e',
  'Irregular': '#eab308',
  'Last-minute': '#ef4444'
};

export default function ChartView({ student }) {
  if (!student) {
    return (
      <div className="chart-placeholder">
        <p>📊 Select a student to view their study pattern</p>
      </div>
    );
  }

  const chartData = student.days.map((minutes, index) => ({
    day: `Day ${index + 1}`,
    minutes: minutes
  }));

  const lineColor = patternColors[student.pattern] || '#8884d8';

  return (
    <div className="chart-container">
      <h3>Study Pattern: {student.id}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="minutes" 
            stroke={lineColor} 
            strokeWidth={3}
            dot={{ fill: lineColor, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
