import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 48000, expenses: 31000 },
  { month: "Mar", revenue: 45000, expenses: 26000 },
  { month: "Apr", revenue: 56000, expenses: 34000 },
  { month: "May", revenue: 52000, expenses: 29000 },
  { month: "Jun", revenue: 61000, expenses: 32000 },
  { month: "Jul", revenue: 58000, expenses: 35000 },
  { month: "Aug", revenue: 72000, expenses: 38000 },
  { month: "Sep", revenue: 68000, expenses: 33000 },
  { month: "Oct", revenue: 78000, expenses: 41000 },
  { month: "Nov", revenue: 85000, expenses: 39000 },
  { month: "Dec", revenue: 94000, expenses: 44000 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-lg border"
      style={{
        background: "var(--color-surface-raised)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="text-xs font-medium mb-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-mono font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: ${(entry.value / 1000).toFixed(0)}k
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "320ms" }}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Revenue Overview
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            12-month rolling performance
          </p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--color-teal)" }}
            />
            Expenses
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "Space Grotesk" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#amberGrad)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#tealGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
