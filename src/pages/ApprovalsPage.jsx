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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-dark-50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Approvals</h2>
          <p className="text-[12px] text-[var(--color-dark-300)]">
            {pendingCount} pending · {teamGoals.length} total team goals
          </p>
        </div>
      </motion.div>

      {/* Filters & Summary */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-4 md:items-center">
        {pendingCount > 0 && (
          <div className="flex-1 surface-raised p-4 flex items-center gap-4 border border-[var(--color-dark-600)] bg-[var(--color-dark-900)]">
             <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-600)]/10 flex items-center justify-center">
              <Clock size={20} className="text-[var(--color-accent-500)]" />
            </div>
            <div>
              <div className="text-[16px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>{pendingCount}</div>
              <div className="text-[11px] text-[var(--color-dark-400)] font-medium">Goals awaiting your review</div>
            </div>
          </div>
        )}
        
        <div className={`surface-raised p-2 flex gap-1 overflow-x-auto ${pendingCount === 0 ? 'w-full' : ''}`}>
          {['pending', 'approved', 'rejected', 'all'].map((s) => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === s 
                  ? 'bg-[var(--color-dark-700)] text-[var(--color-dark-50)]' 
                  : 'text-[var(--color-dark-300)] hover:text-[var(--color-dark-100)] hover:bg-[var(--color-dark-800)]'
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
        <motion.div variants={item} className="space-y-3">
          {filtered.map((goal) => {
            const owner = users.find((u) => u.id === goal.userId);
            return (
              <motion.div 
                key={goal.id} 
                layout 
                className="surface-raised p-4 sm:p-5 hover:border-[var(--color-dark-600)] transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4 md:w-56 shrink-0 border-b border-[var(--color-dark-700)] md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
                    <Avatar name={owner?.name} size="md" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--color-dark-50)] truncate mb-0.5">{owner?.name}</div>
                      <div className="text-[11px] text-[var(--color-dark-400)] truncate">{owner?.title}</div>
                    </div>
                  </div>

                  {/* Goal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[14px] font-semibold text-[var(--color-dark-50)] truncate" style={{ fontFamily: 'var(--font-display)' }}>{goal.title}</span>
                      <StatusBadge status={goal.status} />
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-2 text-[11px] text-[var(--color-dark-400)] flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[var(--color-dark-500)]" />{goal.category}</span>
                      <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[var(--color-dark-500)]" />Weight: <strong className="text-[var(--color-dark-100)]">{goal.weightage}%</strong></span>
                      <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[var(--color-dark-500)]" />Due: {formatDate(goal.dueDate)}</span>
                      <PriorityBadge priority={goal.priority} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    <button onClick={() => setViewGoal(goal)} className="btn btn-secondary btn-sm btn-icon" title="View details"><Eye size={14} /></button>
                    {goal.status === 'pending' && (
                      <>
                        <button onClick={() => { setRejectModal(goal); setRejectReason(''); }} className="btn btn-danger btn-sm px-3">
                          <X size={13} /> <span className="hide-mobile">Reject</span>
                        </button>
                        <button onClick={() => { setApproveModal(goal); setApproveComment(''); }} className="btn btn-success btn-sm px-3">
                          <Check size={13} /> <span className="hide-mobile">Approve</span>
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

      {/* Approve Confirmation Modal */}
      <Modal isOpen={!!approveModal} onClose={() => setApproveModal(null)} title="Approve Goal" size="sm">
        <div className="space-y-4">
          <div className="bg-[var(--color-dark-900)] p-4 rounded-xl border border-[var(--color-dark-700)]">
            <p className="text-[12px] text-[var(--color-dark-200)] leading-relaxed">
              You are approving <span className="text-[var(--color-dark-50)] font-semibold">{approveModal?.title}</span>. 
              This will lock the goal and make it active for the employee.
            </p>
          </div>
          <div>
            <label className="label">Add a comment (Optional)</label>
            <textarea className="input" rows={3} value={approveComment} onChange={(e) => setApproveComment(e.target.value)} placeholder="E.g., Great goal, let's focus on Q1..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setApproveModal(null)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleApprove} className="btn btn-success"><Check size={14} /> Approve & Lock</button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject Goal" size="sm">
        <div className="space-y-4">
          <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <p className="text-[12px] text-[var(--color-danger-400)] leading-relaxed">
              You are returning <span className="font-semibold">{rejectModal?.title}</span> for revision. The employee will be able to edit and resubmit.
            </p>
          </div>
          <div>
            <label className="label">Reason for Rejection *</label>
            <textarea className="input" rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Explain why this goal needs revision..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setRejectModal(null)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleReject} className="btn btn-danger" disabled={!rejectReason.trim()}><X size={14} /> Reject Goal</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
