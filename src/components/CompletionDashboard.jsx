import React from 'react';
import { useStore } from '../store/useStore';
import { StatCard, Avatar } from './Shared/UIComponents';
import { Target, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { getWeightageSummary } from '../utils/helpers';

export function CompletionDashboard() {
  const { goals, users, cycles } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);

  const allGoals = goals.filter(g => g.cycleId === activeCycle?.id);
  const totalGoals = allGoals.length;
  const completedGoals = allGoals.filter(g => g.progress >= 100).length;
  
  const pendingGoals = allGoals.filter(g => g.status === 'pending').length;
  const draftGoals = allGoals.filter(g => g.status === 'draft' || g.status === 'rejected').length;

  const employees = users.filter(u => u.role === 'employee');
  const incompleteEmployees = employees.map(emp => {
    const empGoals = allGoals.filter(g => g.userId === emp.id);
    const ws = getWeightageSummary(empGoals);
    return { ...emp, totalWeightage: ws.total, remaining: ws.remaining };
  }).filter(emp => emp.totalWeightage < 100)
    .sort((a, b) => a.totalWeightage - b.totalWeightage)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2 border-b border-[var(--color-dark-700)] pb-3 mt-8">
        <h3 className="text-[16px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>Organization Completion Overview</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Org Goals" value={totalGoals} icon={Target} color="var(--color-accent-500)" subtitle="Organization wide" />
        <StatCard title="Completed" value={completedGoals} icon={CheckCircle} color="var(--color-success-500)" subtitle="At 100% progress" />
        <StatCard title="Pending Approval" value={pendingGoals} icon={Clock} color="var(--color-warning-500)" subtitle="Awaiting manager" />
        <StatCard title="Drafts" value={draftGoals} icon={FileText} color="var(--color-dark-400)" subtitle="Not submitted" />
      </div>

      <div className="surface-raised overflow-hidden">
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-dark-700)' }}>
          <AlertCircle size={14} className="text-[var(--color-danger-400)]" />
          <h3 className="section-header">
            Employees with Incomplete Weightage
          </h3>
        </div>
        {incompleteEmployees.length === 0 ? (
           <div className="p-8 text-center text-[12px] text-[var(--color-dark-400)]">All employees have 100% weightage.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Current Weightage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incompleteEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={emp.name} size="sm" />
                        <div>
                          <div className="text-[12px] text-[var(--color-dark-50)] font-medium">{emp.name}</div>
                          <div className="text-[10px] text-[var(--color-dark-400)]">{emp.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-[12px] text-[var(--color-dark-200)]">{emp.department}</td>
                    <td className="text-[12px] text-[var(--color-dark-300)] tabular-nums font-bold text-[var(--color-danger-400)]">{emp.totalWeightage}%</td>
                    <td>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide text-red-400 bg-red-400/10">
                        {emp.remaining}% REMAINING
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
