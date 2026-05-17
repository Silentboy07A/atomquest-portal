import React from 'react';
import { useStore } from '../../store/useStore';
import { Avatar } from './UIComponents';
import { Bell, Search } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  const { currentUser, notifications } = useStore();
  const unread = notifications.filter((n) => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length;

  return (
    <header
      className="h-14 flex items-center justify-between px-6 sticky top-0 z-20"
      style={{
        background: 'var(--color-dark-950)',
        borderBottom: '1px solid var(--color-dark-700)',
      }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-semibold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h1>
        {subtitle && (
          <span className="text-[10px] font-medium text-[var(--color-dark-300)] bg-[var(--color-dark-800)] px-2 py-0.5 rounded-md uppercase tracking-wider border border-[var(--color-dark-600)]">
            {subtitle}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hide-mobile">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input
            type="text"
            placeholder="Search..."
            className="input pl-8 !w-52 !bg-[var(--color-dark-800)] !rounded-lg text-[13px] !border-[var(--color-dark-700)] !py-1.5 focus:!border-[var(--color-accent-500)]"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--color-dark-700)] transition-colors">
          <Bell size={16} className="text-[var(--color-dark-300)]" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-accent-600)] rounded-full" />
          )}
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-[var(--color-dark-700)] mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="hide-mobile text-right">
            <div className="text-[13px] font-medium text-[var(--color-dark-50)]">{currentUser.name}</div>
          </div>
          <Avatar name={currentUser.name} size="sm" />
        </div>
      </div>
    </header>
  );
}
