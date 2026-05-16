const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.auditLog.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.sharedGoal.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.goalSheet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cycle.deleteMany();

  console.log('Seeding Cycles...');
  const cycle = await prisma.cycle.create({
    data: {
      name: 'FY26 Q2',
      startDate: new Date('2026-04-01T00:00:00Z'),
      endDate: new Date('2026-06-30T23:59:59Z'),
      isActive: true,
    }
  });

  console.log('Seeding Users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Ananya Reddy',
      email: 'ananya@atomquest.io',
      password: passwordHash,
      role: 'ADMIN',
      department: 'HR'
    }
  });

  // Manager
  const manager = await prisma.user.create({
    data: {
      name: 'Sneha Patel',
      email: 'sneha@atomquest.io',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Engineering'
    }
  });

  // Employees
  const emp1 = await prisma.user.create({
    data: {
      name: 'Arjun Mehta',
      email: 'arjun@atomquest.io',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: manager.id
    }
  });

  const emp2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@atomquest.io',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: manager.id
    }
  });

  const emp3 = await prisma.user.create({
    data: {
      name: 'Rahul Gupta',
      email: 'rahul@atomquest.io',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Design',
      managerId: manager.id
    }
  });

  console.log('Seeding Goals...');
  
  // Employee 1 Goal Sheet
  const sheet1 = await prisma.goalSheet.create({
    data: {
      userId: emp1.id,
      cycleId: cycle.id,
      status: 'APPROVED',
      totalWeightage: 100,
    }
  });

  await prisma.goal.create({
    data: {
      userId: emp1.id,
      cycleId: cycle.id,
      title: 'Migrate API to GraphQL',
      description: 'Complete migration of REST endpoints to GraphQL',
      category: 'Technical',
      type: 'Individual',
      priority: 'High',
      weightage: 50,
      uom: 'PERCENTAGE',
      targetValue: 100,
      actualValue: 65,
      progress: 65,
      status: 'APPROVED',
      dueDate: new Date('2026-06-15T00:00:00Z'),
      isLocked: true
    }
  });

  await prisma.goal.create({
    data: {
      userId: emp1.id,
      cycleId: cycle.id,
      title: 'Reduce page load time',
      description: 'Optimize bundle size by 40%',
      category: 'Technical',
      type: 'Individual',
      priority: 'Critical',
      weightage: 50,
      uom: 'NUMERIC',
      targetValue: 40,
      actualValue: 20,
      progress: 50,
      status: 'APPROVED',
      dueDate: new Date('2026-06-20T00:00:00Z'),
      isLocked: true
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
