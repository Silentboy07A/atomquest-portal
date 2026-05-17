import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { StatusBadge, PriorityBadge, Modal, Avatar, EmptyState } from '../components/Shared/UIComponents';
import { CheckSquare, Check, X, Eye, Clock, MessageSquare } from 'lucide-react';
import { formatDate, formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

export default function ApprovalsPage() {
  const { currentUser, goals, users, cycles, approveGoal, rejectGoal, updateGoal, auditLogs } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const [viewGoal, setViewGoal] = useState(null);
  const [filter, setFilter] = useState('pending');
  
  const [edits, setEdits] = useState({});
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const teamGoals = useMemo(() => {
    return goals.filter((g) => {
      const emp = users.find((u) => u.id === g.userId);
      return emp?.managerId === currentUser.id && g.cycleId === activeCycle?.id;
    });
  }, [goals, users, currentUser.id, activeCycle?.id]);

  const filtered = filter === 'all' ? teamGoals : teamGoals.filter((g) => g.status === filter);
  const pendingCount = teamGoals.filter((g) => g.status === 'pending').length;

  const handleEdit = (id, field, value) => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleApprove = (goal) => {
    if (edits[goal.id]) {
      updateGoal(goal.id, edits[goal.id]);
    }
    approveGoal(goal.id, '');
    toast.success('Goal approved successfully', { style: { background: '#0d1117', color: '#fff', border: '1px solid #10b981' } });
  };

  const handleReject = (goal) => {
    if (rejectReason.trim()) {
      rejectGoal(goal.id, rejectReason);
      setRejectingId(null);
      setRejectReason('');
    }
  };

  const getApprovalDetails = (goalId) => {
    const log = auditLogs.find(l => l.entityId === goalId && l.action === 'goal_approved');
    return log ? { approver: users.find(u => u.id === log.userId)?.name || 'Manager', time: log.timestamp } : null;
  };

  const getRejectionDetails = (goalId) => {
    const log = auditLogs.find(l => l.entityId === goalId && l.action === 'goal_rejected');
    return log ? { reason: log.details.replace('Rejected by ', ''), time: log.timestamp } : null;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#f1f5f9]" style={{ fontFamily: 'var(--font-display)' }}>Approvals</h2>
          <p className="text-[13px] text-[#64748b] mt-1">
            {pendingCount} pending · {teamGoals.length} total team goals
          </p>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {['pending', 'approved', 'rejected', 'all'].map((s) => (
              <button 
                key={s} 
                onClick={() => setFilter(s)} 
                className={`px-4 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap ${
                  filter === s 
                    ? 'bg-[var(--color-accent-600)] text-white rounded-md' 
                    : 'text-[#64748b] bg-transparent hover:text-[var(--color-dark-100)]'
                }`}
              >
                {s === 'pending' ? `Pending (${pendingCount})` : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Approval Queue */}
      {filtered.length === 0 ? (
        <EmptyState icon={CheckSquare} title="All caught up ✓" description="All team goals have been reviewed." />
      ) : (
        <motion.div variants={item} className="space-y-3">
          {filtered.map((goal) => {
            const owner = users.find((u) => u.id === goal.userId);
            return (
              <motion.div 
                key={goal.id} 
                layout 
                className="list-card flex flex-col justify-center min-h-[64px]"
                style={{ padding: '16px 20px', marginBottom: '16px' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  {/* Left Side: Employee & Goal Info */}
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={owner?.name} size="sm" />
                      <span className="text-[14px] font-semibold text-[#f1f5f9] truncate">
                        {goal.title}
                      </span>
                      <span className="badge badge-subtle">{goal.category}</span>
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-2 text-[11px] text-[#64748b] flex-wrap mt-0.5">
                      <span className="font-medium text-[#f1f5f9]">{owner?.name}</span>
                      <span className="flex items-center gap-1.5">UoM: {goal.uom || 'Numeric'}</span>
                      {goal.status === 'pending' ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            Target: <input type="text" className="bg-[#0a0d14] border border-[rgba(255,255,255,0.1)] rounded text-[#f1f5f9] py-0.5 px-2 text-[11px] w-20 h-6 outline-none" value={edits[goal.id]?.targetValue ?? goal.targetValue} onChange={(e) => handleEdit(goal.id, 'targetValue', e.target.value)} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            Weight: <input type="number" className="bg-[#0a0d14] border border-[rgba(255,255,255,0.1)] rounded text-[#f1f5f9] py-0.5 px-2 text-[11px] w-16 h-6 outline-none" value={edits[goal.id]?.weightage ?? goal.weightage} onChange={(e) => handleEdit(goal.id, 'weightage', Number(e.target.value))} />%
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1.5">Target: <strong className="text-[#cbd5e1]">{goal.targetValue || 100}</strong></span>
                          <span className="flex items-center gap-1.5">Weight: <strong className="text-[#cbd5e1]">{goal.weightage}%</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex items-center gap-2 shrink-0 mt-4 lg:mt-0">
                    <button onClick={() => setViewGoal(goal)} className="btn btn-secondary btn-sm btn-icon" title="View details"><Eye size={14} /></button>
                    {goal.status === 'pending' && (
                      <>
                        <button onClick={() => { setRejectingId(goal.id); setRejectReason(''); }} className="btn border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white btn-sm px-3">
                          <X size={13} /> <span className="hide-mobile">Reject</span>
                        </button>
                        <button onClick={() => handleApprove(goal)} className="btn bg-[var(--color-accent-600)] text-white hover:bg-[var(--color-accent-500)] btn-sm px-3">
                          <Check size={13} /> <span className="hide-mobile">Approve</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Reject Slide-in */}
                {rejectingId === goal.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex gap-3 items-start">
                    <div className="flex-1">
                      <input type="text" className="w-full bg-[#0a0d14] border border-[#ef4444]/50 rounded-[6px] text-[13px] text-[#f1f5f9] px-3 py-2 outline-none placeholder-[#64748b]" placeholder="Reason for rejection (required)..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} autoFocus />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setRejectingId(null)} className="btn bg-transparent border border-[rgba(255,255,255,0.1)] text-[#f1f5f9] hover:bg-[rgba(255,255,255,0.05)] text-[13px] px-3 py-2 rounded-[6px]">Cancel</button>
                      <button onClick={() => handleReject(goal)} className="btn bg-[#ef4444] text-white hover:bg-[#dc2626] text-[13px] px-3 py-2 rounded-[6px]" disabled={!rejectReason.trim()}>Confirm</button>
                    </div>
                  </motion.div>
                )}

                {/* Status Details for Approved/Rejected */}
                {goal.status === 'approved' && getApprovalDetails(goal.id) && (
                  <div className="mt-2 pt-3 border-t border-[var(--color-dark-700)] flex items-center gap-2 text-[11px] text-[var(--color-dark-300)]">
                    <Check size={12} className="text-[var(--color-success-400)]" />
                    <span>Approved by <strong>{getApprovalDetails(goal.id).approver}</strong> on {formatDateTime(getApprovalDetails(goal.id).time)}</span>
                  </div>
                )}
                {goal.status === 'rejected' && getRejectionDetails(goal.id) && (
                  <div className="mt-2 pt-3 border-t border-[var(--color-dark-700)] flex items-center gap-2 text-[11px] text-[var(--color-danger-400)]">
                    <X size={12} />
                    <span><strong>Reason:</strong> {getRejectionDetails(goal.id).reason} ({formatDateTime(getRejectionDetails(goal.id).time)})</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* View Modal */}
      <Modal isOpen={!!viewGoal} onClose={() => setViewGoal(null)} title="Goal Details" size="lg">
        {viewGoal && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--color-dark-50)] mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{viewGoal.title}</h3>
              <p className="text-[13px] text-[var(--color-dark-200)] leading-relaxed">{viewGoal.description}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] rounded-xl p-3.5">
                <span className="block text-[9px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1">Category</span>
                <div className="text-[12px] font-medium text-[var(--color-dark-50)]">{viewGoal.category}</div>
              </div>
              <div className="bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] rounded-xl p-3.5">
                <span className="block text-[9px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1">Weightage</span>
                <div className="text-[15px] text-[var(--color-dark-50)] font-bold tracking-tight">{viewGoal.weightage}%</div>
              </div>
              <div className="bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] rounded-xl p-3.5">
                <span className="block text-[9px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1">Priority</span>
                <PriorityBadge priority={viewGoal.priority} />
              </div>
              <div className="bg-[var(--color-dark-900)] border border-[var(--color-dark-700)] rounded-xl p-3.5">
                <span className="block text-[9px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1">Due Date</span>
                <div className="text-[12px] font-medium text-[var(--color-dark-50)]">{formatDate(viewGoal.dueDate)}</div>
              </div>
            </div>
            
            {viewGoal.milestones?.length > 0 && (
              <div>
                <h4 className="text-[12px] font-semibold text-[var(--color-dark-50)] mb-2.5">Milestones</h4>
                <div className="flex flex-col gap-1.5">
                  {viewGoal.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-[var(--color-dark-800)] border border-[var(--color-dark-700)] px-3 py-2 rounded-lg text-[12px] text-[var(--color-dark-100)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {viewGoal.status === 'pending' && (
              <div className="flex gap-2 pt-4 mt-2 border-t border-[var(--color-dark-700)]">
                <button onClick={() => { setViewGoal(null); setApproveModal(viewGoal); }} className="btn btn-success flex-1"><Check size={14} /> Approve Goal</button>
                <button onClick={() => { setViewGoal(null); setRejectModal(viewGoal); }} className="btn btn-danger flex-1"><X size={14} /> Reject Goal</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
