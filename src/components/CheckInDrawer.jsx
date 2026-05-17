import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

export function CheckInDrawer({ isOpen, onClose, user }) {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const { logAction, currentUser } = useStore();

  React.useEffect(() => {
    if (isOpen) {
      setQ1(''); setQ2(''); setQ3('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!q1.trim() || !q2.trim() || !q3.trim()) {
      toast.error('Please answer all questions');
      return;
    }

    logAction({
      action: 'Check-in Completed',
      details: `Manager ${currentUser.name} completed 1:1 Check-in for ${user.name}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      targetUserId: user.id
    });

    toast.success('Check-in saved successfully', { 
      style: { background: '#0d1117', color: '#fff', border: '1px solid #10b981' } 
    });
    onClose();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 z-40" 
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md shadow-2xl z-50 flex flex-col"
            style={{ background: '#050508', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-dark-700)]">
              <div>
                <h3 className="text-[18px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>1:1 Manager Check-in</h3>
                <p className="text-[13px] text-[var(--color-dark-300)] mt-0.5">With {user.name}</p>
              </div>
              <button onClick={onClose} className="p-2 text-[var(--color-dark-400)] hover:text-[var(--color-dark-50)] hover:bg-[var(--color-dark-800)] rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <label className="label text-[13px] font-semibold text-[var(--color-dark-100)] mb-2 block">1. What went well this quarter?</label>
                <textarea 
                  className="input min-h-[100px] text-[13px]" 
                  value={q1} 
                  onChange={e => setQ1(e.target.value)}
                  placeholder="Discuss achievements, completed goals..."
                />
              </div>
              <div>
                <label className="label text-[13px] font-semibold text-[var(--color-dark-100)] mb-2 block">2. What challenges did you face?</label>
                <textarea 
                  className="input min-h-[100px] text-[13px]" 
                  value={q2} 
                  onChange={e => setQ2(e.target.value)}
                  placeholder="Discuss blockers, difficulties..."
                />
              </div>
              <div>
                <label className="label text-[13px] font-semibold text-[var(--color-dark-100)] mb-2 block">3. Action items for next quarter.</label>
                <textarea 
                  className="input min-h-[100px] text-[13px]" 
                  value={q3} 
                  onChange={e => setQ3(e.target.value)}
                  placeholder="List next steps, training needed..."
                />
              </div>
            </div>

            <div className="p-5 flex justify-end gap-3" style={{ background: '#050508', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-2">
                <Save size={14} /> Submit Check-in
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
