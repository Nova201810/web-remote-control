import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function TemperatureChart({ data }) {
  return (
    <LineChart width={730} height={320} data={data} margin={{ left: 30, bottom: 20, top: 10, right: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        type="number"
        dataKey="time"
        label={{ value: 'Время [ч]', position: 'insideBottom', offset: -10 }}
        domain={['auto', 'auto']}
      />
      <YAxis
        type="number"
        label={{ value: 'Температура [K]', angle: -90, position: 'insideBottomLeft', offset: -10 }}
        domain={['auto', 'auto']}
      />
      <Tooltip />
      <Legend />
      <Line type="monotone" legendType="none" dot={false} dataKey="value" stroke="#8884d8" strokeWidth="2" name="Температура [K]" />
    </LineChart>
  );
}