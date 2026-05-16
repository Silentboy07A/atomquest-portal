import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { StatusBadge, ProgressBar, PriorityBadge, Card, Modal, EmptyState } from '../components/Shared/UIComponents';
import { Target, Plus, Edit3, Trash2, Send, Search, Eye, Lock, AlertCircle } from 'lucide-react';
import { GOAL_CATEGORIES, GOAL_TYPES, PRIORITY_LEVELS } from '../data/mockData';
import { validateGoal, getWeightageSummary, formatDate, isGoalLocked } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

export default function GoalsPage() {
  const { currentUser, goals, cycles, createGoal, updateGoal, deleteGoal, submitGoal, updateProgress, users } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const isAdmin = currentUser.role === 'admin';

  const myGoals = isAdmin
    ? goals.filter((g) => g.cycleId === activeCycle?.id)
    : goals.filter((g) => g.userId === currentUser.id && g.cycleId === activeCycle?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [viewGoal, setViewGoal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = myGoals;
    if (filterStatus !== 'all') list = list.filter((g) => g.status === filterStatus);
    if (search) list = list.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [myGoals, filterStatus, search]);

  const ws = getWeightageSummary(myGoals);

  const openCreate = () => { setEditGoal(null); setModalOpen(true); };
  const openEdit = (goal) => { setEditGoal(goal); setModalOpen(true); };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {isAdmin ? 'All Goals' : 'My Goals'}
          </h2>
          <p className="text-sm text-[var(--color-dark-300)]">
            {activeCycle?.name} · {myGoals.length} goals · {ws.total}/100 Weightage
          </p>
        </div>
        {!isAdmin && (
          <button onClick={openCreate} className="btn btn-primary" disabled={myGoals.filter((g) => g.status !== 'rejected').length >= 8}>
            <Plus size={16} /> Create Goal
          </button>
        )}
      </motion.div>

      {/* Weightage Warning */}
      {!isAdmin && ws.total > 0 && !ws.isComplete && (
        <motion.div variants={item} className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertCircle size={18} className="text-amber-400 shrink-0" />
          <div className="flex-1 text-sm text-amber-200/80">
            Total weightage is currently <strong className="text-amber-400">{ws.total}%</strong>. All goals combined must equal exactly 100% before submission.
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-dark-800)] p-2 rounded-xl border border-white/[0.04]">
        <div className="relative flex-1 max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input 
            type="text" 
            placeholder="Search goals..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-transparent border-none text-sm text-white pl-9 pr-3 py-2 outline-none placeholder:text-[var(--color-dark-400)]" 
          />
        </div>
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'draft', 'pending', 'approved', 'rejected'].map((s) => (
            <button 
              key={s} 
              onClick={() => setFilterStatus(s)} 
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === s 
                  ? 'bg-[var(--color-dark-600)] text-white' 
                  : 'text-[var(--color-dark-300)] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goals List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Target} title="No goals found" description="Create your first goal to get started with performance tracking." action={!isAdmin && <button onClick={openCreate} className="btn btn-primary"><Plus size={16} /> Create Goal</button>} />
      ) : (
        <motion.div variants={item} className="space-y-4">
          {filtered.map((goal) => (
            <GoalRow key={goal.id} goal={goal} onEdit={openEdit} onView={setViewGoal} onDelete={deleteGoal} onSubmit={submitGoal} onProgress={updateProgress} users={users} isAdmin={isAdmin} />
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <GoalFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editGoal={editGoal} myGoals={myGoals} userId={currentUser.id} cycleId={activeCycle?.id} onCreate={createGoal} onUpdate={updateGoal} />
      <GoalViewModal goal={viewGoal} onClose={() => setViewGoal(null)} users={users} />
    </motion.div>
  );
}

function GoalRow({ goal, onEdit, onView, onDelete, onSubmit, onProgress, users, isAdmin }) {
  const isDraft = goal.status === 'draft';
  const isRejected = goal.status === 'rejected';
  const canEdit = isDraft || isRejected;
  const locked = isGoalLocked(goal);
  const owner = users.find((u) => u.id === goal.userId);

  return (
    <motion.div layout className="bg-[var(--color-dark-800)] border border-white/[0.04] rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-6 hover:border-white/[0.08] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <button onClick={() => onView(goal)} className="text-base font-bold text-white hover:text-[var(--color-accent-300)] transition-colors text-left truncate" style={{ fontFamily: 'var(--font-display)' }}>
            {goal.title}
          </button>
          <StatusBadge status={goal.status} />
          {locked && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-dark-300)] bg-[var(--color-dark-700)] px-2 py-0.5 rounded-md">
              <Lock size={12} /> Locked
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-4 gap-y-2 text-xs text-[var(--color-dark-400)] flex-wrap">
          {isAdmin && owner && <span className="font-medium text-[var(--color-dark-200)]">{owner.name}</span>}
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />{goal.category}</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />Weight: <strong className="text-white">{goal.weightage}%</strong></span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />Due: {formatDate(goal.dueDate)}</span>
          <PriorityBadge priority={goal.priority} />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 shrink-0 border-t border-white/[0.04] lg:border-t-0 pt-4 lg:pt-0">
        <div className="w-full sm:w-48">
          <div className="flex justify-between text-[11px] font-medium mb-2">
            <span className="text-[var(--color-dark-300)]">Progress</span>
            <span className="text-white">{goal.progress}%</span>
          </div>
          <ProgressBar value={goal.progress} size="sm" showLabel={false} />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {goal.status === 'approved' && !isAdmin ? (
            <ProgressSlider goal={goal} onProgress={onProgress} />
          ) : (
            <button onClick={() => onView(goal)} className="btn btn-secondary btn-sm">View</button>
          )}
          
          {canEdit && !isAdmin && (
            <>
              <button onClick={() => onEdit(goal)} className="btn btn-secondary btn-sm btn-icon" title="Edit"><Edit3 size={15} /></button>
              <button onClick={() => onDelete(goal.id)} className="btn btn-danger btn-sm btn-icon" title="Delete"><Trash2 size={15} /></button>
              <button onClick={() => onSubmit(goal.id)} className="btn btn-primary btn-sm"><Send size={14} /> Submit</button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProgressSlider({ goal, onProgress }) {
  const [val, setVal] = useState(goal.progress);
  const [editing, setEditing] = useState(false);
  
  if (!editing) return <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Update</button>;
  
  return (
    <div className="flex items-center gap-3 bg-[var(--color-dark-900)] p-1.5 rounded-lg border border-white/[0.04]">
      <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-24 h-1.5 bg-[var(--color-dark-700)] rounded-full appearance-none cursor-pointer" style={{ accentColor: '#185FA5' }} />
      <span className="text-xs text-white font-bold w-7 text-right">{val}%</span>
      <button onClick={() => { onProgress(goal.id, val); setEditing(false); }} className="px-3 py-1 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-400)] text-white text-xs font-semibold rounded-md transition-colors">Save</button>
      <button onClick={() => setEditing(false)} className="px-2 py-1 text-[var(--color-dark-400)] hover:text-white transition-colors">✕</button>
    </div>
  );
}

function GoalFormModal({ isOpen, onClose, editGoal, myGoals, userId, cycleId, onCreate, onUpdate }) {
  const empty = { title: '', description: '', category: '', type: 'Individual', priority: 'Medium', weightage: 20, dueDate: '', milestones: [] };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [milestoneInput, setMilestoneInput] = useState('');

  React.useEffect(() => {
    if (editGoal) setForm({ title: editGoal.title, description: editGoal.description, category: editGoal.category, type: editGoal.type, priority: editGoal.priority, weightage: editGoal.weightage, dueDate: editGoal.dueDate, milestones: editGoal.milestones || [] });
    else setForm(empty);
    setErrors({});
    setMilestoneInput('');
  }, [editGoal, isOpen]);

  const ws = getWeightageSummary(myGoals);
  const otherGoals = myGoals.filter((g) => g.id !== editGoal?.id && g.status !== 'rejected');
  const usedWeightage = otherGoals.reduce((s, g) => s + g.weightage, 0);
  const maxAvailable = 100 - usedWeightage;

  const handleSubmit = () => {
    const { valid, errors: e } = validateGoal({ ...form, id: editGoal?.id }, myGoals);
    if (!valid) { setErrors(e); return; }
    if (editGoal) {
      onUpdate(editGoal.id, form);
    } else {
      onCreate({ ...form, userId, cycleId });
    }
    onClose();
  };

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const addMilestone = () => {
    if (milestoneInput.trim()) {
      setForm((f) => ({ ...f, milestones: [...f.milestones, milestoneInput.trim()] }));
      setMilestoneInput('');
    }
  };

  const removeMilestone = (index) => {
    setForm((f) => ({ ...f, milestones: f.milestones.filter((_, i) => i !== index) }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editGoal ? 'Edit Goal' : 'Create Goal'} size="lg">
      {errors._form && <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"><AlertCircle size={18} className="shrink-0 mt-0.5" />{errors._form}</div>}

      {/* Weightage Budget Indicator */}
      <div className="mb-6 p-4 rounded-xl bg-[var(--color-dark-900)] border border-white/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white">Weightage Budget</span>
          <span className={`text-xs font-bold ${maxAvailable >= 10 ? 'text-[var(--color-accent-300)]' : 'text-red-400'}`}>
            {maxAvailable}% available
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-dark-800)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--color-accent-500)] transition-all duration-500" style={{ width: `${usedWeightage}%` }} />
        </div>
        <div className="flex gap-6 mt-2 text-[11px] font-medium text-[var(--color-dark-400)]">
          <span>Used: <strong className="text-[var(--color-dark-200)]">{usedWeightage}%</strong></span>
          <span>Goals: <strong className="text-[var(--color-dark-200)]">{otherGoals.length}/8</strong></span>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="label">Goal Title *</label>
          <input className={`input ${errors.title ? 'input-error' : ''}`} value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g., Increase API response time by 50%" maxLength={120} />
          {errors.title && <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>}
        </div>
        <div>
          <label className="label">Description *</label>
          <textarea className={`input ${errors.description ? 'input-error' : ''}`} rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Describe the goal, expected outcomes, and key deliverables..." />
          {errors.description && <p className="text-xs text-red-400 mt-1.5">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="label">Category *</label>
            <select className={`input ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={(e) => updateField('category', e.target.value)}>
              <option value="">Select category</option>
              {GOAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority *</label>
            <select className={`input ${errors.priority ? 'input-error' : ''}`} value={form.priority} onChange={(e) => updateField('priority', e.target.value)}>
              <option value="">Select priority</option>
              {PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label flex justify-between">
              <span>Weightage (%) *</span>
              <span className="text-[10px] text-[var(--color-dark-500)] normal-case">min 10%, max {maxAvailable}%</span>
            </label>
            <input type="number" className={`input ${errors.weightage ? 'input-error' : ''}`} value={form.weightage} onChange={(e) => updateField('weightage', Number(e.target.value))} min={10} max={maxAvailable} />
            {errors.weightage && <p className="text-xs text-red-400 mt-1.5">{errors.weightage}</p>}
          </div>
          <div>
            <label className="label">Due Date *</label>
            <input type="date" className={`input ${errors.dueDate ? 'input-error' : ''}`} value={form.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
            {errors.dueDate && <p className="text-xs text-red-400 mt-1.5">{errors.dueDate}</p>}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <label className="label">Milestones</label>
          <div className="flex gap-2">
            <input className="input flex-1" placeholder="Add a milestone..." value={milestoneInput} onChange={(e) => setMilestoneInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())} />
            <button type="button" onClick={addMilestone} className="btn btn-secondary px-5">Add</button>
          </div>
          {form.milestones.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.milestones.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-xs font-medium bg-[var(--color-dark-800)] border border-white/[0.04] text-[var(--color-dark-100)] px-3 py-1.5 rounded-lg">
                  {m}
                  <button onClick={() => removeMilestone(i)} className="text-[var(--color-dark-400)] hover:text-red-400 transition-colors">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-white/[0.04]">
        <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        <button onClick={handleSubmit} className="btn btn-primary">{editGoal ? 'Save Changes' : 'Create Goal'}</button>
      </div>
    </Modal>
  );
}

function GoalViewModal({ goal, onClose, users }) {
  if (!goal) return null;
  const owner = users.find((u) => u.id === goal.userId);
  const locked = isGoalLocked(goal);
  
  return (
    <Modal isOpen={!!goal} onClose={onClose} title="Goal Details" size="lg">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{goal.title}</h3>
            {locked && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-dark-300)] bg-[var(--color-dark-700)] px-2 py-0.5 rounded-md">
                <Lock size={12} /> Locked
              </span>
            )}
          </div>
          <p className="text-[15px] text-[var(--color-dark-200)] leading-relaxed">{goal.description}</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Status</span>
            <StatusBadge status={goal.status} size="lg" />
          </div>
          <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Priority</span>
            <PriorityBadge priority={goal.priority} />
          </div>
          <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Weightage</span>
            <div className="text-lg text-white font-bold tracking-tight">{goal.weightage}%</div>
          </div>
          <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Category</span>
            <div className="text-sm font-medium text-white">{goal.category}</div>
          </div>
          <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Due Date</span>
            <div className="text-sm font-medium text-white">{formatDate(goal.dueDate)}</div>
          </div>
          <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-4">
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark-400)] mb-1.5">Owner</span>
            <div className="text-sm font-medium text-white">{owner?.name || '—'}</div>
          </div>
        </div>

        <div className="bg-[var(--color-dark-900)] border border-white/[0.04] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Current Progress</span>
            <span className="text-sm font-bold text-white">{goal.progress}%</span>
          </div>
          <ProgressBar value={goal.progress} size="lg" showLabel={false} />
        </div>

        {goal.milestones?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Milestones</h4>
            <div className="flex flex-col gap-2">
              {goal.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-[var(--color-dark-800)] border border-white/[0.04] px-4 py-3 rounded-lg text-sm text-[var(--color-dark-100)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-500)]" />
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
