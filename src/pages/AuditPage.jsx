import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Card, EmptyState } from '../components/Shared/UIComponents';
import { History, Search, ArrowUpRight, Edit3, Plus, Trash2, Check, X, RefreshCw } from 'lucide-react';
import { formatDateTime, timeAgo } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

const ACTION_ICONS = {
  goal_created: { icon: Plus, color: 'var(--color-accent-400)', bg: 'color-mix(in srgb, var(--color-accent-500) 15%, transparent)' },
  goal_submitted: { icon: ArrowUpRight, color: 'var(--color-warning-500)', bg: 'color-mix(in srgb, var(--color-warning-500) 15%, transparent)' },
  goal_approved: { icon: Check, color: 'var(--color-success-500)', bg: 'color-mix(in srgb, var(--color-success-500) 15%, transparent)' },
  goal_rejected: { icon: X, color: 'var(--color-danger-500)', bg: 'color-mix(in srgb, var(--color-danger-500) 15%, transparent)' },
  goal_updated: { icon: Edit3, color: 'var(--color-accent-500)', bg: 'color-mix(in srgb, var(--color-accent-500) 15%, transparent)' },
  goal_deleted: { icon: Trash2, color: 'var(--color-danger-500)', bg: 'color-mix(in srgb, var(--color-danger-500) 15%, transparent)' },
  progress_updated: { icon: RefreshCw, color: 'var(--color-accent-400)', bg: 'color-mix(in srgb, var(--color-accent-500) 15%, transparent)' },
  cycle_created: { icon: Plus, color: 'var(--color-success-400)', bg: 'color-mix(in srgb, var(--color-success-500) 15%, transparent)' },
};

export default function AuditPage() {
  const { auditLogs, users } = useStore();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const actions = useMemo(() => {
    return [...new Set(auditLogs.map((l) => l.action))];
  }, [auditLogs]);

  const filtered = useMemo(() => {
    let list = auditLogs;
    if (filterAction !== 'all') list = list.filter((l) => l.action === filterAction);
    if (search) list = list.filter((l) => l.details.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [auditLogs, filterAction, search]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-7xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#f1f5f9]" style={{ fontFamily: 'var(--font-display)' }}>Audit Trail</h2>
          <p className="text-[13px] text-[#64748b] mt-1">{auditLogs.length} total entries</p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: auditLogs.length, color: '#0d9488' },
          { label: 'Goals Created', value: auditLogs.filter((l) => l.action === 'goal_created').length, color: '#4f46e5' },
          { label: 'Approvals', value: auditLogs.filter((l) => l.action === 'goal_approved').length, color: '#10b981' },
          { label: 'Rejections', value: auditLogs.filter((l) => l.action === 'goal_rejected').length, color: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} className="surface-raised flex flex-col justify-center" style={{ padding: '16px 20px', minHeight: '80px' }}>
            <div className="text-[26px] font-bold leading-none" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>{stat.value}</div>
            <div className="text-[11px] uppercase tracking-wider text-[#64748b] font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={item} className="surface-raised p-2 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 md:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-transparent border-none text-[13px] text-[var(--color-dark-50)] pl-9 pr-3 py-1.5 outline-none placeholder:text-[var(--color-dark-400)]" 
          />
        </div>
        
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto md:border-l md:border-[var(--color-dark-700)] md:pl-4 pb-1 md:pb-0">
          <button 
            onClick={() => setFilterAction('all')} 
            className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterAction === 'all' ? 'bg-[var(--color-dark-700)] text-[var(--color-dark-50)]' : 'text-[var(--color-dark-300)] hover:text-[var(--color-dark-100)] hover:bg-[var(--color-dark-800)]'
            }`}
          >
            All
          </button>
          {actions.map((a) => (
            <button 
              key={a} 
              onClick={() => setFilterAction(a)} 
              className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterAction === a ? 'bg-[var(--color-dark-700)] text-[var(--color-dark-50)]' : 'text-[var(--color-dark-300)] hover:text-[var(--color-dark-100)] hover:bg-[var(--color-dark-800)]'
              }`}
            >
              {a.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Audit Log Entries */}
      {filtered.length === 0 ? (
        <EmptyState icon={History} title="No audit entries" description="No entries match your current filters." />
      ) : (
        <div className="flex flex-col gap-1">
          {filtered.map((log) => {
            const user = users.find((u) => u.id === log.userId);
            const actionConfig = ACTION_ICONS[log.action] || ACTION_ICONS.goal_updated;
            const ActionIcon = actionConfig.icon;

            return (
              <div 
                key={log.id}
                className="list-card flex items-center gap-3"
                style={{ padding: '11px 16px' }}
              >
                {/* Icon */}
                <div className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0" style={{ background: actionConfig.bg }}>
                  <ActionIcon size={12} style={{ color: actionConfig.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#f1f5f9]">{user?.name || 'System'}</span>
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: actionConfig.bg, color: actionConfig.color }}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    {log.changes?.field && (
                      <span className="text-[10px] text-[#64748b] hide-mobile">
                        {log.changes.field}: 
                        {log.changes.from !== null && <span className="text-[#ef4444] line-through ml-1">{String(log.changes.from)}</span>}
                        <span className="mx-1 text-[#334155]">→</span>
                        <span className="text-[#10b981] font-medium">{String(log.changes.to)}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748b] truncate">{log.details}</p>
                </div>

                {/* Timestamp */}
                <div className="text-[10px] text-[#475569] shrink-0 font-medium" title={formatDateTime(log.timestamp)}>
                  {timeAgo(log.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
