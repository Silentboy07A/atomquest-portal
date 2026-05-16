// Validation utility implementing Test-Driven Development (TDD) for Goal rules

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates a user's goal sheet before submission
 * @param {Array} goals - List of goals
 * @returns {Boolean} true if valid, throws error if invalid
 */
function validateGoalSheet(goals) {
  if (!goals || goals.length === 0) {
    throw new ValidationError('Goal sheet must contain at least one goal.');
  }

  // Rule 1: Max 8 goals per employee
  if (goals.length > 8) {
    throw new ValidationError(`Maximum 8 goals allowed. You submitted ${goals.length}.`);
  }

  let totalWeightage = 0;

  goals.forEach((goal, index) => {
    // Rule 2: Min 10% weightage per goal
    if (goal.weightage < 10) {
      throw new ValidationError(`Goal "${goal.title || `Goal ${index + 1}`}" must have at least 10% weightage.`);
    }
    totalWeightage += goal.weightage;
  });

  // Rule 3: Total weightage exactly 100%
  if (totalWeightage !== 100) {
    throw new ValidationError(`Total weightage must be exactly 100%. Current total: ${totalWeightage}%.`);
  }

  return true;
}

module.exports = {
  validateGoalSheet,
  ValidationError
};
