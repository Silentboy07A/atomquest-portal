const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');

const prisma = new PrismaClient();

/**
 * Generates an Achievement Report (Planned vs Actual) for all employees
 * Admin only access.
 */
const exportAchievementReport = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        status: { in: ['APPROVED', 'IN_PROGRESS', 'COMPLETED'] }
      },
      include: {
        user: { select: { name: true, department: true } },
        cycle: { select: { name: true } }
      },
      orderBy: { user: { department: 'asc' } }
    });

    // Transform data for Excel
    const data = goals.map(g => ({
      'Cycle': g.cycle.name,
      'Department': g.user.department,
      'Employee': g.user.name,
      'Goal Title': g.title,
      'Category': g.category,
      'Weightage (%)': g.weightage,
      'UOM': g.uom,
      'Target': g.targetValue,
      'Actual': g.actualValue,
      'Progress (%)': g.progress,
      'Status': g.status,
      'Due Date': g.dueDate.toISOString().split('T')[0]
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Achievement Report');

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="AtomQuest_Achievement_Report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = {
  exportAchievementReport
};
