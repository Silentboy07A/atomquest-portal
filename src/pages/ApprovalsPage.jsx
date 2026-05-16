import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { StatusBadge, PriorityBadge, Modal, Avatar, EmptyState } from '../components/Shared/UIComponents';
import { CheckSquare, Check, X, Eye, Clock } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

export default function ApprovalsPage() {
  const { currentUser, goals, users, cycles, approveGoal, rejectGoal } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const [viewGoal, setViewGoal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveComment, setApproveComment] = useState('');
  const [approveModal, setApproveModal] = useState(null);
  const [filter, setFilter] = useState('pending');

  const teamGoals = useMemo(() => {
    return goals.filter((g) => {
      const emp = users.find((u) => u.id === g.userId);
      return emp?.managerId === currentUser.id && g.cycleId === activeCycle?.id;
    });
  }, [goals, users, currentUser.id, activeCycle?.id]);

  const filtered = filter === 'all' ? teamGoals : teamGoals.filter((g) => g.status === filter);
  const pendingCount = teamGoals.filter((g) => g.status === 'pending').length;

  const handleApprove = () => {
    if (approveModal) {
      approveGoal(approveModal.id, approveComment);
      setApproveModal(null);
      setApproveComment('');
    }
  };

  const handleReject = () => {
    if (rejectModal && rejectReason.trim()) {
      rejectGoal(rejectModal.id, rejectReason);
      setRejectModal(null);
      setRejectReason('');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Approvals</h2>
          <p className="text-sm text-[var(--color-dark-300)]">
            {pendingCount} pending · {teamGoals.length} total team goals
          </p>
        </div>
      </motion.div>

      {/* Filters & Summary */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-4 md:items-center">
        {pendingCount > 0 && (
          <div className="flex-1 bg-[var(--color-dark-800)] border border-white/[0.04] p-4 rounded-xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-500)]/10 flex items-center justify-center">
              <Clock size={20} className="text-[var(--color-accent-400)]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{pendingCount}</div>
              <div className="text-xs text-[var(--color-dark-400)] font-medium">Goals awaiting your review</div>
            </div>
          </div>
        )}
        
        <div className={`bg-[var(--color-dark-800)] p-2 rounded-xl border border-white/[0.04] flex gap-1 overflow-x-auto ${pendingCount === 0 ? 'w-full' : ''}`}>
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === s 
                  ? 'bg-[var(--color-dark-600)] text-white' 
                  : 'text-[var(--color-dark-300)] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {s === 'pending' ? `Pending (${pendingCount})` : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Approval Queue */}
      {filtered.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No goals to review" description="All team goals have been reviewed. Check back later." />
      ) : (
        <motion.div variants={item} className="space-y-4">
          {filtered.map((goal) => {
            const owner = users.find((u) => u.id === goal.userId);
            return (
              <motion.div 
                key={goal.id} 
                layout 
                className="bg-[var(--color-dark-800)] border border-white/[0.04] p-5 sm:p-6 rounded-xl hover:border-white/[0.08] transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4 md:w-64 shrink-0 border-b border-white/[0.04] md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
                    <Avatar name={owner?.name} size="md" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate mb-0.5">{owner?.name}</div>
                      <div className="text-xs text-[var(--color-dark-400)] truncate">{owner?.title}</div>
                    </div>
                  </div>

                  {/* Goal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-base font-bold text-white truncate" style={{ fontFamily: 'var(--font-display)' }}>{goal.title}</span>
                      <StatusBadge status={goal.status} />
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-2 text-xs text-[var(--color-dark-400)] flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />{goal.category}</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />Weight: <strong className="text-white">{goal.weightage}%</strong></span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />Due: {formatDate(goal.dueDate)}</span>
                      <PriorityBadge priority={goal.priority} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    <button onClick={() => setViewGoal(goal)} className="btn btn-secondary btn-sm btn-icon" title="View details"><Eye size={15} /></button>
                    {goal.status === 'pending' && (
                      <>
                        <button onClick={() => { setRejectModal(goal); setRejectReason(''); }} className="btn btn-danger btn-sm px-3">
                          <X size={14} /> <span className="hide-mobile">Reject</span>
                        </button>
                        <button onClick={() => { setApproveModal(goal); setApproveComment(''); }} className="btn btn-success btn-sm px-3">
                          <Check size={14} /> <span className="hide-mobile">Approve</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* View Modal */}
      <Modal isOpen={!!viewGoal} onClose={() => setViewGoal(null)} title="Goal Details" size="lg">
        {viewGoal && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{viewGoal.title}</h3>
              <p className="text-[15px] text-[var(--color-dark-200)] leading-relaxed">{viewGoal.description}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Category</span>
                <div className="text-sm font-medium text-white">{viewGoal.category}</div>
              </div>
              <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Weightage</span>
                <div className="text-lg text-white font-bold tracking-tight">{viewGoal.weightage}%</div>
              </div>
              <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Priority</span>
                <PriorityBadge priority={viewGoal.priority} />
              </div>
              <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Due Date</span>
                <div className="text-sm font-medium text-white">{formatDate(viewGoal.dueDate)}</div>
              </div>
            </div>
            
            {viewGoal.milestones?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Milestones</h4>
                <div className="flex flex-col gap-2">
                  {viewGoal.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[var(--color-dark-800)] border border-white/[0.04] px-4 py-3 rounded-lg text-sm text-[var(--color-dark-100)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {viewGoal.status === 'pending' && (
              <div className="flex gap-3 pt-5 mt-2 border-t border-white/[0.04]">
                <button onClick={() => { setViewGoal(null); setApproveModal(viewGoal); }} className="btn btn-success flex-1 py-2.5 text-sm"><Check size={16} /> Approve Goal</button>
                <button onClick={() => { setViewGoal(null); setRejectModal(viewGoal); }} className="btn btn-danger flex-1 py-2.5 text-sm"><X size={16} /> Reject Goal</button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal isOpen={!!approveModal} onClose={() => setApproveModal(null)} title="Approve Goal" size="sm">
        <div className="space-y-5">
          <div className="bg-[var(--color-dark-900)] p-4 rounded-xl border border-white/[0.04]">
            <p className="text-sm text-[var(--color-dark-200)] leading-relaxed">
              You are approving <span className="text-white font-semibold">{approveModal?.title}</span>. 
              This will lock the goal and make it active for the employee.
            </p>
          </div>
          <div>
            <label className="label">Add a comment (Optional)</label>
            <textarea className="input" rows={3} value={approveComment} onChange={(e) => setApproveComment(e.target.value)} placeholder="E.g., Great goal, let's focus on Q1..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setApproveModal(null)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleApprove} className="btn btn-success"><Check size={14} /> Approve & Lock</button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Goal" size="sm">
        <div className="space-y-5">
          <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <p className="text-sm text-red-200/80 leading-relaxed">
              You are returning <span className="text-red-300 font-semibold">{rejectModal?.title}</span> for revision. The employee will be able to edit and resubmit.
            </p>
          </div>
          <div>
            <label className="label">Reason for Rejection *</label>
            <textarea className="input" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Explain why this goal needs revision..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setRejectModal(null)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleReject} className="btn btn-danger" disabled={!rejectReason.trim()}><X size={14} /> Reject Goal</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
