import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { StatCard, ProgressBar, StatusBadge, Avatar, Card, WeightageGauge } from '../components/Shared/UIComponents';
import { Target, TrendingUp, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { getWeightageSummary, timeAgo } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };
const COLORS = ['#185FA5', '#059669', '#6366f1', '#dc2626', '#0891b2', '#a855f7'];

const chartTooltip = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 8,
  color: '#E2E8F0',
  fontSize: 12,
  fontFamily: 'DM Sans',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

export default function DashboardPage() {
  const { currentUser, goals, users, cycles, notifications } = useStore();
  const navigate = useNavigate();
  const activeCycle = cycles.find((c) => c.isActive);

  const isManager = currentUser.role === 'manager';
  const isAdmin = currentUser.role === 'admin';

  const myGoals = isAdmin ? goals.filter((g) => g.cycleId === activeCycle?.id) : goals.filter((g) => g.userId === currentUser.id && g.cycleId === activeCycle?.id);
  const teamGoals = isManager ? goals.filter((g) => { const emp = users.find((u) => u.id === g.userId); return emp?.managerId === currentUser.id && g.cycleId === activeCycle?.id; }) : [];
  const pendingApprovals = isManager ? teamGoals.filter((g) => g.status === 'pending') : [];

  const displayGoals = isManager ? [...myGoals, ...teamGoals] : myGoals;
  const avgProgress = displayGoals.length ? Math.round(displayGoals.reduce((s, g) => s + g.progress, 0) / displayGoals.length) : 0;
  const completedCount = displayGoals.filter((g) => g.progress >= 100).length;
  const atRiskCount = displayGoals.filter((g) => g.progress < 30 && g.status === 'approved').length;
  const ws = getWeightageSummary(myGoals);

  const categoryData = Object.entries(displayGoals.reduce((acc, g) => { acc[g.category] = (acc[g.category] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));

  const progressTrend = [
    { month: 'Jan', progress: 15 }, { month: 'Feb', progress: 30 }, { month: 'Mar', progress: 45 },
    { month: 'Apr', progress: 52 }, { month: 'May', progress: avgProgress },
  ];

  const recentNotifs = notifications.filter((n) => n.userId === currentUser.id || n.userId === 'all').slice(0, 4);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      
      {/* 1. HERO SECTION - Clean, structured, no extreme glow */}
      <motion.div variants={item} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="text-[13px] text-[var(--color-dark-300)] font-medium mb-1">
            {activeCycle?.name}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}>
            {greeting}, {currentUser.name.split(' ')[0]}
          </h2>
        </div>

        {!isAdmin && (
          <div className="flex items-center gap-6 bg-[var(--color-dark-800)] px-5 py-3 rounded-xl border border-white/[0.04]">
             <WeightageGauge total={ws.total} />
          </div>
        )}
      </motion.div>

      {/* 2. TOP KPI SECTION - Simplified */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Active Goals" value={displayGoals.filter((g) => g.status === 'approved').length} icon={Target} color="#185FA5" trend={12} />
        <StatCard title="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} color="#059669" trend={8} />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="#0891b2" />
        {isManager ? (
          <StatCard title="Pending Approvals" value={pendingApprovals.length} icon={Clock} color="#f59e0b" />
        ) : (
          <StatCard title="At Risk" value={atRiskCount} icon={AlertTriangle} color="#dc2626" />
        )}
      </motion.div>

      {/* 3. MIDDLE ANALYTICS - Rebalanced */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Progress Trend - Dominant */}
        <Card hover={false} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Progress Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={progressTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5E6D8C', fontSize: 11, fontFamily: 'DM Sans' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5E6D8C', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltip} />
              <Area type="monotone" dataKey="progress" stroke="#2B7FD4" strokeWidth={2} fill="url(#progressGrad)" dot={{ fill: '#111827', r: 4, strokeWidth: 2, stroke: '#2B7FD4' }} activeDot={{ r: 5, fill: '#185FA5', stroke: '#111827', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution - Secondary */}
        <Card hover={false} className="flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Goal Distribution
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={2} strokeWidth={0}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltip} itemStyle={{ color: '#E2E8F0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-6 px-4">
              {categoryData.slice(0,4).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[var(--color-dark-200)]">
                    <span className="w-2 h-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="truncate max-w-[100px]">{d.name}</span>
                  </div>
                  <span className="font-medium text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 4. BOTTOM ACTIVITY - Structured list */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Goals */}
        <Card hover={false} className="lg:col-span-2" padding="p-0">
          <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Recent Goals</h3>
            <button onClick={() => navigate('/goals')} className="text-[12px] text-[var(--color-dark-200)] hover:text-white flex items-center gap-1.5 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {(isManager ? teamGoals : myGoals).slice(0, 5).map((goal) => (
              <div key={goal.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{goal.title}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <StatusBadge status={goal.status} />
                    <span className="text-xs text-[var(--color-dark-300)]">{goal.category}</span>
                  </div>
                </div>
                <div className="w-32 shrink-0">
                  <ProgressBar value={goal.progress} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card hover={false} padding="p-0">
          <div className="p-6 border-b border-white/[0.04]">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentNotifs.map((n) => (
              <div key={n.id} className="p-5 flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-[var(--color-dark-500)]' : 'bg-[var(--color-accent-400)]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-[var(--color-dark-100)]">{n.title}</div>
                  <div className="text-xs text-[var(--color-dark-300)] mt-1 truncate">{n.message}</div>
                  <div className="text-[10px] text-[var(--color-dark-400)] mt-2 font-medium">{timeAgo(n.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* 5. MANAGER TEAM VIEW */}
      {isManager && (
        <motion.div variants={item}>
          <Card hover={false} padding="p-0">
            <div className="p-6 border-b border-white/[0.04]">
              <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Team Overview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Goals</th>
                    <th>Progress</th>
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
                          <div className="flex items-center gap-3">
                            <Avatar name={emp.name} size="sm" />
                            <div>
                              <div className="text-sm font-medium text-white">{emp.name}</div>
                              <div className="text-[11px] text-[var(--color-dark-400)]">{emp.title}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="font-medium text-white">{empGoals.length}</span></td>
                        <td><ProgressBar value={avg} size="sm" className="w-28" /></td>
                        <td>{pending > 0 ? <span className="text-amber-400 font-medium">{pending}</span> : <span className="text-[var(--color-dark-500)]">—</span>}</td>
                        <td>
                          <span className={`text-[11px] font-medium px-2 py-1 rounded-md ${avg >= 60 ? 'text-emerald-400 bg-emerald-400/10' : avg >= 30 ? 'text-amber-400 bg-amber-400/10' : 'text-red-400 bg-red-400/10'}`}>
                            {avg >= 60 ? 'On Track' : avg >= 30 ? 'Attention' : 'At Risk'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
