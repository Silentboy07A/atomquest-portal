import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Avatar, ProgressBar, StatusBadge, Card, EmptyState } from '../components/Shared/UIComponents';
import { Users, Search, ChevronRight, Target, Sparkles, Bot, X } from 'lucide-react';
import toast from 'react-hot-toast';
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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-7xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-dark-50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {isAdmin ? 'All Employees' : 'Team Overview'}
          </h2>
          <p className="text-[12px] text-[var(--color-dark-300)]">{teamMembers.length} members · {activeCycle?.name}</p>
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-400)]" />
          <input 
            type="text" 
            placeholder="Search team..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="input pl-9" 
          />
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {(() => {
          const allGoals = goals.filter((g) => g.cycleId === activeCycle?.id && teamMembers.some((m) => m.id === g.userId));
          const avgProg = allGoals.length ? Math.round(allGoals.reduce((s, g) => s + g.progress, 0) / allGoals.length) : 0;
          const atRisk = allGoals.filter((g) => g.progress < 30 && g.status === 'approved').length;
          return (
            <>
              <Card hover={false} className="flex flex-col items-center justify-center py-5">
                <div className="text-[20px] font-bold text-[var(--color-dark-50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{teamMembers.length}</div>
                <div className="text-[10px] text-[var(--color-dark-400)] font-medium uppercase tracking-wider">Team Members</div>
              </Card>
              <Card hover={false} className="flex flex-col items-center justify-center py-5">
                <div className="text-[20px] font-bold text-[var(--color-dark-50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{allGoals.length}</div>
                <div className="text-[10px] text-[var(--color-dark-400)] font-medium uppercase tracking-wider">Total Goals</div>
              </Card>
              <Card hover={false} className="flex flex-col items-center justify-center py-5">
                <div className="text-[20px] font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: getProgressColor(avgProg) }}>{avgProg}%</div>
                <div className="text-[10px] text-[var(--color-dark-400)] font-medium uppercase tracking-wider">Avg Progress</div>
              </Card>
              <Card hover={false} className="flex flex-col items-center justify-center py-5">
                <div className="text-[20px] font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: atRisk > 0 ? 'var(--color-danger-500)' : 'var(--color-success-500)' }}>{atRisk}</div>
                <div className="text-[10px] text-[var(--color-dark-400)] font-medium uppercase tracking-wider">At Risk</div>
              </Card>
            </>
          );
        })()}
      </motion.div>

      {/* Team Members List */}
      {teamMembers.length === 0 ? (
        <EmptyState icon={Users} title="No team members" description="No employees match your search criteria." />
      ) : (
        <motion.div variants={item} className="space-y-3">
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
                className="surface-raised overflow-hidden transition-colors hover:border-[var(--color-dark-600)]"
              >
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : member.id)}
                  className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[var(--color-dark-900)] transition-colors text-left"
                >
                  <Avatar name={member.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--color-dark-50)] mb-0.5">{member.name}</div>
                    <div className="text-[11px] text-[var(--color-dark-400)]">{member.title} · {member.department}</div>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center hide-mobile">
                      <div className="text-[13px] font-bold text-[var(--color-dark-50)] mb-0.5">{memberGoals.length}</div>
                      <div className="text-[9px] text-[var(--color-dark-400)] uppercase tracking-wider font-medium">Goals</div>
                    </div>
                    
                    <div className="w-24 hide-mobile">
                      <ProgressBar value={avg} size="sm" />
                    </div>
                    
                    <div className="text-center hide-mobile">
                      <div className={`text-[13px] font-bold mb-0.5 ${ws.isComplete ? 'text-[var(--color-success-500)]' : 'text-[var(--color-warning-400)]'}`}>{ws.total}%</div>
                      <div className="text-[9px] text-[var(--color-dark-400)] uppercase tracking-wider font-medium">Weight</div>
                    </div>
                    
                    {pending > 0 && (
                      <span className="text-[10px] font-medium text-[var(--color-warning-500)] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md shrink-0">
                        {pending} pending
                      </span>
                    )}
                    <ChevronRight size={14} className={`text-[var(--color-dark-400)] transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Expanded Goal List */}
                {isExpanded && memberGoals.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[var(--color-dark-700)] bg-[var(--color-dark-950)]"
                  >
                    <div className="divide-y divide-[var(--color-dark-700)]">
                      {memberGoals.map((goal) => (
                        <div key={goal.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-3 hover:bg-[var(--color-dark-800)] transition-colors">
                          <Target size={14} className="text-[var(--color-dark-500)] shrink-0 hide-mobile" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium text-[var(--color-dark-50)] truncate mb-1.5">{goal.title}</div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={goal.status} />
                              <span className="text-[11px] text-[var(--color-dark-400)]">W: {goal.weightage}%</span>
                            </div>
                          </div>
                          <div className="w-full sm:w-28 shrink-0">
                            <ProgressBar value={goal.progress} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {(isAdmin || isManager) && (
                      <AIReviewGenerator member={member} goals={memberGoals} avgProg={avg} />
                    )}
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

function AIReviewGenerator({ member, goals, avgProg }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [review, setReview] = useState(null);

  const generateReview = async () => {
    setIsGenerating(true);
    try {
      const goalsText = goals.map(g => `- ${g.title} (Progress: ${g.progress}%, Weight: ${g.weightage}%, Status: ${g.status})`).join('\\n');
      const prompt = `Generate a 3-paragraph professional quarterly performance review for ${member.name} (${member.title} in ${member.department}).
Average Goal Progress: ${avgProg}%
Goals:
${goalsText}

Format the review as plain text with 3 paragraphs: 
1. Overall summary of their progress.
2. Specific highlights based on their goals.
3. Constructive feedback and next steps.`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an expert HR manager writing constructive, professional quarterly performance reviews.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      const data = await res.json();
      setReview(data.choices[0].message.content);
    } catch (err) {
      toast.error('Failed to generate review. Check API key.', { style: { background: '#0d1117', color: '#fff', border: '1px solid rgba(239,68,68,0.5)' } });
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-5 py-4 bg-[var(--color-dark-900)] border-t border-[var(--color-dark-700)]">
       {!review && !isGenerating && (
         <button onClick={generateReview} className="w-full py-2.5 rounded-lg border border-[var(--color-accent-500)]/30 text-[var(--color-accent-400)] hover:bg-[var(--color-accent-500)] hover:text-white transition-colors flex items-center justify-center gap-2 text-[13px] font-semibold">
            <Sparkles size={14} /> Generate AI Performance Review
         </button>
       )}
       {isGenerating && (
         <div className="p-4 rounded-xl border border-[var(--color-accent-500)]/30 bg-[var(--color-accent-500)]/5 animate-pulse flex flex-col gap-2 text-center">
            <span className="text-[12px] font-medium text-[var(--color-accent-400)] flex items-center justify-center gap-2">
               <Bot size={14} className="animate-bounce" /> Analyzing performance data...
            </span>
            <div className="h-3 bg-[var(--color-dark-700)] rounded w-full"></div>
            <div className="h-3 bg-[var(--color-dark-700)] rounded w-5/6 mx-auto"></div>
         </div>
       )}
       {review && !isGenerating && (
         <div className="p-5 rounded-xl border border-[var(--color-accent-500)]/50 bg-[var(--color-dark-950)] relative shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <button onClick={() => setReview(null)} className="absolute top-3 right-3 text-[var(--color-dark-400)] hover:text-[var(--color-dark-100)]"><X size={14} /></button>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-dark-800)]">
               <Sparkles size={14} className="text-[var(--color-accent-400)]" />
               <span className="text-[12px] font-bold text-[var(--color-accent-400)] uppercase tracking-wider">AI Generated Quarterly Review</span>
            </div>
            <div className="text-[13px] text-[var(--color-dark-200)] leading-relaxed space-y-4 whitespace-pre-wrap">
               {review}
            </div>
         </div>
       )}
    </div>
  );
}
