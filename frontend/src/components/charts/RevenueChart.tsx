import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface RevenueData {
  date: string
  revenue: number
  target?: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#00CC88"
          strokeWidth={2}
          dot={{ fill: '#00CC88', r: 4 }}
          activeDot={{ r: 6 }}
        />
        {data[0]?.target !== undefined && (
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#E5E7EB"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
