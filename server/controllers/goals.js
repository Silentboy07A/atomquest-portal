const { PrismaClient } = require('@prisma/client');
const { validateGoalSheet, ValidationError } = require('../utils/goalValidation');

const prisma = new PrismaClient();

/**
 * Submit Goal Sheet for Manager Approval
 */
const submitGoalSheet = async (req, res) => {
  try {
    const { cycleId, goals } = req.body;
    const userId = req.user.id;

    // Utilize TDD validation rules
    validateGoalSheet(goals);

    // Create Goal Sheet
    const goalSheet = await prisma.goalSheet.create({
      data: {
        userId,
        cycleId,
        status: 'PENDING',
        totalWeightage: 100
      }
    });

    // Create Goals
    const createdGoals = await Promise.all(
      goals.map(goal => 
        prisma.goal.create({
          data: {
            ...goal,
            userId,
            cycleId,
            status: 'PENDING'
          }
        })
      )
    );

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'SUBMIT_GOAL_SHEET',
        entityType: 'GoalSheet',
        entityId: goalSheet.id,
        userId: userId,
        details: `Goal sheet submitted for cycle ${cycleId} with ${createdGoals.length} goals.`,
      }
    });

    res.status(201).json({ message: 'Goal sheet submitted successfully', goalSheet, goals: createdGoals });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Submit Error:', error);
    res.status(500).json({ error: 'Server error during submission' });
  }
};

/**
 * Manager approves a goal sheet
 */
const approveGoalSheet = async (req, res) => {
  try {
    const { goalSheetId } = req.params;
    const managerId = req.user.id;

    const sheet = await prisma.goalSheet.findUnique({
      where: { id: goalSheetId },
      include: { user: true }
    });

    if (!sheet) return res.status(404).json({ error: 'Goal sheet not found' });
    if (sheet.user.managerId !== managerId) {
      return res.status(403).json({ error: 'Not authorized to approve this goal sheet' });
    }

    // Update sheet
    await prisma.goalSheet.update({
      where: { id: goalSheetId },
      data: { status: 'APPROVED' }
    });

    // Lock all goals
    await prisma.goal.updateMany({
      where: { userId: sheet.userId, cycleId: sheet.cycleId },
      data: { status: 'APPROVED', isLocked: true }
    });

    await prisma.auditLog.create({
      data: {
        action: 'APPROVE_GOAL_SHEET',
        entityType: 'GoalSheet',
        entityId: goalSheetId,
        userId: managerId,
        details: `Manager approved goal sheet for user ${sheet.userId}.`,
      }
    });

    res.status(200).json({ message: 'Goal sheet approved and locked' });
  } catch (error) {
    console.error('Approve Error:', error);
    res.status(500).json({ error: 'Server error during approval' });
  }
};

/**
 * Perform Quarterly Check-in
 */
const performCheckIn = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { actualValue, status, comment } = req.body;
    const userId = req.user.id;

    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    // Calculate progress based on UOM
    let progress = 0;
    if (goal.uom === 'NUMERIC' || goal.uom === 'PERCENTAGE') {
      progress = (actualValue / goal.targetValue) * 100;
    } else if (goal.uom === 'ZERO_BASED') {
      progress = actualValue === 0 ? 100 : 0;
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        goalId,
        userId,
        actualValue,
        status,
        comment
      }
    });

    await prisma.goal.update({
      where: { id: goalId },
      data: { actualValue, progress, status }
    });

    await prisma.auditLog.create({
      data: {
        action: 'GOAL_CHECK_IN',
        entityType: 'Goal',
        entityId: goalId,
        userId: userId,
        details: `Check-in updated actual value to ${actualValue} (${progress}%)`,
      }
    });

    res.status(201).json({ message: 'Check-in recorded', checkIn, progress });
  } catch (error) {
    console.error('CheckIn Error:', error);
    res.status(500).json({ error: 'Server error during check-in' });
  }
};

module.exports = {
  submitGoalSheet,
  approveGoalSheet,
  performCheckIn
};
