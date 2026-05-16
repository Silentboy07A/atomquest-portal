import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/**
 * Metric cards shown at the top of the dashboard.
 * Each has an oversized monospace counter — the "editorial data" anchor.
 */

const metrics = [
  {
    id: "revenue",
    label: "Revenue",
    value: "$128,430",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    accentClass: "text-[var(--color-accent)]",
    glowClass: "glow-amber",
    subtext: "vs last month",
  },
  {
    id: "users",
    label: "Active Users",
    value: "24,891",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    accentClass: "text-[var(--color-teal)]",
    glowClass: "glow-teal",
    subtext: "current session",
  },
  {
    id: "orders",
    label: "Orders",
    value: "1,429",
    change: "-2.4%",
    trend: "down",
    icon: ShoppingCart,
    accentClass: "text-[var(--color-accent)]",
    glowClass: "",
    subtext: "this week",
  },
  {
    id: "conversion",
    label: "Conversion",
    value: "3.24%",
    change: "+0.8%",
    trend: "up",
    icon: Activity,
    accentClass: "text-[var(--color-teal)]",
    glowClass: "",
    subtext: "funnel rate",
  },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        const TrendIcon = m.trend === "up" ? ArrowUpRight : ArrowDownRight;
        const trendColor =
          m.trend === "up"
            ? "text-[var(--color-positive)]"
            : "text-[var(--color-negative)]";

        return (
          <div
            key={m.id}
            className={`card p-6 animate-slide-up data-spine ${m.glowClass}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--color-text-secondary)] text-sm font-medium tracking-wide uppercase">
                {m.label}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.accentClass}`}
                style={{
                  background:
                    m.accentClass.includes("accent")
                      ? "var(--color-accent-glow)"
                      : "var(--color-teal-glow)",
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            {/* Oversized Metric Counter */}
            <div className="metric-value text-3xl xl:text-4xl mb-2">
              {m.value}
            </div>

            {/* Trend + Subtext */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`flex items-center gap-0.5 text-sm font-medium ${trendColor}`}>
                <TrendIcon size={14} />
                {m.change}
              </span>
              <span className="text-[var(--color-text-muted)] text-xs">
                {m.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
