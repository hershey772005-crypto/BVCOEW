import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const patternColors = {
  'Consistent': '#2d6a7a',
  'Irregular': '#5a9cad',
  'Last-minute': '#8fbfd0'
};

export default function ChartView({ student }) {
  if (!student) {
    return (
      <div className="chart-placeholder">
        <p>Select a student to view their study pattern</p>
      </div>
    );
  }

  const chartData = student.days.map((minutes, index) => ({
    day: `Day ${index + 1}`,
    minutes: minutes
  }));

  const lineColor = patternColors[student.pattern] || '#4E8D9C';

  return (
    <div className="chart-container">
      <h3>Study Pattern: {student.id}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.15}/>
              <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 11, fill: '#718096' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#718096' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              fontSize: 12, 
              borderRadius: 6, 
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="minutes" 
            stroke={lineColor} 
            strokeWidth={2}
            fill="url(#colorGradient)"
            dot={{ fill: lineColor, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
