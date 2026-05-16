import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Avatar, ProgressBar, StatusBadge, Card, EmptyState } from '../components/Shared/UIComponents';
import { Users, Search, ChevronRight, Target, TrendingUp } from 'lucide-react';
import { getWeightageSummary, getProgressColor } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

export default function TeamPage() {
  const { currentUser, goals, users, cycles } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const isAdmin = currentUser.role === 'admin';
  const isManager = currentUser.role === 'manager';
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  const teamMembers = useMemo(() => {
    let members;
    if (isAdmin) {
      members = users.filter((u) => u.role === 'employee');
    } else if (isManager) {
      members = users.filter((u) => u.managerId === currentUser.id);
    } else {
      members = [];
    }
    if (search) {
      members = members.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase()));
    }
    return members;
  }, [users, currentUser, isAdmin, isManager, search]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {isAdmin ? 'All Employees' : 'Team Overview'}
          </h2>
          <p className="text-sm text-[var(--color-dark-300)]">{teamMembers.length} members · {activeCycle?.name}</p>
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input 
            type="text" 
            placeholder="Search team..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="input pl-9 !bg-[var(--color-dark-800)]" 
          />
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {(() => {
          const allGoals = goals.filter((g) => g.cycleId === activeCycle?.id && teamMembers.some((m) => m.id === g.userId));
          const avgProg = allGoals.length ? Math.round(allGoals.reduce((s, g) => s + g.progress, 0) / allGoals.length) : 0;
          const atRisk = allGoals.filter((g) => g.progress < 30 && g.status === 'approved').length;
          return (
            <>
              <Card hover={false} className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold text-white mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{teamMembers.length}</div>
                <div className="text-[11px] text-[var(--color-dark-300)] font-medium">Team Members</div>
              </Card>
              <Card hover={false} className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold text-white mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{allGoals.length}</div>
                <div className="text-[11px] text-[var(--color-dark-300)] font-medium">Total Goals</div>
              </Card>
              <Card hover={false} className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold mb-1.5" style={{ fontFamily: 'var(--font-display)', color: getProgressColor(avgProg) }}>{avgProg}%</div>
                <div className="text-[11px] text-[var(--color-dark-300)] font-medium">Avg Progress</div>
              </Card>
              <Card hover={false} className="flex flex-col items-center justify-center py-6">
                <div className="text-3xl font-bold mb-1.5" style={{ fontFamily: 'var(--font-display)', color: atRisk > 0 ? '#ef4444' : '#10b981' }}>{atRisk}</div>
                <div className="text-[11px] text-[var(--color-dark-300)] font-medium">At Risk</div>
              </Card>
            </>
          );
        })()}
      </motion.div>

      {/* Team Members List */}
      {teamMembers.length === 0 ? (
        <EmptyState icon={Users} title="No team members" description="No employees match your search criteria." />
      ) : (
        <motion.div variants={item} className="space-y-4">
          {teamMembers.map((member) => {
            const memberGoals = goals.filter((g) => g.userId === member.id && g.cycleId === activeCycle?.id);
            const avg = memberGoals.length ? Math.round(memberGoals.reduce((s, g) => s + g.progress, 0) / memberGoals.length) : 0;
            const ws = getWeightageSummary(memberGoals);
            const pending = memberGoals.filter((g) => g.status === 'pending').length;
            const isExpanded = expandedUser === member.id;

            return (
              <motion.div 
                key={member.id} 
                layout 
                className="bg-[var(--color-dark-800)] border border-white/[0.04] rounded-xl overflow-hidden transition-colors hover:border-white/[0.08]"
              >
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : member.id)}
                  className="w-full px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <Avatar name={member.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white mb-0.5">{member.name}</div>
                    <div className="text-xs text-[var(--color-dark-400)]">{member.title} · {member.department}</div>
                  </div>
                  
                  <div className="flex items-center gap-8 shrink-0">
                    <div className="text-center hide-mobile">
                      <div className="text-sm font-bold text-white mb-0.5">{memberGoals.length}</div>
                      <div className="text-[10px] text-[var(--color-dark-400)] font-medium">Goals</div>
                    </div>
                    
                    <div className="w-32 hide-mobile">
                      <ProgressBar value={avg} size="sm" />
                    </div>
                    
                    <div className="text-center hide-mobile">
                      <div className={`text-sm font-bold mb-0.5 ${ws.isComplete ? 'text-emerald-400' : 'text-[var(--color-accent-300)]'}`}>{ws.total}%</div>
                      <div className="text-[10px] text-[var(--color-dark-400)] font-medium">Weight</div>
                    </div>
                    
                    {pending > 0 && (
                      <span className="text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md shrink-0">
                        {pending} pending
                      </span>
                    )}
                    <ChevronRight size={16} className={`text-[var(--color-dark-400)] transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Expanded Goal List */}
                {isExpanded && memberGoals.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.04] bg-[var(--color-dark-900)]/30"
                  >
                    <div className="divide-y divide-white/[0.04]">
                      {memberGoals.map((goal) => (
                        <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-white/[0.02]">
                          <Target size={15} className="text-[var(--color-dark-400)] shrink-0 hide-mobile" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate mb-1.5">{goal.title}</div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={goal.status} />
                              <span className="text-xs text-[var(--color-dark-400)]">W: {goal.weightage}%</span>
                            </div>
                          </div>
                          <div className="w-full sm:w-32 shrink-0">
                            <ProgressBar value={goal.progress} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
