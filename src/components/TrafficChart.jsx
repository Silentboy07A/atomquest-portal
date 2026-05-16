import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const trafficData = [
  { source: "Organic", visitors: 14200, color: "#f59e0b" },
  { source: "Direct", visitors: 8900, color: "#14b8a6" },
  { source: "Referral", visitors: 6400, color: "#a78bfa" },
  { source: "Social", visitors: 5100, color: "#f472b6" },
  { source: "Email", visitors: 3800, color: "#60a5fa" },
  { source: "Paid", visitors: 2900, color: "#34d399" },
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
      <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
      <p className="font-mono text-sm font-semibold" style={{ color: payload[0].payload.color }}>
        {payload[0].value.toLocaleString()} visitors
      </p>
    </div>
  );
}

export default function TrafficChart() {
  return (
    <div className="card p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Traffic Sources</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
          Visitor distribution by channel
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trafficData} barSize={28} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="source"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#f1f5f9", fontSize: 12, fontFamily: "Space Grotesk" }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="visitors" radius={[0, 6, 6, 0]}>
              {trafficData.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
