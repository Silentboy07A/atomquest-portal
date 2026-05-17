import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Card, EmptyState } from '../components/Shared/UIComponents';
import { Bell, Check, CheckCheck, AlertTriangle, Info, Award, Clock } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

const TYPE_CONFIG = {
  approval: { icon: Check, color: 'var(--color-success-500)', bg: 'color-mix(in srgb, var(--color-success-500) 15%, transparent)', label: 'Approved' },
  rejection: { icon: AlertTriangle, color: 'var(--color-danger-500)', bg: 'color-mix(in srgb, var(--color-danger-500) 15%, transparent)', label: 'Rejected' },
  approval_request: { icon: Clock, color: 'var(--color-warning-500)', bg: 'color-mix(in srgb, var(--color-warning-500) 15%, transparent)', label: 'Pending' },
  reminder: { icon: Bell, color: 'var(--color-accent-400)', bg: 'color-mix(in srgb, var(--color-accent-500) 15%, transparent)', label: 'Reminder' },
  system: { icon: Info, color: 'var(--color-dark-400)', bg: 'color-mix(in srgb, var(--color-dark-400) 15%, transparent)', label: 'System' },
  achievement: { icon: Award, color: 'var(--color-success-400)', bg: 'color-mix(in srgb, var(--color-success-500) 15%, transparent)', label: 'Achievement' },
};

export default function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllRead } = useStore();

  const myNotifs = useMemo(() => {
    return notifications.filter((n) => n.userId === currentUser.id || n.userId === 'all');
  }, [notifications, currentUser.id]);

  const unreadCount = myNotifs.filter((n) => !n.read).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-4xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-dark-700)] pb-5">
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-dark-50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h2>
          <p className="text-[12px] text-[var(--color-dark-300)]">{unreadCount} unread · {myNotifs.length} total</p>
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
                className={`surface-raised p-4 flex items-start gap-4 cursor-pointer transition-colors border-l-[3px] hover:bg-[var(--color-dark-900)]`}
                style={{ borderLeftColor: !notif.read ? config.color : 'transparent' }}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: config.bg }}>
                  <NotifIcon size={16} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[13px] font-semibold ${!notif.read ? 'text-[var(--color-dark-50)]' : 'text-[var(--color-dark-200)]'}`}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-400)]" />
                    )}
                  </div>
                  <p className={`text-[12px] leading-relaxed ${!notif.read ? 'text-[var(--color-dark-100)]' : 'text-[var(--color-dark-300)]'}`}>
                    {notif.message}
                  </p>
                </div>
                <div className="text-[10px] text-[var(--color-dark-400)] shrink-0 font-medium">
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
