const { validateGoalSheet, ValidationError } = require('./goalValidation');

// Simple TDD Test Suite (can be run with node)

const runTests = () => {
  let passed = 0;
  let failed = 0;

  const test = (name, fn) => {
    try {
      fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   ${error.message}`);
      failed++;
    }
  };

  const expectThrow = (fn, errorMsg) => {
    try {
      fn();
      throw new Error('Expected function to throw, but it succeeded.');
    } catch (e) {
      if (e.message !== errorMsg && !e.message.includes(errorMsg)) {
        throw new Error(`Expected error "${errorMsg}", but got "${e.message}"`);
      }
    }
  };

  console.log('Running Goal Validation TDD Tests...\n');

  test('Validates a perfect goal sheet', () => {
    const goals = [
      { title: 'Goal 1', weightage: 50 },
      { title: 'Goal 2', weightage: 30 },
      { title: 'Goal 3', weightage: 20 },
    ];
    validateGoalSheet(goals); // should not throw
  });

  test('Rejects if max goals exceeded (>8)', () => {
    const goals = Array(9).fill({ title: 'Small Goal', weightage: 11 });
    expectThrow(() => validateGoalSheet(goals), 'Maximum 8 goals allowed');
  });

  test('Rejects if any goal has <10% weightage', () => {
    const goals = [
      { title: 'Big Goal', weightage: 95 },
      { title: 'Tiny Goal', weightage: 5 }, // < 10
    ];
    expectThrow(() => validateGoalSheet(goals), 'Tiny Goal" must have at least 10% weightage');
  });

  test('Rejects if total weightage is not 100%', () => {
    const goals = [
      { title: 'Goal 1', weightage: 50 },
      { title: 'Goal 2', weightage: 40 }, // total 90
    ];
    expectThrow(() => validateGoalSheet(goals), 'Total weightage must be exactly 100%');
  });

  test('Rejects empty goal sheet', () => {
    expectThrow(() => validateGoalSheet([]), 'Goal sheet must contain at least one goal');
  });

  console.log(`\nTests Complete: ${passed} passed, ${failed} failed.`);
};

if (require.main === module) {
  runTests();
}

module.exports = runTests;
