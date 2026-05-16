import React from 'react';
import { useStore } from '../../store/useStore';
import { Avatar } from './UIComponents';
import { Bell, Search } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  const { currentUser, notifications } = useStore();
  const unread = notifications.filter((n) => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-20"
      style={{
        background: 'rgba(11, 16, 32, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div>
        <h1 className="text-lg font-bold text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          {title}
          {subtitle && (
            <span className="text-[10px] font-semibold text-[var(--color-dark-200)] bg-[var(--color-dark-700)] px-2.5 py-1 rounded-md uppercase tracking-wider">
              {subtitle}
            </span>
          )}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hide-mobile">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input
            type="text"
            placeholder="Search goals..."
            className="input pl-9 !w-64 !bg-[var(--color-dark-800)] !rounded-lg text-sm !border-white/[0.04]"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.04]">
          <Bell size={17} className="text-[var(--color-dark-300)]" />
          {unread > 0 && (
            <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent-500)] rounded-full" />
          )}
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/[0.06] mx-1" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hide-mobile text-right">
            <div className="text-sm font-medium text-white" style={{ fontFamily: 'var(--font-sans)' }}>
              {currentUser.name}
            </div>
          </div>
          <Avatar name={currentUser.name} size="sm" />
        </div>
      </div>
    </header>
  );
}
