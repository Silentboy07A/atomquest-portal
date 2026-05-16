import { Server, Database, Cpu, Wifi, HardDrive, Shield } from "lucide-react";

const systems = [
  {
    name: "API Gateway",
    status: "online",
    uptime: "99.98%",
    latency: "12ms",
    icon: Server,
  },
  {
    name: "Database Cluster",
    status: "online",
    uptime: "99.95%",
    latency: "4ms",
    icon: Database,
  },
  {
    name: "Compute Nodes",
    status: "warning",
    uptime: "98.72%",
    latency: "45ms",
    icon: Cpu,
  },
  {
    name: "CDN Edge",
    status: "online",
    uptime: "99.99%",
    latency: "8ms",
    icon: Wifi,
  },
  {
    name: "Object Storage",
    status: "online",
    uptime: "99.97%",
    latency: "22ms",
    icon: HardDrive,
  },
  {
    name: "Auth Service",
    status: "online",
    uptime: "100%",
    latency: "6ms",
    icon: Shield,
  },
];

export default function SystemStatus() {
  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "560ms" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            System Health
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Infrastructure monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot online animate-pulse-glow" />
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-positive)" }}
          >
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {systems.map((sys) => {
          const Icon = sys.icon;
          const isWarning = sys.status === "warning";

          return (
            <div
              key={sys.name}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ background: "var(--color-surface-raised)" }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: isWarning
                    ? "rgba(245, 158, 11, 0.1)"
                    : "var(--color-teal-glow)",
                  color: isWarning
                    ? "var(--color-accent)"
                    : "var(--color-teal)",
                }}
              >
                <Icon size={16} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {sys.name}
                  </span>
                  <span
                    className={`status-dot ${sys.status} ${sys.status === "online" ? "" : ""}`}
                  />
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {sys.uptime} uptime
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{
                      color: isWarning
                        ? "var(--color-accent)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {sys.latency}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
