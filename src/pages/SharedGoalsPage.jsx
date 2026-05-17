import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProgressBar, Avatar, EmptyState } from '../components/Shared/UIComponents';
import { Share2, Users, Lock } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

export default function SharedGoalsPage() {
  const { sharedGoals, users, cycles } = useStore();
  const activeCycle = cycles.find((c) => c.isActive);
  const activeShared = sharedGoals.filter((sg) => sg.cycleId === activeCycle?.id);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <h2 className="text-[18px] font-bold text-[var(--color-dark-50)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Shared Goals</h2>
        <p className="text-[12px] text-[var(--color-dark-300)]">{activeCycle?.name} · {activeShared.length} organization-level goals</p>
      </motion.div>

      {activeShared.length === 0 ? (
        <EmptyState icon={Share2} title="No shared goals" description="Organization-level shared goals will appear here." />
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {activeShared.map((sg) => {
            const assignees = sg.assignedTo.map((uid) => users.find((u) => u.id === uid)).filter(Boolean);
            return (
              <motion.div 
                key={sg.id} 
                layout
                className="surface-raised p-5 hover:border-[var(--color-dark-600)] transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Share2 size={16} className="text-[var(--color-accent-400)] shrink-0" />
                      <h3 className="text-[15px] font-bold text-[var(--color-dark-50)] line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>{sg.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-medium text-[var(--color-dark-400)]">
                      <span>{sg.department}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-dark-500)]" />
                      <span>Weight: <strong className="text-[var(--color-dark-200)]">{sg.weightage}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mb-5 flex-1">
                  <div className="flex justify-between text-[11px] font-medium mb-1.5">
                    <span className="text-[var(--color-dark-300)]">Overall Progress</span>
                    <span className="text-[var(--color-dark-50)]">{sg.progress}%</span>
                  </div>
                  <ProgressBar value={sg.progress} size="sm" showLabel={false} />
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color-dark-700)]">
                  {/* Assignees */}
                  <div className="flex items-center gap-2.5">
                    <Users size={14} className="text-[var(--color-dark-400)] shrink-0" />
                    <div className="flex -space-x-2">
                      {assignees.slice(0, 5).map((user) => (
                        <div key={user.id} className="relative" title={user.name}>
                          <Avatar name={user.name} size="sm" className="ring-2 ring-[var(--color-dark-800)]" />
                        </div>
                      ))}
                      {assignees.length > 5 && (
                        <div className="w-7 h-7 rounded-lg bg-[var(--color-dark-700)] flex items-center justify-center text-[10px] font-bold text-[var(--color-dark-50)] ring-2 ring-[var(--color-dark-800)] z-10">
                          +{assignees.length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Locked Fields */}
                  {sg.lockedFields?.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-[var(--color-dark-800)] px-2 py-1 rounded-md border border-[var(--color-dark-700)]">
                      <Lock size={12} className="text-[var(--color-dark-300)]" />
                      <span className="text-[10px] text-[var(--color-dark-100)] font-medium whitespace-nowrap">
                        {sg.lockedFields.length} locked fields
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
