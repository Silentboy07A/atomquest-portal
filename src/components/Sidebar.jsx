import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "260px",
          background: "var(--color-surface-raised)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent), var(--color-accent-muted))",
              }}
            >
              <Zap size={18} color="#0a0a0f" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight">Nexus</span>
              <span
                className="text-base font-light ml-0.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Command
              </span>
            </div>
          </div>
          <button
            className="lg:hidden p-1 rounded-md hover:bg-[var(--color-surface-hover)]"
            onClick={onToggle}
          >
            <X size={18} style={{ color: "var(--color-text-secondary)" }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      item.active
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                    }`}
                    style={
                      item.active
                        ? {
                            background: "var(--color-accent-glow)",
                            color: "var(--color-accent)",
                          }
                        : {}
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div
          className="px-4 py-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-teal), var(--color-teal-muted))",
                color: "#0a0a0f",
              }}
            >
              NK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Niko Krüger</p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--color-text-muted)" }}
              >
                admin@nexus.io
              </p>
            </div>
            <ChevronDown
              size={14}
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

export function TopBar({ onMenuToggle }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)]"
          onClick={onMenuToggle}
        >
          <Menu size={20} style={{ color: "var(--color-text-secondary)" }} />
        </button>

        <div
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: "var(--color-surface-card)",
            border: "1px solid var(--color-border)",
            width: "280px",
          }}
        >
          <Search
            size={16}
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "var(--color-text-primary)" }}
          />
          <kbd
            className="text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={{
              background: "var(--color-surface-active)",
              color: "var(--color-text-muted)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <Bell size={18} style={{ color: "var(--color-text-secondary)" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--color-negative)" }}
          />
        </button>
        <div
          className="hidden sm:block h-6 w-px mx-1"
          style={{ background: "var(--color-border)" }}
        />
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
