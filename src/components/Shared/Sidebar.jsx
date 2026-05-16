import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Avatar } from './UIComponents';
import {
  LayoutDashboard, Target, CheckSquare, BarChart3, Shield, Bell,
  Users, ChevronDown, PanelLeftClose, PanelLeft, Share2, History
} from 'lucide-react';

const navItems = {
  employee: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'My Goals' },
    { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ],
  manager: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'My Goals' },
    { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
    { to: '/team', icon: Users, label: 'Team View' },
    { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ],
  admin: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'All Goals' },
    { to: '/team', icon: Users, label: 'All Employees' },
    { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/audit', icon: History, label: 'Audit Trail' },
    { to: '/admin', icon: Shield, label: 'Admin Panel' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ],
};

export default function Sidebar() {
  const { currentUser, setCurrentUser, users, sidebarOpen, toggleSidebar, notifications } = useStore();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const items = navItems[currentUser.role] || navItems.employee;
  const unread = notifications.filter((n) => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length;

  const handleSwitch = (userId) => {
    setCurrentUser(userId);
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.aside
      className="h-screen sticky top-0 flex flex-col z-30"
      style={{
        background: 'var(--color-dark-900)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white font-bold text-xs shrink-0"
             style={{ fontFamily: 'var(--font-display)' }}>
          AQ
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
              <div className="font-bold text-white text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                AtomQuest
              </div>
              <div className="text-[10px] text-[var(--color-dark-300)] font-medium tracking-wider uppercase">
                Performance
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={toggleSidebar} className="ml-auto btn btn-ghost btn-icon text-[var(--color-dark-400)] hover:text-white">
          {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
        </button>
      </div>

      {/* Section label */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 pt-6 pb-2"
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--color-dark-500)]">
              Navigation
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={17} className="shrink-0 opacity-70" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {item.label === 'Notifications' && unread > 0 && sidebarOpen && (
              <span className="ml-auto bg-[var(--color-accent-500)] text-white text-[10px] font-semibold w-5 h-5 rounded-md flex items-center justify-center">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Switcher */}
      <div className="p-3 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-full flex items-center gap-3 sidebar-link !mb-0">
          <Avatar name={currentUser.name} size="sm" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 text-left overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-[var(--color-dark-400)] capitalize">{currentUser.role}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {sidebarOpen && <ChevronDown size={14} className={`text-[var(--color-dark-400)] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />}
        </button>

        <AnimatePresence>
          {userMenuOpen && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute bottom-full left-3 right-3 mb-2 rounded-xl overflow-hidden shadow-xl"
              style={{
                background: 'var(--color-dark-700)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="p-2.5 text-[9px] uppercase tracking-[0.15em] text-[var(--color-dark-400)] font-semibold px-3.5">
                Switch Role
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSwitch(u.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-white/[0.03] transition-colors ${u.id === currentUser.id ? 'bg-[var(--color-accent-500)]/[0.06]' : ''}`}
                >
                  <Avatar name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate font-medium">{u.name}</div>
                    <div className="text-[10px] text-[var(--color-dark-400)] capitalize">{u.role} · {u.department}</div>
                  </div>
                  {u.id === currentUser.id && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-400)]" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
