import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Card, StatCard, ProgressBar, Avatar } from '../components/Shared/UIComponents';
import { BarChart3, Target, TrendingUp, Users, Award, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };
const COLORS = ['#185FA5', '#059669', '#6366f1', '#dc2626', '#0891b2', '#a855f7', '#d97706', '#10b981'];

const chartTooltip = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 8,
  color: '#E2E8F0',
  fontSize: 12,
  fontFamily: 'DM Sans',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

export default function AnalyticsPage() {
  const { currentUser, goals, users, cycles } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const isAdmin = currentUser.role === 'admin';
  const isManager = currentUser.role === 'manager';

  const relevantGoals = useMemo(() => {
    if (isAdmin) return goals.filter((g) => g.cycleId === activeCycle?.id);
    if (isManager) {
      const teamIds = users.filter((u) => u.managerId === currentUser.id).map((u) => u.id);
      return goals.filter((g) => (teamIds.includes(g.userId) || g.userId === currentUser.id) && g.cycleId === activeCycle?.id);
    }
    return goals.filter((g) => g.userId === currentUser.id && g.cycleId === activeCycle?.id);
  }, [goals, users, currentUser, activeCycle, isAdmin, isManager]);

  const avgProgress = relevantGoals.length ? Math.round(relevantGoals.reduce((s, g) => s + g.progress, 0) / relevantGoals.length) : 0;
  const approvedGoals = relevantGoals.filter((g) => g.status === 'approved');
  const completedGoals = relevantGoals.filter((g) => g.progress >= 100);
  const atRiskGoals = relevantGoals.filter((g) => g.progress < 30 && g.status === 'approved');

  // Category Distribution
  const categoryData = useMemo(() => {
    return Object.entries(relevantGoals.reduce((acc, g) => { acc[g.category] = (acc[g.category] || 0) + 1; return acc; }, {})).map(([name, count]) => ({ name, count }));
  }, [relevantGoals]);

  // Priority Distribution
  const priorityData = useMemo(() => {
    return Object.entries(relevantGoals.reduce((acc, g) => { acc[g.priority] = (acc[g.priority] || 0) + 1; return acc; }, {})).map(([name, count]) => ({ name, count }));
  }, [relevantGoals]);

  // Status Distribution
  const statusData = useMemo(() => {
    return Object.entries(relevantGoals.reduce((acc, g) => { acc[g.status] = (acc[g.status] || 0) + 1; return acc; }, {})).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }));
  }, [relevantGoals]);

  // Progress by Category (Radar)
  const radarData = useMemo(() => {
    const cats = {};
    relevantGoals.forEach((g) => {
      if (!cats[g.category]) cats[g.category] = { total: 0, count: 0 };
      cats[g.category].total += g.progress;
      cats[g.category].count++;
    });
    return Object.entries(cats).map(([cat, data]) => ({
      category: cat.length > 10 ? cat.slice(0, 10) + '…' : cat,
      progress: Math.round(data.total / data.count),
    }));
  }, [relevantGoals]);

  // Department Leaderboard
  const leaderboard = useMemo(() => {
    if (!isAdmin && !isManager) return [];
    const depts = {};
    relevantGoals.forEach((g) => {
      const user = users.find((u) => u.id === g.userId);
      if (user) {
        if (!depts[user.department]) depts[user.department] = { total: 0, count: 0, goals: 0 };
        depts[user.department].total += g.progress;
        depts[user.department].count++;
        depts[user.department].goals++;
      }
    });
    return Object.entries(depts).map(([dept, data]) => ({
      department: dept,
      avg: Math.round(data.total / data.count),
      goals: data.goals,
    })).sort((a, b) => b.avg - a.avg);
  }, [relevantGoals, users, isAdmin, isManager]);

  // Top Performers
  const topPerformers = useMemo(() => {
    const userMap = {};
    relevantGoals.forEach((g) => {
      if (!userMap[g.userId]) userMap[g.userId] = { total: 0, count: 0 };
      userMap[g.userId].total += g.progress;
      userMap[g.userId].count++;
    });
    return Object.entries(userMap)
      .map(([userId, data]) => ({
        user: users.find((u) => u.id === userId),
        avg: Math.round(data.total / data.count),
        goals: data.count,
      }))
      .filter((p) => p.user)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [relevantGoals, users]);

  // Monthly Progress Trend
  const trendData = [
    { month: 'Jan', progress: 12 }, { month: 'Feb', progress: 25 }, { month: 'Mar', progress: 38 },
    { month: 'Apr', progress: 48 }, { month: 'May', progress: avgProgress },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Analytics Overview</h2>
        <p className="text-sm text-[var(--color-dark-300)]">{activeCycle?.name} · {relevantGoals.length} goals tracked</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Goals" value={relevantGoals.length} icon={Target} color="#185FA5" />
        <StatCard title="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} color="#059669" trend={8} />
        <StatCard title="Completed" value={completedGoals.length} icon={Award} color="#0891b2" />
        <StatCard title="At Risk" value={atRiskGoals.length} icon={Layers} color="#dc2626" />
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Progress Trend */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Progress Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5E6D8C', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5E6D8C', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltip} />
              <Area type="monotone" dataKey="progress" stroke="#2B7FD4" strokeWidth={2} fill="url(#trendGrad)" dot={{ fill: '#111827', r: 4, strokeWidth: 2, stroke: '#2B7FD4' }} activeDot={{ r: 5, fill: '#185FA5' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>By Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#5E6D8C', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8A96B0', fontSize: 11 }} width={120} />
              <Tooltip contentStyle={chartTooltip} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="count" fill="#185FA5" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Status Pie */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="count" paddingAngle={2} strokeWidth={0}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Radar */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Category Performance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#8A96B0', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#5E6D8C', fontSize: 9 }} domain={[0, 100]} />
              <Radar dataKey="progress" stroke="#2B7FD4" fill="#185FA5" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority Distribution */}
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>Priority</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="count" paddingAngle={2} strokeWidth={0}>
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#6366f1" />
                <Cell fill="#5E6D8C" />
              </Pie>
              <Tooltip contentStyle={chartTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Leaderboard + Top Performers */}
      {(isAdmin || isManager) && (
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Department Leaderboard */}
          {leaderboard.length > 0 && (
            <Card hover={false} padding="p-0">
              <div className="p-6 border-b border-white/[0.04]">
                <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Department Performance</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {leaderboard.map((dept, i) => (
                  <div key={dept.department} className="flex items-center gap-4 px-6 py-4">
                    <span className="text-sm font-bold text-[var(--color-dark-400)] w-4" style={{ fontFamily: 'var(--font-display)' }}>{i + 1}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{dept.department}</div>
                      <div className="text-xs text-[var(--color-dark-400)] mt-0.5">{dept.goals} goals</div>
                    </div>
                    <div className="w-28 shrink-0">
                      <ProgressBar value={dept.avg} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Top Performers */}
          <Card hover={false} padding="p-0">
            <div className="p-6 border-b border-white/[0.04]">
              <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Top Performers</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {topPerformers.map((perf, i) => (
                <div key={perf.user.id} className="flex items-center gap-4 px-6 py-4">
                  <span className="text-sm font-bold text-[var(--color-dark-400)] w-4" style={{ fontFamily: 'var(--font-display)' }}>{i + 1}</span>
                  <Avatar name={perf.user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{perf.user.name}</div>
                    <div className="text-xs text-[var(--color-dark-400)] mt-0.5">{perf.user.department}</div>
                  </div>
                  <div className="w-28 shrink-0">
                    <ProgressBar value={perf.avg} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
