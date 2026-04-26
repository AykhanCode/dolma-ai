import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface EngagementData {
  channel: string
  posts: number
  likes?: number
  comments?: number
}

interface EngagementChartProps {
  data: EngagementData[]
  type?: 'bar' | 'pie'
}

const COLORS = ['#00CC88', '#008855', '#75DBB7', '#A3E7CF', '#6B7280']

export function EngagementChart({ data, type = 'bar' }: EngagementChartProps) {
  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="posts"
            nameKey="channel"
            label={({ channel, percent }) => `${channel} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '12px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="channel" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="posts" name="Posts" fill="#00CC88" radius={[4, 4, 0, 0]} />
        {data[0]?.likes !== undefined && (
          <Bar dataKey="likes" name="Likes" fill="#75DBB7" radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
