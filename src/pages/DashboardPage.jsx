import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { WeightageGauge, Avatar } from '../components/Shared/UIComponents';
import { Target, TrendingUp, CheckCircle, AlertTriangle, ArrowRight, Clock, Activity } from 'lucide-react';
import { getWeightageSummary, timeAgo, getProgressColor } from '../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } };

const DONUT_COLORS = ['#0891b2', '#6366f1', '#185FA5', '#f59e0b', '#a855f7', '#059669'];

const chartTooltipStyle = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: '#E2E8F0',
  fontSize: 12,
  fontFamily: 'DM Sans',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  padding: '8px 12px',
};

/* ── Stat Card (inline, uniform) ── */
function DashStatCard({ title, value, icon: Icon, color, trend, isRisk = false }) {
  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'rgba(22, 27, 45, 0.6)',
        border: isRisk
          ? '1px solid rgba(239,68,68,0.25)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isRisk ? '0 0 20px rgba(239,68,68,0.06)' : 'none',
      }}
    >
      <div className="p-5 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}12` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-2xl font-bold text-white tracking-tight leading-none mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </div>
          <div className="text-[12px] font-medium text-[#5E6D8C]">{title}</div>
        </div>
        {trend !== undefined && trend !== null && (
          <span
            className={`text-[11px] font-semibold px-2 py-1 rounded-md shrink-0 ${
              trend > 0
                ? 'text-emerald-400 bg-emerald-400/[0.08]'
                : 'text-red-400 bg-red-400/[0.08]'
            }`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── Progress bar — colored by percentage ── */
function ColoredProgressBar({ value }) {
  const color = value < 25 ? '#ef4444' : value <= 60 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums min-w-[32px] text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

/* ── Status badge ── */
function StatusPill({ status }) {
  const map = {
    draft: { label: 'Draft', color: '#5c5c78', bg: 'rgba(92,92,120,0.1)' },
    pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
    approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    rejected: { label: 'Rejected', color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
  };
  const cfg = map[status] || map.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

/* ── Category pill ── */
function CategoryPill({ name }) {
  return (
    <span className="text-[11px] font-medium text-[#5E6D8C] bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
      {name}
    </span>
  );
}

/* ── Activity icon ── */
function ActivityIcon({ type }) {
  const map = {
    approval: { color: '#10b981', Icon: CheckCircle },
    approval_request: { color: '#f59e0b', Icon: Clock },
    reminder: { color: '#6366f1', Icon: Clock },
    system: { color: '#0891b2', Icon: Activity },
    achievement: { color: '#a855f7', Icon: Target },
    rejection: { color: '#ef4444', Icon: AlertTriangle },
  };
  const cfg = map[type] || map.system;
  return (
    <div
      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
      style={{ background: `${cfg.color}12` }}
    >
      <cfg.Icon size={13} style={{ color: cfg.color }} />
    </div>
  );
}

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
  const activeGoalCount = displayGoals.filter((g) => g.status === 'approved').length;
  const avgProgress = displayGoals.length
    ? Math.round(displayGoals.reduce((s, g) => s + g.progress, 0) / displayGoals.length)
    : 0;
  const completedCount = displayGoals.filter((g) => g.progress >= 100).length;
  const atRiskCount = displayGoals.filter(
    (g) => g.progress < 30 && g.status === 'approved'
  ).length;

  // Chart data
  const categoryData = Object.entries(
    displayGoals.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const progressTrend = [
    { month: 'Jan', progress: 12 },
    { month: 'Feb', progress: 28 },
    { month: 'Mar', progress: 42 },
    { month: 'Apr', progress: 55 },
    { month: 'May', progress: avgProgress },
  ];

  const recentNotifs = notifications
    .filter((n) => n.userId === currentUser.id || n.userId === 'all')
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const ws = getWeightageSummary(myGoals);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto"
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* ═══ 1. GREETING ═══ */}
      <motion.div variants={item} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="text-[13px] text-[#5E6D8C] font-medium mb-1">
            {activeCycle?.name}
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {greeting}, {currentUser.name.split(' ')[0]}
          </h2>
        </div>
        {!isAdmin && (
          <div className="flex items-center gap-6 px-5 py-3 rounded-xl" style={{ background: 'rgba(22,27,45,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <WeightageGauge total={ws.total} />
          </div>
        )}
      </motion.div>

      {/* ═══ 2. STAT CARDS — uniform row ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashStatCard title="Active Goals" value={activeGoalCount} icon={Target} color="#185FA5" trend={12} />
        <DashStatCard title="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} color="#059669" trend={8} />
        <DashStatCard title="Completed" value={completedCount} icon={CheckCircle} color="#0891b2" />
        {isManager ? (
          <DashStatCard title="Pending Approvals" value={pendingApprovals.length} icon={Clock} color="#f59e0b" />
        ) : (
          <DashStatCard title="At Risk" value={atRiskCount} icon={AlertTriangle} color="#dc2626" isRisk />
        )}
      </div>

      {/* ═══ 3. MIDDLE — 60/40 Charts ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Progress Trend — 3/5 = 60% */}
        <motion.div
          variants={item}
          className="lg:col-span-3 rounded-xl p-6"
          style={{
            background: 'rgba(22, 27, 45, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3
            className="text-sm font-semibold text-white mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Progress Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#3D4A63', fontSize: 11, fontFamily: 'DM Sans' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#3D4A63', fontSize: 11 }}
                domain={[0, 100]}
                tickCount={5}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="#0891b2"
                strokeWidth={2}
                fill="url(#trendGrad)"
                dot={{ fill: '#111827', r: 4, strokeWidth: 2, stroke: '#0891b2' }}
                activeDot={{ r: 5, fill: '#0891b2', stroke: '#111827', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Goal Distribution — 2/5 = 40% */}
        <motion.div
          variants={item}
          className="lg:col-span-2 rounded-xl p-6 flex flex-col"
          style={{
            background: 'rgba(22, 27, 45, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3
            className="text-sm font-semibold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Goal Distribution
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} itemStyle={{ color: '#E2E8F0' }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with count badges */}
            <div className="w-full flex flex-col gap-2 mt-4">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#8B97B0] min-w-0">
                    <span
                      className="w-2 h-2 rounded-sm shrink-0"
                      style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                    />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <span
                    className="text-[11px] font-semibold text-white bg-white/[0.05] px-2 py-0.5 rounded-md"
                  >
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ 4. BOTTOM — 70/30 Recent Goals + Activity ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Recent Goals — 7/10 = 70% */}
        <motion.div
          variants={item}
          className="lg:col-span-7 rounded-xl overflow-hidden"
          style={{
            background: 'rgba(22, 27, 45, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3
              className="text-sm font-semibold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Recent Goals
            </h3>
            <button
              onClick={() => navigate('/goals')}
              className="text-[12px] text-[#5E6D8C] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {(isManager ? teamGoals : myGoals).slice(0, 5).map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate mb-1.5">
                    {goal.title}
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <CategoryPill name={goal.category} />
                    <StatusPill status={goal.status} />
                  </div>
                </div>
                <div className="w-36 shrink-0">
                  <ColoredProgressBar value={goal.progress} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity — 3/10 = 30%, de-emphasized, no card border */}
        <motion.div variants={item} className="lg:col-span-3">
          <h3
            className="text-sm font-semibold text-[#5E6D8C] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Recent Activity
          </h3>
          <div className="space-y-1">
            {recentNotifs.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 py-3 px-1"
              >
                <ActivityIcon type={n.type} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] text-[#8B97B0] leading-relaxed truncate">
                    {n.message}
                  </div>
                  <div className="text-[10px] text-[#3D4A63] mt-1 font-medium">
                    {timeAgo(n.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ 5. MANAGER: Team Overview ═══ */}
      {isManager && (
        <motion.div
          variants={item}
          className="rounded-xl overflow-hidden"
          style={{
            background: 'rgba(22, 27, 45, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3
              className="text-sm font-semibold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Team Overview
            </h3>
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
                {users
                  .filter((u) => u.managerId === currentUser.id)
                  .map((emp) => {
                    const empGoals = goals.filter(
                      (g) => g.userId === emp.id && g.cycleId === activeCycle?.id
                    );
                    const avg = empGoals.length
                      ? Math.round(empGoals.reduce((s, g) => s + g.progress, 0) / empGoals.length)
                      : 0;
                    const pending = empGoals.filter((g) => g.status === 'pending').length;
                    return (
                      <tr key={emp.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={emp.name} size="sm" />
                            <div>
                              <div className="text-sm font-medium text-white">{emp.name}</div>
                              <div className="text-[11px] text-[#3D4A63]">{emp.title}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="font-medium text-white">{empGoals.length}</span>
                        </td>
                        <td>
                          <div className="w-28">
                            <ColoredProgressBar value={avg} />
                          </div>
                        </td>
                        <td>
                          {pending > 0 ? (
                            <span className="text-amber-400 font-medium">{pending}</span>
                          ) : (
                            <span className="text-[#3D4A63]">—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`text-[11px] font-medium px-2 py-1 rounded-md ${
                              avg >= 60
                                ? 'text-emerald-400 bg-emerald-400/10'
                                : avg >= 30
                                ? 'text-amber-400 bg-amber-400/10'
                                : 'text-red-400 bg-red-400/10'
                            }`}
                          >
                            {avg >= 60 ? 'On Track' : avg >= 30 ? 'Attention' : 'At Risk'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
