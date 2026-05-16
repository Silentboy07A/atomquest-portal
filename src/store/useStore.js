// ═══════════════════════════════════════════════════════
// ATOMQUEST — Zustand Store (Global State Management)
// ═══════════════════════════════════════════════════════
import { create } from 'zustand';
import { USERS, INITIAL_GOALS, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, CYCLES, SHARED_GOALS, generateGoalId } from '../data/mockData';

let auditCounter = INITIAL_AUDIT_LOGS.length + 1;
let notifCounter = INITIAL_NOTIFICATIONS.length + 1;

const addAuditEntry = (set, get, action, entityType, entityId, userId, details, changes = {}) => {
  const entry = {
    id: `a${++auditCounter}`,
    action, entityType, entityId, userId,
    timestamp: new Date().toISOString(),
    details,
    changes,
  };
  set((s) => ({ auditLogs: [entry, ...s.auditLogs] }));
};

const addNotification = (set, type, title, message, userId) => {
  const n = { id: `n${++notifCounter}`, type, title, message, userId, read: false, timestamp: new Date().toISOString() };
  set((s) => ({ notifications: [n, ...s.notifications] }));
};

export const useStore = create((set, get) => ({
  // ── Auth ──
  currentUser: USERS[0],
  users: USERS,
  setCurrentUser: (userId) => set({ currentUser: USERS.find((u) => u.id === userId) }),

  // ── Goals ──
  goals: INITIAL_GOALS,

  createGoal: (goalData) => {
    const id = generateGoalId();
    const now = new Date().toISOString();
    const goal = { ...goalData, id, status: 'draft', progress: 0, createdAt: now, updatedAt: now, achievements: '', quarterlyUpdates: [], milestones: goalData.milestones || [] };
    set((s) => ({ goals: [...s.goals, goal] }));
    addAuditEntry(set, get, 'goal_created', 'goal', id, goalData.userId, `Created goal: ${goalData.title}`, { field: 'status', from: null, to: 'draft' });
    return id;
  },

  updateGoal: (goalId, updates) => {
    const old = get().goals.find((g) => g.id === goalId);
    if (!old) return;
    set((s) => ({
      goals: s.goals.map((g) => (g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g)),
    }));
    Object.keys(updates).forEach((field) => {
      if (old[field] !== updates[field]) {
        addAuditEntry(set, get, 'goal_updated', 'goal', goalId, get().currentUser.id, `Updated ${field} on "${old.title}"`, { field, from: old[field], to: updates[field] });
      }
    });
  },

  deleteGoal: (goalId) => {
    const goal = get().goals.find((g) => g.id === goalId);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== goalId) }));
    if (goal) addAuditEntry(set, get, 'goal_deleted', 'goal', goalId, get().currentUser.id, `Deleted goal: ${goal.title}`);
  },

  submitGoal: (goalId) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    set((s) => ({
      goals: s.goals.map((g) => (g.id === goalId ? { ...g, status: 'pending', updatedAt: new Date().toISOString() } : g)),
    }));
    addAuditEntry(set, get, 'goal_submitted', 'goal', goalId, goal.userId, `Submitted "${goal.title}" for approval`, { field: 'status', from: 'draft', to: 'pending' });
    const manager = USERS.find((u) => u.id === USERS.find((emp) => emp.id === goal.userId)?.managerId);
    if (manager) addNotification(set, 'approval_request', 'New Goal Pending', `${USERS.find((u) => u.id === goal.userId)?.name} submitted "${goal.title}" for approval`, manager.id);
  },

  approveGoal: (goalId, comment) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    const approver = get().currentUser;
    set((s) => ({
      goals: s.goals.map((g) => (g.id === goalId ? { ...g, status: 'approved', updatedAt: new Date().toISOString() } : g)),
    }));
    addAuditEntry(set, get, 'goal_approved', 'goal', goalId, approver.id, `Approved by ${approver.name}${comment ? ': ' + comment : ''}`, { field: 'status', from: 'pending', to: 'approved' });
    addNotification(set, 'approval', 'Goal Approved', `Your goal "${goal.title}" was approved by ${approver.name}`, goal.userId);
  },

  rejectGoal: (goalId, reason) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    const rejector = get().currentUser;
    set((s) => ({
      goals: s.goals.map((g) => (g.id === goalId ? { ...g, status: 'rejected', updatedAt: new Date().toISOString() } : g)),
    }));
    addAuditEntry(set, get, 'goal_rejected', 'goal', goalId, rejector.id, `Rejected by ${rejector.name}: ${reason}`, { field: 'status', from: 'pending', to: 'rejected' });
    addNotification(set, 'rejection', 'Goal Rejected', `Your goal "${goal.title}" was rejected: ${reason}`, goal.userId);
  },

  updateProgress: (goalId, progress) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    const oldProgress = goal.progress;
    set((s) => ({
      goals: s.goals.map((g) => (g.id === goalId ? { ...g, progress, updatedAt: new Date().toISOString() } : g)),
    }));
    addAuditEntry(set, get, 'progress_updated', 'goal', goalId, get().currentUser.id, `Progress updated from ${oldProgress}% to ${progress}%`, { field: 'progress', from: oldProgress, to: progress });
  },

  // ── Cycles ──
  cycles: CYCLES,
  activeCycle: CYCLES.find((c) => c.isActive),

  // ── Shared Goals ──
  sharedGoals: SHARED_GOALS,

  // ── Audit ──
  auditLogs: INITIAL_AUDIT_LOGS,

  // ── Notifications ──
  notifications: INITIAL_NOTIFICATIONS,
  markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  unreadCount: () => get().notifications.filter((n) => !n.read && (n.userId === get().currentUser.id || n.userId === 'all')).length,

  // ── UI ──
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
