import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DataPoint {
  date: string
  conversations: number
  botHandled?: number
}

interface ConversationChartProps {
  data: DataPoint[]
}

export function ConversationChart({ data }: ConversationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="conversationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00CC88" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00CC88" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="botGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#008855" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#008855" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
          }}
        />
        <Area
          type="monotone"
          dataKey="conversations"
          name="Total"
          stroke="#00CC88"
          strokeWidth={2}
          fill="url(#conversationGradient)"
        />
        {data[0]?.botHandled !== undefined && (
          <Area
            type="monotone"
            dataKey="botHandled"
            name="Bot handled"
            stroke="#008855"
            strokeWidth={2}
            fill="url(#botGradient)"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
