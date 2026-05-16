import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Card, EmptyState } from '../components/Shared/UIComponents';
import { History, Search, Filter, ArrowUpRight, Edit3, Plus, Trash2, Check, X, RefreshCw } from 'lucide-react';
import { formatDateTime, timeAgo } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

const ACTION_ICONS = {
  goal_created: { icon: Plus, color: '#185FA5', bg: 'rgba(24, 95, 165, 0.1)' },
  goal_submitted: { icon: ArrowUpRight, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  goal_approved: { icon: Check, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  goal_rejected: { icon: X, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  goal_updated: { icon: Edit3, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  goal_deleted: { icon: Trash2, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  progress_updated: { icon: RefreshCw, color: '#2B7FD4', bg: 'rgba(43, 127, 212, 0.1)' },
  cycle_created: { icon: Plus, color: '#0891b2', bg: 'rgba(8, 145, 178, 0.1)' },
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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Audit Trail</h2>
          <p className="text-sm text-[var(--color-dark-300)]">{auditLogs.length} total entries</p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Events', value: auditLogs.length, color: '#185FA5' },
          { label: 'Goals Created', value: auditLogs.filter((l) => l.action === 'goal_created').length, color: '#2B7FD4' },
          { label: 'Approvals', value: auditLogs.filter((l) => l.action === 'goal_approved').length, color: '#10b981' },
          { label: 'Rejections', value: auditLogs.filter((l) => l.action === 'goal_rejected').length, color: '#ef4444' },
        ].map((stat) => (
          <Card key={stat.label} hover={false} className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold mb-1.5" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>{stat.value}</div>
            <div className="text-[11px] text-[var(--color-dark-300)] font-medium">{stat.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div variants={item} className="bg-[var(--color-dark-800)] border border-white/[0.04] p-2 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 md:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-transparent border-none text-sm text-white pl-9 pr-3 py-2 outline-none placeholder:text-[var(--color-dark-400)]" 
          />
        </div>
        
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto md:border-l md:border-white/[0.04] md:pl-4 pb-1 md:pb-0">
          <button 
            onClick={() => setFilterAction('all')} 
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterAction === 'all' ? 'bg-[var(--color-dark-600)] text-white' : 'text-[var(--color-dark-300)] hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            All
          </button>
          {actions.map((a) => (
            <button 
              key={a} 
              onClick={() => setFilterAction(a)} 
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterAction === a ? 'bg-[var(--color-dark-600)] text-white' : 'text-[var(--color-dark-300)] hover:text-white hover:bg-white/[0.03]'
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
        <motion.div variants={item} className="space-y-3">
          {filtered.map((log) => {
            const user = users.find((u) => u.id === log.userId);
            const actionConfig = ACTION_ICONS[log.action] || ACTION_ICONS.goal_updated;
            const ActionIcon = actionConfig.icon;

            return (
              <motion.div 
                key={log.id} 
                layout 
                className="bg-[var(--color-dark-800)] border border-white/[0.04] p-5 rounded-xl flex flex-col sm:flex-row sm:items-start gap-4 hover:border-white/[0.08] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: actionConfig.bg }}>
                  <ActionIcon size={18} style={{ color: actionConfig.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-white">{user?.name || 'System'}</span>
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{ background: actionConfig.bg, color: actionConfig.color }}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--color-dark-200)] leading-relaxed">{log.details}</p>
                  
                  {log.changes?.field && (
                    <div className="flex items-center gap-2 mt-2 text-[11px] bg-[var(--color-dark-900)] self-start inline-flex px-3 py-1.5 rounded-lg border border-white/[0.04]">
                      <span className="text-[var(--color-dark-400)] font-medium">{log.changes.field}:</span>
                      {log.changes.from !== null && <span className="text-red-400 line-through opacity-80">{String(log.changes.from)}</span>}
                      <span className="text-[var(--color-dark-500)]">→</span>
                      <span className="text-emerald-400 font-medium">{String(log.changes.to)}</span>
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-[var(--color-dark-400)] shrink-0 font-medium pt-1" title={formatDateTime(log.timestamp)}>
                  {timeAgo(log.timestamp)}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
