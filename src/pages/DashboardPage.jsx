import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { WeightageGauge, Avatar, StatusBadge, ProgressBar, StatCard } from '../components/Shared/UIComponents';
import { Target, TrendingUp, CheckCircle, AlertTriangle, ArrowRight, Clock, Activity } from 'lucide-react';
import { getWeightageSummary, timeAgo } from '../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const DONUT_COLORS = [
  'var(--color-accent-600)',
  'var(--color-success-500)',
  'var(--color-warning-500)',
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
];

const chartTooltipStyle = {
  background: 'var(--color-dark-800)',
  border: '1px solid var(--color-dark-700)',
  borderRadius: 8,
  color: 'var(--color-dark-100)',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  padding: '6px 10px',
};

export default function DashboardPage() {
  const { currentUser, goals, users, cycles, notifications } = useStore();
  const navigate = useNavigate();
  const activeCycle = cycles.find((c) => c.isActive);
  const isManager = currentUser.role === 'manager';
  const isAdmin = currentUser.role === 'admin';

  const myGoals = isAdmin
    ? goals.filter((g) => g.cycleId === activeCycle?.id)
    : goals.filter((g) => g.userId === currentUser.id && g.cycleId === activeCycle?.id);

  const teamGoals = isManager
    ? goals.filter((g) => {
        const emp = users.find((u) => u.id === g.userId);
        return emp?.managerId === currentUser.id && g.cycleId === activeCycle?.id;
      })
    : [];

  const pendingApprovals = isManager ? teamGoals.filter((g) => g.status === 'pending') : [];
  const displayGoals = isManager ? [...myGoals, ...teamGoals] : myGoals;
  const activeCount = displayGoals.filter((g) => g.status === 'approved').length;
  const avgProgress = displayGoals.length
    ? Math.round(displayGoals.reduce((s, g) => s + g.progress, 0) / displayGoals.length)
    : 0;
  const completedCount = displayGoals.filter((g) => g.progress >= 100).length;
  const atRiskCount = displayGoals.filter((g) => g.progress < 30 && g.status === 'approved').length;

  const categoryData = useMemo(() => {
    return Object.entries(
      displayGoals.reduce((acc, g) => { acc[g.category] = (acc[g.category] || 0) + 1; return acc; }, {})
    ).map(([name, value]) => ({ name, value }));
  }, [displayGoals]);

  const progressTrend = [
    { month: 'Jan', progress: 12 },
    { month: 'Feb', progress: 28 },
    { month: 'Mar', progress: 42 },
    { month: 'Apr', progress: 55 },
    { month: 'May', progress: avgProgress },
  ];

  const recentNotifs = notifications
    .filter((n) => n.userId === currentUser.id || n.userId === 'all')
    .slice(0, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const ws = getWeightageSummary(myGoals);

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>
            {greeting}, {currentUser.name.split(' ')[0]}
          </h2>
          <p className="text-[12px] text-[var(--color-dark-300)] mt-0.5">{activeCycle?.name} · {displayGoals.length} goals tracked</p>
        </div>
        {!isAdmin && (
          <div className="flex items-center gap-4">
            <WeightageGauge total={ws.total} />
            <div className="w-px h-8 bg-[var(--color-dark-700)] hidden sm:block" />
            <button onClick={() => navigate('/goals')} className="btn btn-primary btn-sm">
              <Target size={14} /> View Goals
            </button>
          </div>
        )}
      </div>

      {/* ═══ METRICS ROW ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Active Goals" value={activeCount} icon={Target} color="var(--color-accent-500)" subtitle="This quarter" />
        <StatCard title="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} color="var(--color-success-500)" subtitle="Across all goals" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="var(--color-info-500)" subtitle="Goals at 100%" />
        {isManager ? (
          <StatCard title="Pending Reviews" value={pendingApprovals.length} icon={Clock} color="var(--color-warning-500)" subtitle="Awaiting action" />
        ) : (
          <StatCard title="At Risk" value={atRiskCount} icon={AlertTriangle} color="var(--color-danger-500)" subtitle="Below 30% progress" />
        )}
      </div>

      {/* ═══ CHARTS — 60/40 ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Progress Trend */}
        <div className="lg:col-span-3 surface-raised p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-header">Progress Trend</h3>
            <span className="section-meta">Jan – May {new Date().getFullYear()}</span>
          </div>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent-600)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-accent-600)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-dark-400)', fontSize: 11, fontFamily: 'var(--font-sans)' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-dark-400)', fontSize: 10 }} domain={[0, 100]} tickCount={5} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="progress" stroke="var(--color-accent-600)" strokeWidth={2} fill="url(#progressGrad)" dot={{ fill: 'var(--color-dark-800)', r: 3, strokeWidth: 2, stroke: 'var(--color-accent-600)' }} activeDot={{ r: 4, fill: 'var(--color-accent-500)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Distribution */}
        <div className="lg:col-span-2 surface-raised p-5 flex flex-col">
          <h3 className="section-header mb-3">Goal Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={55} dataKey="value" paddingAngle={2} strokeWidth={0}>
                  {categoryData.map((_, i) => (<Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1.5 mt-4">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-[var(--color-dark-200)]">
                    <span className="w-2 h-2 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <span className="font-medium text-[var(--color-dark-50)]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM — Goals Table + Activity ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Goals — table layout */}
        <div className="lg:col-span-2 surface-raised overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--color-dark-700)' }}>
            <h3 className="section-header">Recent Goals</h3>
            <button onClick={() => navigate('/goals')} className="text-[11px] text-[var(--color-dark-300)] hover:text-[var(--color-dark-50)] flex items-center gap-1 transition-colors font-medium">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {(isManager ? teamGoals : myGoals).slice(0, 5).map((goal) => (
                  <tr key={goal.id}>
                    <td>
                      <div className="text-[12px] font-medium text-[var(--color-dark-50)] truncate max-w-[200px]">{goal.title}</div>
                      {isManager && (
                        <div className="text-[10px] text-[var(--color-dark-400)] mt-0.5">
                          {users.find((u) => u.id === goal.userId)?.name}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-subtle">{goal.category}</span>
                    </td>
                    <td><StatusBadge status={goal.status} /></td>
                    <td className="w-32"><ProgressBar value={goal.progress} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="surface-raised overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 shrink-0" style={{ borderBottom: '1px solid var(--color-dark-700)' }}>
            <h3 className="section-header">Activity</h3>
          </div>
          <div className="p-4 space-y-0 flex-1 overflow-y-auto">
            {recentNotifs.map((n, idx) => (
              <div key={n.id} className="flex gap-3 py-2.5 relative">
                {idx < recentNotifs.length - 1 && (
                  <div className="absolute left-[9px] top-[30px] w-px h-[calc(100%-12px)] bg-[var(--color-dark-700)]" />
                )}
                <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'color-mix(in srgb, var(--color-accent-600) 15%, transparent)' }}>
                  <Activity size={9} className="text-[var(--color-accent-500)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] text-[var(--color-dark-200)] leading-relaxed line-clamp-2">{n.message}</div>
                  <div className="text-[10px] text-[var(--color-dark-400)] mt-0.5 font-medium">{timeAgo(n.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MANAGER: Pending Approvals ═══ */}
      {isManager && pendingApprovals.length > 0 && (
        <div className="surface-raised overflow-hidden">
          <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--color-dark-700)' }}>
            <Clock size={14} className="text-[var(--color-warning-400)]" />
            <h3 className="section-header">
              Pending Approvals <span className="text-[var(--color-dark-400)] font-normal ml-1">({pendingApprovals.length})</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Goal</th>
                  <th>Weight</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.slice(0, 5).map((goal) => {
                  const emp = users.find((u) => u.id === goal.userId);
                  return (
                    <tr key={goal.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={emp?.name || 'Unknown'} size="sm" />
                          <div className="text-[12px] text-[var(--color-dark-50)] font-medium">{emp?.name}</div>
                        </div>
                      </td>
                      <td className="text-[12px] text-[var(--color-dark-200)]">{goal.title}</td>
                      <td className="text-[12px] text-[var(--color-dark-300)] tabular-nums">{goal.weightage}%</td>
                      <td>
                        <button onClick={() => navigate('/approvals')} className="btn btn-sm btn-primary">
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ MANAGER: Team Overview ═══ */}
      {isManager && (
        <div className="surface-raised overflow-hidden">
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--color-dark-700)' }}>
            <h3 className="section-header">Team Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Goals</th>
                  <th>Avg Progress</th>
                  <th>Pending</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.filter((u) => u.managerId === currentUser.id).map((emp) => {
                  const empGoals = goals.filter((g) => g.userId === emp.id && g.cycleId === activeCycle?.id);
                  const avg = empGoals.length ? Math.round(empGoals.reduce((s, g) => s + g.progress, 0) / empGoals.length) : 0;
                  const pending = empGoals.filter((g) => g.status === 'pending').length;
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={emp.name} size="sm" />
                          <div>
                            <div className="text-[12px] font-medium text-[var(--color-dark-50)]">{emp.name}</div>
                            <div className="text-[10px] text-[var(--color-dark-400)]">{emp.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium text-[var(--color-dark-100)] tabular-nums">{empGoals.length}</td>
                      <td className="w-32"><ProgressBar value={avg} size="sm" /></td>
                      <td className="tabular-nums">
                        {pending > 0 ? (
                          <span className="text-[var(--color-warning-400)] font-medium">{pending}</span>
                        ) : (
                          <span className="text-[var(--color-dark-400)]">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                          avg >= 60 ? 'text-emerald-400 bg-emerald-400/10' : avg >= 30 ? 'text-amber-400 bg-amber-400/10' : 'text-red-400 bg-red-400/10'
                        }`}>
                          {avg >= 60 ? 'ON TRACK' : avg >= 30 ? 'NEEDS ATTENTION' : 'AT RISK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
