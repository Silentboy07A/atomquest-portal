// ═══════════════════════════════════════════════════════
// Validation utilities for goal workflows
// Strict enforcement of all business rules
// ═══════════════════════════════════════════════════════

export const VALIDATION_RULES = {
  MIN_WEIGHTAGE: 10,
  MAX_WEIGHTAGE: 100,
  MAX_GOALS: 8,
  TOTAL_WEIGHTAGE: 100,
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 120,
  MIN_DESCRIPTION_LENGTH: 10,
};

/**
 * Validates a single goal against all business rules.
 * Checks: title length, description length, category, priority, weightage range,
 *         max goals per cycle, total weightage budget, due date requirement.
 */
export function validateGoal(goal, existingGoals = []) {
  const errors = {};

  // Title validation
  if (!goal.title || goal.title.trim().length < VALIDATION_RULES.MIN_TITLE_LENGTH) {
    errors.title = `Title must be at least ${VALIDATION_RULES.MIN_TITLE_LENGTH} characters`;
  }
  if (goal.title && goal.title.length > VALIDATION_RULES.MAX_TITLE_LENGTH) {
    errors.title = `Title must be under ${VALIDATION_RULES.MAX_TITLE_LENGTH} characters`;
  }

  // Description validation
  if (!goal.description || goal.description.trim().length < VALIDATION_RULES.MIN_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at least ${VALIDATION_RULES.MIN_DESCRIPTION_LENGTH} characters`;
  }

  // Required fields
  if (!goal.category) errors.category = 'Category is required';
  if (!goal.priority) errors.priority = 'Priority is required';
  if (!goal.dueDate) errors.dueDate = 'Due date is required';

  // Weightage range
  if (!goal.weightage || goal.weightage < VALIDATION_RULES.MIN_WEIGHTAGE) {
    errors.weightage = `Minimum weightage is ${VALIDATION_RULES.MIN_WEIGHTAGE}%`;
  }
  if (goal.weightage > VALIDATION_RULES.MAX_WEIGHTAGE) {
    errors.weightage = `Maximum weightage is ${VALIDATION_RULES.MAX_WEIGHTAGE}%`;
  }

  // Goals from same user/cycle that aren't rejected (active budget)
  const otherGoals = existingGoals.filter((g) => g.id !== goal.id && g.status !== 'rejected');

  // Max 8 goals per cycle
  if (otherGoals.length >= VALIDATION_RULES.MAX_GOALS && !goal.id) {
    errors._form = `Maximum ${VALIDATION_RULES.MAX_GOALS} goals allowed per cycle`;
  }

  // Total weightage must not exceed 100%
  const totalWeight = otherGoals.reduce((sum, g) => sum + (g.weightage || 0), 0) + (goal.weightage || 0);
  if (totalWeight > VALIDATION_RULES.TOTAL_WEIGHTAGE) {
    errors.weightage = `Total weightage would exceed 100% (current: ${totalWeight - (goal.weightage || 0)}%, adding: ${goal.weightage}%)`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates that total weightage equals exactly 100% before submission.
 * This is stricter than validateGoal — used when submitting all goals.
 */
export function validateWeightageComplete(goals) {
  const active = goals.filter((g) => g.status !== 'rejected');
  const total = active.reduce((s, g) => s + g.weightage, 0);
  if (total !== 100) {
    return { valid: false, message: `Total weightage must equal exactly 100% (currently ${total}%)` };
  }
  return { valid: true, message: null };
}

/**
 * Checks if a goal is locked (approved goals cannot be edited).
 */
export function isGoalLocked(goal) {
  return goal.status === 'approved' || goal.status === 'completed' || goal.status === 'in_progress';
}

export function getWeightageSummary(goals) {
  const active = goals.filter((g) => g.status !== 'rejected');
  const total = active.reduce((s, g) => s + g.weightage, 0);
  return { total, remaining: 100 - total, isComplete: total === 100, count: active.length };
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getProgressColor(progress) {
  if (progress >= 70) return '#10b981';
  if (progress >= 35) return '#f59e0b';
  return '#ef4444';
}

export function getStatusConfig(status) {
  const map = {
    draft: { label: 'Draft', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
    pending: { label: 'Pending', color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
    approved: { label: 'Approved', color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    rejected: { label: 'Rejected', color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
    in_progress: { label: 'In Progress', color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
    completed: { label: 'Completed', color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    on_hold: { label: 'On Hold', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  };
  return map[status] || map.draft;
}
