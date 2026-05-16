import { Clock, ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const activities = [
  {
    type: "success",
    icon: CheckCircle2,
    color: "var(--color-positive)",
    message: "Deployment v2.14.0 completed successfully",
    time: "3 min ago",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    color: "var(--color-accent)",
    message: "High memory usage detected on node-03",
    time: "18 min ago",
  },
  {
    type: "info",
    icon: TrendingUp,
    color: "var(--color-teal)",
    message: "Revenue milestone: $100K MRR reached",
    time: "1 hr ago",
  },
  {
    type: "error",
    icon: XCircle,
    color: "var(--color-negative)",
    message: "Failed webhook delivery to stripe endpoint",
    time: "2 hr ago",
  },
  {
    type: "success",
    icon: CheckCircle2,
    color: "var(--color-positive)",
    message: "SSL certificate auto-renewed for *.nexus.io",
    time: "4 hr ago",
  },
  {
    type: "info",
    icon: ArrowUpRight,
    color: "var(--color-teal)",
    message: "New customer signup: Forge Industries",
    time: "5 hr ago",
  },
];

export default function ActivityFeed() {
  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "640ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Activity Feed</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            Real-time system events
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <Clock size={12} />
          Live
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-3">
        {activities.map((act, i) => {
          const Icon = act.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: `color-mix(in srgb, ${act.color} 15%, transparent)`,
                  color: act.color,
                }}
              >
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">{act.message}</p>
                <span className="text-xs mt-1 block" style={{ color: "var(--color-text-muted)" }}>
                  {act.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
