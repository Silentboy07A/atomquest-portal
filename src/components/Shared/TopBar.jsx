import React from 'react';
import { useStore } from '../../store/useStore';
import { Avatar } from './UIComponents';
import { Bell, Search } from 'lucide-react';

export default function TopBar({ title, subtitle }) {
  const { currentUser, notifications } = useStore();
  const unread = notifications.filter((n) => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length;

  return (
    <header
      className="h-[60px] flex items-center justify-between px-6 sticky top-0 z-20"
      style={{
        background: '#050508',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-[12px]">
        <h1 className="text-[18px] font-bold text-[#f1f5f9]">
          {title}
        </h1>
        <span className="text-[10px] font-medium text-[var(--color-accent-600)] border border-[var(--color-accent-600)] px-[8px] py-[2px] rounded-[4px] uppercase tracking-wider">
          {currentUser.role}
        </span>
      </div>

      <div className="flex-1 flex justify-center hide-mobile">
        <div className="relative w-full max-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#0d1117] border border-[rgba(255,255,255,0.06)] rounded-[8px] pl-10 pr-4 py-2 text-[13px] text-[#f1f5f9] placeholder-[#64748b] outline-none transition-colors focus:border-[var(--color-accent-600)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-[16px]">
        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:text-[#f1f5f9] transition-colors">
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-600)' }} />
          )}
        </button>

        {/* User */}
        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white font-semibold text-[13px]" style={{ background: 'linear-gradient(135deg, #0d9488, #4f46e5)' }}>
          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
