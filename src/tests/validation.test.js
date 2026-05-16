// ═══════════════════════════════════════════════════════
// ATOMQUEST — Validation Rule Tests
// Tests all business rules for goal creation/editing
// ═══════════════════════════════════════════════════════

import { validateGoal, validateWeightageComplete, isGoalLocked, getWeightageSummary, VALIDATION_RULES } from '../utils/helpers.js';

// Simple test runner
let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    results.push({ name, status: 'PASS' });
  } catch (err) {
    failed++;
    results.push({ name, status: 'FAIL', error: err.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message || 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

// ═══════════════════════════════════════════════════════
// TEST SUITE: Validation Rules
// ═══════════════════════════════════════════════════════

// ── Constants ──
test('VALIDATION_RULES has correct MIN_WEIGHTAGE', () => {
  assertEqual(VALIDATION_RULES.MIN_WEIGHTAGE, 10, 'Min weightage');
});

test('VALIDATION_RULES has correct MAX_GOALS', () => {
  assertEqual(VALIDATION_RULES.MAX_GOALS, 8, 'Max goals');
});

test('VALIDATION_RULES has correct TOTAL_WEIGHTAGE', () => {
  assertEqual(VALIDATION_RULES.TOTAL_WEIGHTAGE, 100, 'Total weightage');
});

// ── Title Validation ──
test('Rejects empty title', () => {
  const { valid, errors } = validateGoal({ title: '', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(!valid, 'Should be invalid');
  assert(errors.title, 'Should have title error');
});

test('Rejects title shorter than 5 chars', () => {
  const { valid, errors } = validateGoal({ title: 'Hi', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(!valid);
  assert(errors.title);
});

test('Accepts title with 5+ chars', () => {
  const { valid, errors } = validateGoal({ title: 'Valid Goal Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(!errors.title, 'Should not have title error');
});

test('Rejects title longer than 120 chars', () => {
  const longTitle = 'A'.repeat(121);
  const { errors } = validateGoal({ title: longTitle, description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(errors.title, 'Should have title error for >120 chars');
});

// ── Description Validation ──
test('Rejects empty description', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: '', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(errors.description, 'Should have description error');
});

test('Rejects description shorter than 10 chars', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Short', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(errors.description);
});

// ── Category + Priority ──
test('Rejects missing category', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: '', priority: 'High', weightage: 20, dueDate: '2026-06-30' });
  assert(errors.category);
});

test('Rejects missing priority', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: '', weightage: 20, dueDate: '2026-06-30' });
  assert(errors.priority);
});

// ── Weightage Validation ──
test('Rejects weightage below 10%', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 5, dueDate: '2026-06-30' });
  assert(errors.weightage, 'Should reject weightage < 10');
});

test('Accepts weightage of exactly 10%', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 10, dueDate: '2026-06-30' });
  assert(!errors.weightage, 'Should accept 10%');
});

test('Rejects weightage exceeding 100%', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 110, dueDate: '2026-06-30' });
  assert(errors.weightage, 'Should reject > 100%');
});

test('Rejects total weightage exceeding 100%', () => {
  const existingGoals = [
    { id: 'g1', weightage: 40, status: 'approved' },
    { id: 'g2', weightage: 40, status: 'approved' },
  ];
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 30, dueDate: '2026-06-30' }, existingGoals);
  assert(errors.weightage, 'Total would be 110%, should reject');
});

test('Accepts total weightage exactly 100%', () => {
  const existingGoals = [
    { id: 'g1', weightage: 40, status: 'approved' },
    { id: 'g2', weightage: 40, status: 'approved' },
  ];
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 20, dueDate: '2026-06-30' }, existingGoals);
  assert(!errors.weightage, 'Total is exactly 100%, should accept');
});

test('Excludes rejected goals from weightage budget', () => {
  const existingGoals = [
    { id: 'g1', weightage: 50, status: 'approved' },
    { id: 'g2', weightage: 40, status: 'rejected' },
  ];
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 50, dueDate: '2026-06-30' }, existingGoals);
  assert(!errors.weightage, 'Rejected goals excluded, total should be 100%');
});

// ── Max Goals ──
test('Rejects more than 8 goals per cycle', () => {
  const existingGoals = Array.from({ length: 8 }, (_, i) => ({ id: `g${i}`, weightage: 10, status: 'draft' }));
  const { errors } = validateGoal({ title: 'Ninth Goal Here', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 10, dueDate: '2026-06-30' }, existingGoals);
  assert(errors._form, 'Should reject 9th goal');
});

test('Allows exactly 8 goals per cycle', () => {
  const existingGoals = Array.from({ length: 7 }, (_, i) => ({ id: `g${i}`, weightage: 12, status: 'draft' }));
  const { errors } = validateGoal({ title: 'Eighth Goal Here', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 16, dueDate: '2026-06-30' }, existingGoals);
  assert(!errors._form, 'Should allow 8th goal');
});

test('Excluded rejected goals from goal count', () => {
  const existingGoals = [
    ...Array.from({ length: 7 }, (_, i) => ({ id: `g${i}`, weightage: 12, status: 'draft' })),
    { id: 'g8', weightage: 10, status: 'rejected' },
  ];
  const { errors } = validateGoal({ title: 'New Goal After Rejected', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 16, dueDate: '2026-06-30' }, existingGoals);
  assert(!errors._form, 'Rejected goals excluded from count');
});

// ── Due Date ──
test('Rejects missing due date', () => {
  const { errors } = validateGoal({ title: 'Valid Title', description: 'Valid description text', category: 'Technical', priority: 'High', weightage: 20, dueDate: '' });
  assert(errors.dueDate, 'Should require due date');
});

// ── Valid Goal (all rules pass) ──
test('Accepts fully valid goal', () => {
  const { valid, errors } = validateGoal({
    title: 'Complete API migration',
    description: 'Migrate all REST endpoints to GraphQL with federation',
    category: 'Technical',
    priority: 'High',
    weightage: 30,
    dueDate: '2026-06-30',
  });
  assert(valid, `Should be valid, but got errors: ${JSON.stringify(errors)}`);
});

// ═══════════════════════════════════════════════════════
// TEST SUITE: Weightage Complete Validation
// ═══════════════════════════════════════════════════════

test('validateWeightageComplete: rejects when total != 100', () => {
  const goals = [
    { weightage: 40, status: 'approved' },
    { weightage: 30, status: 'approved' },
  ];
  const { valid, message } = validateWeightageComplete(goals);
  assert(!valid, 'Should reject total of 70%');
  assert(message.includes('100%'), 'Should mention 100%');
});

test('validateWeightageComplete: accepts when total == 100', () => {
  const goals = [
    { weightage: 40, status: 'approved' },
    { weightage: 30, status: 'approved' },
    { weightage: 30, status: 'draft' },
  ];
  const { valid } = validateWeightageComplete(goals);
  assert(valid, 'Should accept total of 100%');
});

test('validateWeightageComplete: excludes rejected from total', () => {
  const goals = [
    { weightage: 50, status: 'approved' },
    { weightage: 50, status: 'approved' },
    { weightage: 20, status: 'rejected' },
  ];
  const { valid } = validateWeightageComplete(goals);
  assert(valid, 'Rejected excluded, total is 100%');
});

// ═══════════════════════════════════════════════════════
// TEST SUITE: Goal Locking
// ═══════════════════════════════════════════════════════

test('isGoalLocked: approved goals are locked', () => {
  assert(isGoalLocked({ status: 'approved' }), 'Approved should be locked');
});

test('isGoalLocked: completed goals are locked', () => {
  assert(isGoalLocked({ status: 'completed' }), 'Completed should be locked');
});

test('isGoalLocked: in_progress goals are locked', () => {
  assert(isGoalLocked({ status: 'in_progress' }), 'In progress should be locked');
});

test('isGoalLocked: draft goals are NOT locked', () => {
  assert(!isGoalLocked({ status: 'draft' }), 'Draft should not be locked');
});

test('isGoalLocked: pending goals are NOT locked', () => {
  assert(!isGoalLocked({ status: 'pending' }), 'Pending should not be locked');
});

test('isGoalLocked: rejected goals are NOT locked', () => {
  assert(!isGoalLocked({ status: 'rejected' }), 'Rejected should not be locked');
});

// ═══════════════════════════════════════════════════════
// TEST SUITE: Weightage Summary
// ═══════════════════════════════════════════════════════

test('getWeightageSummary: calculates correct totals', () => {
  const goals = [
    { weightage: 30, status: 'approved' },
    { weightage: 25, status: 'approved' },
    { weightage: 20, status: 'draft' },
    { weightage: 15, status: 'rejected' },
  ];
  const ws = getWeightageSummary(goals);
  assertEqual(ws.total, 75, 'Total should exclude rejected');
  assertEqual(ws.remaining, 25, 'Remaining');
  assertEqual(ws.isComplete, false, 'Not complete');
  assertEqual(ws.count, 3, 'Count excludes rejected');
});

test('getWeightageSummary: complete at 100%', () => {
  const goals = [
    { weightage: 50, status: 'approved' },
    { weightage: 50, status: 'approved' },
  ];
  const ws = getWeightageSummary(goals);
  assert(ws.isComplete, 'Should be complete');
  assertEqual(ws.remaining, 0);
});

// ═══════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════');
console.log('  ATOMQUEST — Validation Test Results');
console.log('═══════════════════════════════════════════\n');

results.forEach((r) => {
  const icon = r.status === 'PASS' ? '✓' : '✗';
  const color = r.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}  ${icon} ${r.name}\x1b[0m`);
  if (r.error) console.log(`    → ${r.error}`);
});

console.log(`\n  Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log('═══════════════════════════════════════════\n');

if (failed > 0) process.exit(1);
