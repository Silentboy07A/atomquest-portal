import { ArrowUpRight } from "lucide-react";

const transactions = [
  {
    id: "TXN-8842",
    customer: "Elena Vasquez",
    email: "elena@meridian.co",
    amount: "$2,450.00",
    status: "completed",
    date: "2 min ago",
    avatar: "EV",
  },
  {
    id: "TXN-8841",
    customer: "Marcus Chen",
    email: "m.chen@nexus.io",
    amount: "$1,280.00",
    status: "processing",
    date: "14 min ago",
    avatar: "MC",
  },
  {
    id: "TXN-8840",
    customer: "Aria Johansson",
    email: "aria@bloc.dev",
    amount: "$890.00",
    status: "completed",
    date: "32 min ago",
    avatar: "AJ",
  },
  {
    id: "TXN-8839",
    customer: "Dante Morales",
    email: "dante@craft.ai",
    amount: "$3,100.00",
    status: "completed",
    date: "1 hr ago",
    avatar: "DM",
  },
  {
    id: "TXN-8838",
    customer: "Suki Patel",
    email: "suki.p@forge.co",
    amount: "$640.00",
    status: "failed",
    date: "2 hr ago",
    avatar: "SP",
  },
  {
    id: "TXN-8837",
    customer: "Liam O'Brien",
    email: "liam@steelwork.io",
    amount: "$1,780.00",
    status: "completed",
    date: "3 hr ago",
    avatar: "LO",
  },
];

const statusStyles = {
  completed: {
    bg: "rgba(34, 197, 94, 0.1)",
    text: "var(--color-positive)",
    label: "Completed",
  },
  processing: {
    bg: "rgba(245, 158, 11, 0.1)",
    text: "var(--color-accent)",
    label: "Processing",
  },
  failed: {
    bg: "rgba(239, 68, 68, 0.1)",
    text: "var(--color-negative)",
    label: "Failed",
  },
};

export default function RecentTransactions() {
  return (
    <div
      className="card p-6 animate-slide-up"
      style={{ animationDelay: "480ms" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Transactions
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Latest activity across all channels
          </p>
        </div>
        <button
          className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--color-accent)",
            background: "var(--color-accent-glow)",
          }}
        >
          View All <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-1">
        {transactions.map((tx, i) => {
          const s = statusStyles[tx.status];
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 px-3 rounded-lg transition-colors hover:bg-[var(--color-surface-hover)] group"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "var(--color-surface-active)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {tx.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {tx.customer}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {tx.email}
                  </p>
                </div>
              </div>

              {/* Right: Amount + Status + Date */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono text-sm font-semibold hidden sm:block">
                  {tx.amount}
                </span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: s.bg, color: s.text }}
                >
                  {s.label}
                </span>
                <span
                  className="text-xs w-16 text-right hidden lg:block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {tx.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
