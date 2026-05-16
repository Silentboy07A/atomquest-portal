import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Card, EmptyState } from '../components/Shared/UIComponents';
import { Bell, Check, CheckCheck, AlertTriangle, Info, Award, Clock } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

const TYPE_CONFIG = {
  approval: { icon: Check, color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Approved' },
  rejection: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Rejected' },
  approval_request: { icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Pending' },
  reminder: { icon: Bell, color: '#185FA5', bg: 'rgba(24,95,165,0.1)', label: 'Reminder' },
  system: { icon: Info, color: '#8A96B0', bg: 'rgba(138,150,176,0.1)', label: 'System' },
  achievement: { icon: Award, color: '#0891b2', bg: 'rgba(8,145,178,0.1)', label: 'Achievement' },
};

export default function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllRead } = useStore();

  const myNotifs = useMemo(() => {
    return notifications.filter((n) => n.userId === currentUser.id || n.userId === 'all');
  }, [notifications, currentUser.id]);

  const unreadCount = myNotifs.filter((n) => !n.read).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h2>
          <p className="text-sm text-[var(--color-dark-300)]">{unreadCount} unread · {myNotifs.length} total</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </motion.div>

      {myNotifs.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications will appear here." />
      ) : (
        <motion.div variants={item} className="space-y-3">
          {myNotifs.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
            const NotifIcon = config.icon;
            return (
              <motion.div
                key={notif.id}
                layout
                className={`bg-[var(--color-dark-800)] rounded-xl p-5 flex items-start gap-4 cursor-pointer transition-colors border ${!notif.read ? 'border-l-[3px] border-y-white/[0.04] border-r-white/[0.04]' : 'border-white/[0.04]'} hover:bg-[var(--color-dark-750)]`}
                style={{ borderLeftColor: !notif.read ? config.color : 'rgba(255,255,255,0.04)' }}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: config.bg }}>
                  <NotifIcon size={18} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-semibold ${!notif.read ? 'text-white' : 'text-[var(--color-dark-200)]'}`}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-400)]" />
                    )}
                  </div>
                  <p className={`text-[13px] leading-relaxed ${!notif.read ? 'text-[var(--color-dark-100)]' : 'text-[var(--color-dark-300)]'}`}>
                    {notif.message}
                  </p>
                </div>
                <div className="text-[11px] text-[var(--color-dark-400)] shrink-0 font-medium">
                  {timeAgo(notif.timestamp)}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
