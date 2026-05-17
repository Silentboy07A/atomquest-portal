import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Avatar } from '../components/Shared/UIComponents';
import { Target, TrendingUp, Users, AlertTriangle, Lock, CheckCircle, Clock, Activity, ChevronDown, Shield, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { timeAgo } from '../utils/helpers';

const DONUT_COLORS = [
  'var(--color-accent-600)',
  'var(--color-success-500)',
  'var(--color-warning-500)',
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
  'var(--color-danger-500)',
  '#10B981'
];

const TT = {
  background: 'var(--color-dark-800)',
  border: '1px solid var(--color-dark-700)',
  borderRadius: 8,
  color: 'var(--color-dark-100)',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  padding: '6px 10px',
};

function KPI({ label, value, icon: Icon, color, delta }) {
  return (
    <div className="surface-raised p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold text-[var(--color-dark-50)] tracking-tight" style={{ fontFamily:'var(--font-display)' }}>{value}</div>
        <div className="text-[11px] text-[var(--color-dark-300)] font-medium">{label}</div>
      </div>
      {delta !== undefined && (
        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded ${delta >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {delta >= 0 ? '↑' : '↓'}{Math.abs(delta)}%
        </span>
      )}
    </div>
  );
}

function HeatCell({ value, label }) {
  const intensity = Math.min(value / 100, 1);
  // Using explicit rgb values mixed with transparency for the background
  const bg = value >= 75 
    ? `color-mix(in srgb, var(--color-success-500) ${10 + intensity * 25}%, transparent)` 
    : value >= 40 
      ? `color-mix(in srgb, var(--color-warning-500) ${10 + intensity * 20}%, transparent)` 
      : `color-mix(in srgb, var(--color-danger-500) ${10 + intensity * 20}%, transparent)`;
  
  const color = value >= 75 ? 'var(--color-success-400)' : value >= 40 ? 'var(--color-warning-400)' : 'var(--color-danger-400)';
  
  return (
    <div className="surface-raised !bg-transparent p-3 text-center cursor-default group relative" style={{ background: bg }}>
      <div className="text-lg font-bold" style={{ color, fontFamily:'var(--font-display)' }}>{value}%</div>
      <div className="text-[10px] text-[var(--color-dark-200)] mt-0.5 truncate">{label}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { currentUser, goals, users, cycles, notifications } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const isAdmin = currentUser.role === 'admin';
  const isManager = currentUser.role === 'manager';
  const [quarter, setQuarter] = useState('Q2');
  const [deptFilter, setDeptFilter] = useState('All');

  const allDepts = useMemo(() => ['All', ...new Set(users.map((u) => u.department))], [users]);

  const relevantGoals = useMemo(() => {
    let g = goals.filter((gl) => gl.cycleId === activeCycle?.id);
    if (!isAdmin && !isManager) g = g.filter((gl) => gl.userId === currentUser.id);
    else if (isManager) {
      const teamIds = users.filter((u) => u.managerId === currentUser.id).map((u) => u.id);
      g = g.filter((gl) => teamIds.includes(gl.userId) || gl.userId === currentUser.id);
    }
    if (deptFilter !== 'All') {
      const deptUserIds = users.filter((u) => u.department === deptFilter).map((u) => u.id);
      g = g.filter((gl) => deptUserIds.includes(gl.userId));
    }
    return g;
  }, [goals, users, currentUser, activeCycle, isAdmin, isManager, deptFilter]);

  const avgProgress = relevantGoals.length ? Math.round(relevantGoals.reduce((s, g) => s + g.progress, 0) / relevantGoals.length) : 0;
  const pendingCount = relevantGoals.filter((g) => g.status === 'pending').length;
  const lockedCount = relevantGoals.filter((g) => g.status === 'approved').length;
  const completedCount = relevantGoals.filter((g) => g.progress >= 100).length;
  const atRiskCount = relevantGoals.filter((g) => g.progress < 30 && g.status === 'approved').length;

  const categoryData = useMemo(() => Object.entries(
    relevantGoals.reduce((a, g) => { a[g.category] = (a[g.category] || 0) + 1; return a; }, {})
  ).map(([name, count]) => ({ name, count })), [relevantGoals]);

  const statusData = useMemo(() => Object.entries(
    relevantGoals.reduce((a, g) => { a[g.status] = (a[g.status] || 0) + 1; return a; }, {})
  ).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count })), [relevantGoals]);

  const trendData = [
    { month: 'Jan', progress: 12 }, { month: 'Feb', progress: 25 },
    { month: 'Mar', progress: 38 }, { month: 'Apr', progress: 48 }, { month: 'May', progress: avgProgress },
  ];

  // Department heatmap
  const deptHeatmap = useMemo(() => {
    const depts = {};
    goals.filter((g) => g.cycleId === activeCycle?.id).forEach((g) => {
      const u = users.find((usr) => usr.id === g.userId);
      if (u) {
        if (!depts[u.department]) depts[u.department] = { total: 0, count: 0 };
        depts[u.department].total += g.progress;
        depts[u.department].count++;
      }
    });
    return Object.entries(depts).map(([dept, d]) => ({ dept, avg: Math.round(d.total / d.count), goals: d.count })).sort((a, b) => b.avg - a.avg);
  }, [goals, users, activeCycle]);

  // Team completion matrix
  const teamMatrix = useMemo(() => {
    return users.filter((u) => u.role === 'employee').map((u) => {
      const ug = goals.filter((g) => g.userId === u.id && g.cycleId === activeCycle?.id);
      const avg = ug.length ? Math.round(ug.reduce((s, g) => s + g.progress, 0) / ug.length) : 0;
      return { user: u, avg, total: ug.length, completed: ug.filter((g) => g.progress >= 100).length };
    }).sort((a, b) => b.avg - a.avg);
  }, [users, goals, activeCycle]);

  const recentActivity = notifications.slice(0, 8);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* ═══ HEADER + FILTERS ═══ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} className="text-[var(--color-accent-500)]" />
            <h2 className="text-[18px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily:'var(--font-display)' }}>
              Organizational Performance Command Center
            </h2>
          </div>
          <p className="text-[12px] text-[var(--color-dark-300)]">{activeCycle?.name} · {relevantGoals.length} goals · Real-time overview</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="input !w-auto !py-1.5 !text-[12px]">
            <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input !w-auto !py-1.5 !text-[12px]">
            {allDepts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* ═══ LIVE KPI COUNTERS ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Pending Approvals" value={pendingCount} icon={Clock} color="var(--color-warning-500)" delta={-12} />
        <KPI label="Locked Goals" value={lockedCount} icon={Lock} color="var(--color-accent-500)" delta={8} />
        <KPI label="Completed Check-ins" value={completedCount} icon={CheckCircle} color="var(--color-success-500)" delta={15} />
        <KPI label="At-Risk Employees" value={atRiskCount} icon={AlertTriangle} color="var(--color-danger-500)" />
      </div>

      {/* ═══ TREND + STATUS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 surface-raised p-5 flex flex-col">
          <h3 className="section-header mb-4">Goal Achievement Trend</h3>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top:5, right:5, left:-25, bottom:0 }}>
                <defs>
                  <linearGradient id="cmdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent-600)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-accent-600)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill:'var(--color-dark-400)', fontSize:11, fontFamily:'var(--font-sans)' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--color-dark-400)', fontSize:10 }} domain={[0,100]} tickCount={5} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="progress" stroke="var(--color-accent-600)" strokeWidth={2} fill="url(#cmdGrad)" dot={{ fill:'var(--color-dark-800)', r:3, strokeWidth:2, stroke:'var(--color-accent-600)' }} activeDot={{ r:4, fill:'var(--color-accent-500)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-raised p-5 flex flex-col">
          <h3 className="section-header mb-3">Status Breakdown</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="count" paddingAngle={2} strokeWidth={0}>
                  {statusData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TT} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1.5 mt-4">
              {statusData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-[var(--color-dark-200)]">
                    <span className="w-2 h-2 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    {d.name}
                  </div>
                  <span className="font-medium text-[var(--color-dark-50)]">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DEPARTMENT HEATMAP ═══ */}
      {(isAdmin || isManager) && (
        <div className="surface-raised p-5">
          <h3 className="section-header mb-4">Department Performance Heatmap</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {deptHeatmap.map((d) => <HeatCell key={d.dept} value={d.avg} label={d.dept} />)}
          </div>
        </div>
      )}

      {/* ═══ TEAM COMPLETION MATRIX + CATEGORY BAR ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Team Matrix */}
        <div className="lg:col-span-3 surface-raised overflow-hidden">
          <div className="px-5 py-3.5" style={{ borderBottom:'1px solid var(--color-dark-700)' }}>
            <h3 className="section-header">Team-wise Completion Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Dept</th><th>Goals</th><th>Done</th><th>Progress</th></tr>
              </thead>
              <tbody>
                {teamMatrix.slice(0, 8).map((r) => (
                  <tr key={r.user.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={r.user.name} size="sm" />
                        <span className="text-[12px] text-[var(--color-dark-50)] font-medium">{r.user.name}</span>
                      </div>
                    </td>
                    <td className="text-[12px] text-[var(--color-dark-300)]">{r.user.department}</td>
                    <td className="text-[12px] text-[var(--color-dark-100)] font-medium tabular-nums">{r.total}</td>
                    <td className="text-[12px] text-[var(--color-success-400)] font-medium tabular-nums">{r.completed}</td>
                    <td className="w-32">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--color-dark-700)] overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{
                            width: `${r.avg}%`,
                            background: r.avg >= 75 ? 'var(--color-success-500)' : r.avg >= 40 ? 'var(--color-warning-500)' : 'var(--color-danger-500)',
                          }} />
                        </div>
                        <span className="text-[11px] font-medium text-[var(--color-dark-200)] w-8 text-right tabular-nums">{r.avg}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="lg:col-span-2 surface-raised p-5 flex flex-col">
          <h3 className="section-header mb-4">By Thrust Area</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top:0, right:10, left:5, bottom:0 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill:'var(--color-dark-400)', fontSize:10 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'var(--color-dark-200)', fontSize:11, fontFamily:'var(--font-sans)' }} width={100} />
                <Tooltip contentStyle={TT} cursor={{ fill:'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="count" fill="var(--color-accent-600)" radius={[0,4,4,0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ═══ LEADERBOARD + ACTIVITY FEED ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Leaderboard */}
        <div className="surface-raised overflow-hidden">
          <div className="px-5 py-3.5" style={{ borderBottom:'1px solid var(--color-dark-700)' }}>
            <h3 className="section-header">Department Leaderboard</h3>
          </div>
          <div className="divide-y divide-[var(--color-dark-700)]">
            {deptHeatmap.map((d, i) => (
              <div key={d.dept} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--color-dark-750)] transition-colors">
                <span className={`text-[13px] font-bold w-5 text-center ${i === 0 ? 'text-[#FBBF24]' : i === 1 ? 'text-[var(--color-dark-200)]' : i === 2 ? 'text-[#CD7F32]' : 'text-[var(--color-dark-400)]'}`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-[var(--color-dark-50)] font-medium">{d.dept}</div>
                  <div className="text-[10px] text-[var(--color-dark-400)]">{d.goals} goals</div>
                </div>
                <div className="w-28 flex items-center gap-2.5">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--color-dark-700)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width:`${d.avg}%`, background: d.avg >= 60 ? 'var(--color-success-500)' : 'var(--color-warning-500)' }} />
                  </div>
                  <span className="text-[11px] font-medium text-[var(--color-dark-100)] w-8 text-right tabular-nums">{d.avg}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="surface-raised overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 flex items-center gap-2 shrink-0" style={{ borderBottom:'1px solid var(--color-dark-700)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="section-header">Live Activity Feed</h3>
          </div>
          <div className="p-4 space-y-0 flex-1 overflow-y-auto max-h-[320px]">
            {recentActivity.map((n, idx) => (
              <div key={n.id} className="flex gap-3 py-2.5 relative">
                {idx < recentActivity.length - 1 && (
                  <div className="absolute left-[9px] top-[30px] w-px h-[calc(100%-12px)] bg-[var(--color-dark-700)]" />
                )}
                <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background:'color-mix(in srgb, var(--color-accent-600) 15%, transparent)' }}>
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

      {/* ═══ RISK ALERTS ═══ */}
      {atRiskCount > 0 && (
        <div className="rounded-xl p-5" style={{ background:'color-mix(in srgb, var(--color-danger-500) 5%, transparent)', border:'1px solid color-mix(in srgb, var(--color-danger-500) 20%, transparent)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-[var(--color-danger-500)]" />
            <h3 className="text-[13px] font-semibold text-[var(--color-danger-400)]" style={{ fontFamily:'var(--font-display)' }}>
              Risk Alerts — Overdue Check-ins
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {relevantGoals.filter((g) => g.progress < 30 && g.status === 'approved').slice(0, 6).map((g) => {
              const owner = users.find((u) => u.id === g.userId);
              return (
                <div key={g.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-900)] border border-[var(--color-dark-700)]">
                  <Avatar name={owner?.name || 'Unknown'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] text-[var(--color-dark-50)] font-medium truncate">{g.title}</div>
                    <div className="text-[10px] text-[var(--color-danger-400)] font-medium">{owner?.name} · {g.progress}% Complete</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
