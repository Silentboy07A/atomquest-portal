import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Avatar } from './UIComponents';
import {
  LayoutDashboard, Target, CheckSquare, BarChart3, Shield, Bell,
  Users, ChevronDown, PanelLeftClose, PanelLeft, Share2, History,
  ChevronUp
} from 'lucide-react';

const navSections = {
  employee: [
    { section: 'Overview', items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ]},
    { section: 'Performance', items: [
      { to: '/goals', icon: Target, label: 'My Goals' },
      { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    ]},
    { section: 'Activity', items: [
      { to: '/notifications', icon: Bell, label: 'Notifications' },
    ]},
  ],
  manager: [
    { section: 'Overview', items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ]},
    { section: 'Management', items: [
      { to: '/goals', icon: Target, label: 'My Goals' },
      { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
      { to: '/team', icon: Users, label: 'Team View' },
      { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
    ]},
    { section: 'Insights', items: [
      { to: '/analytics', icon: BarChart3, label: 'Command Center' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
    ]},
  ],
  admin: [
    { section: 'Overview', items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ]},
    { section: 'Organization', items: [
      { to: '/goals', icon: Target, label: 'All Goals' },
      { to: '/team', icon: Users, label: 'All Employees' },
      { to: '/shared-goals', icon: Share2, label: 'Shared Goals' },
    ]},
    { section: 'Intelligence', items: [
      { to: '/analytics', icon: BarChart3, label: 'Command Center' },
      { to: '/audit', icon: History, label: 'Audit Trail' },
      { to: '/admin', icon: Shield, label: 'Admin Panel' },
    ]},
    { section: 'Activity', items: [
      { to: '/notifications', icon: Bell, label: 'Notifications' },
    ]},
  ],
};

export default function Sidebar() {
  const { currentUser, setCurrentUser, users, sidebarOpen, toggleSidebar, notifications } = useStore();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const sections = navSections[currentUser.role] || navSections.employee;
  const unread = notifications.filter((n) => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length;

  const handleSwitch = (userId) => {
    setCurrentUser(userId);
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <aside
      className="h-screen sticky top-0 flex flex-col z-30 transition-all duration-200"
      style={{
        width: sidebarOpen ? 220 : 64,
        background: '#0a0d14',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 shrink-0"
        style={{
          padding: sidebarOpen ? '24px 20px' : '24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
          style={{
            background: 'var(--color-accent-600)',
            fontFamily: 'var(--font-display)',
            fontSize: 12,
          }}
        >
          AQ
        </div>
        {sidebarOpen && (
          <span
            className="font-bold text-[15px] tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-dark-50)' }}
          >
            AtomQuest
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto w-6 h-6 rounded flex items-center justify-center transition-colors"
          style={{ color: 'var(--color-dark-400)' }}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map((group) => (
          <div key={group.section}>
            {sidebarOpen && (
              <div style={{ padding: '20px 20px 8px' }}>
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.1em]"
                  style={{ color: '#334155' }}
                >
                  {group.section}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={15} className="shrink-0 opacity-50 sidebar-icon" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {item.label === 'Notifications' && unread > 0 && sidebarOpen && (
                    <span
                      className="ml-auto text-[10px] font-semibold rounded-full flex items-center justify-center"
                      style={{
                        background: 'var(--color-accent-600)',
                        color: '#fff',
                        minWidth: 18,
                        height: 18,
                        padding: '0 5px',
                      }}
                    >
                      {unread}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Switcher */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }} className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 text-left"
        >
          <Avatar name={currentUser.name} size="sm" />
          {sidebarOpen && (
            <div className="flex-1 overflow-hidden">
              <div className="text-[13px] font-medium truncate text-[var(--color-dark-50)]">
                {currentUser.name}
              </div>
              <div className="text-[11px] capitalize text-[#334155]">
                {currentUser.role}
              </div>
            </div>
          )}
          {sidebarOpen && (
            <ChevronUp
              size={12}
              className="transition-transform duration-150"
              style={{
                color: 'var(--color-dark-400)',
                transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          )}
        </button>

        <AnimatePresence>
          {userMenuOpen && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-2 right-2 mb-1 rounded-lg overflow-hidden"
              style={{
                background: 'var(--color-dark-800)',
                border: '1px solid var(--color-dark-600)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div
                className="px-3 py-2 text-[10px] uppercase tracking-[0.08em] font-medium"
                style={{ color: 'var(--color-dark-400)', borderBottom: '1px solid var(--color-dark-700)' }}
              >
                Switch Role
              </div>
              <div className="py-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSwitch(u.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
                    style={{
                      background: u.id === currentUser.id ? 'var(--color-dark-750)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (u.id !== currentUser.id) e.currentTarget.style.background = 'var(--color-dark-750)'; }}
                    onMouseLeave={(e) => { if (u.id !== currentUser.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Avatar name={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium truncate" style={{ color: 'var(--color-dark-100)' }}>
                        {u.name}
                      </div>
                      <div className="text-[10px] capitalize" style={{ color: 'var(--color-dark-400)' }}>
                        {u.role} · {u.department}
                      </div>
                    </div>
                    {u.id === currentUser.id && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--color-accent-500)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
