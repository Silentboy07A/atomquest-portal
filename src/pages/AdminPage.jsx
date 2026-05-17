import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Avatar, Modal, Card } from '../components/Shared/UIComponents';
import { Shield, Users, Calendar, Plus, Edit3, Power, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } };

export default function AdminPage() {
  const { users, cycles, goals } = useStore();
  const [activeTab, setActiveTab] = useState('cycles');
  const [cycleModal, setCycleModal] = useState(false);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-6 max-w-7xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#f1f5f9]" style={{ fontFamily: 'var(--font-display)' }}>Admin Panel</h2>
          <p className="text-[13px] text-[#64748b] mt-1">Manage cycles, users, and system settings</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="surface-raised p-2 flex gap-1 overflow-x-auto w-full md:w-auto self-start">
        {[
          { id: 'cycles', label: 'Cycles', icon: Calendar },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'system', label: 'System', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-[var(--color-dark-700)] text-[var(--color-dark-50)]' 
                : 'text-[var(--color-dark-300)] hover:text-[var(--color-dark-100)] hover:bg-[var(--color-dark-800)]'
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? 'text-[var(--color-accent-400)]' : 'opacity-70'} /> 
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Cycles Tab */}
      {activeTab === 'cycles' && (
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-dark-700)] pb-4">
            <h3 className="text-[16px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>Performance Cycles</h3>
            <button onClick={() => setCycleModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> New Cycle</button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {cycles.map((cycle) => {
              const cycleGoals = goals.filter((g) => g.cycleId === cycle.id);
              const avgProg = cycleGoals.length ? Math.round(cycleGoals.reduce((s, g) => s + g.progress, 0) / cycleGoals.length) : 0;
              return (
                <div key={cycle.id} className="surface-raised p-5 hover:border-[var(--color-dark-600)] transition-colors flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[15px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>{cycle.name}</span>
                      {cycle.isActive && (
                        <span className="text-[10px] font-semibold text-[var(--color-success-400)] bg-[var(--color-dark-800)] px-2 py-0.5 rounded-md flex items-center gap-1.5 border border-[var(--color-dark-700)]">
                          <Power size={10} /> Active
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                        cycle.status === 'completed' ? 'text-[var(--color-dark-300)] bg-[var(--color-dark-800)] border-[var(--color-dark-700)]' :
                        cycle.status === 'upcoming' ? 'text-[var(--color-accent-400)] bg-[var(--color-dark-800)] border-[var(--color-dark-700)]' :
                        'text-[var(--color-success-400)] bg-[var(--color-dark-800)] border-[var(--color-dark-700)]'
                      }`}>
                        {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-medium text-[var(--color-dark-400)] flex-wrap">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="opacity-70" /> {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}</span>
                      <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[var(--color-dark-500)]" /> {cycleGoals.length} goals</span>
                      <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[var(--color-dark-500)]" /> Avg: <strong className="text-[var(--color-dark-200)]">{avgProg}%</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="btn btn-secondary btn-sm btn-icon" title="Edit"><Edit3 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-dark-700)] pb-4">
            <h3 className="text-[16px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>All Users ({users.length})</h3>
          </div>
          <Card hover={false} padding="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Manager</th>
                    <th>Goals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-dark-700)]">
                  {users.map((user) => {
                    const manager = users.find((u) => u.id === user.managerId);
                    const userGoals = goals.filter((g) => g.userId === user.id);
                    return (
                      <tr key={user.id} className="hover:bg-[var(--color-dark-900)] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} size="sm" />
                            <div>
                              <div className="text-[13px] font-semibold text-[var(--color-dark-50)] mb-0.5">{user.name}</div>
                              <div className="text-[11px] text-[var(--color-dark-400)]">{user.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[11px] text-[var(--color-dark-200)]" style={{ fontFamily: 'var(--font-mono)' }}>{user.email}</td>
                        <td className="p-4">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            user.role === 'admin' ? 'text-[var(--color-accent-400)] bg-[var(--color-dark-800)] border-[var(--color-dark-700)]' :
                            user.role === 'manager' ? 'text-[var(--color-warning-400)] bg-[var(--color-dark-800)] border-[var(--color-dark-700)]' :
                            'text-[var(--color-dark-300)] bg-[var(--color-dark-800)] border-[var(--color-dark-700)]'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-[12px] text-[var(--color-dark-100)]">{user.department}</td>
                        <td className="p-4 text-[12px] text-[var(--color-dark-300)]">{manager?.name || '—'}</td>
                        <td className="p-4"><span className="font-bold text-[var(--color-dark-50)] bg-[var(--color-dark-800)] border border-[var(--color-dark-700)] px-2 py-0.5 rounded-md text-[11px]">{userGoals.length}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <motion.div variants={item} className="space-y-5">
          <h3 className="text-[16px] font-bold text-[var(--color-dark-50)] border-b border-[var(--color-dark-700)] pb-4" style={{ fontFamily: 'var(--font-display)' }}>System Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover={false} padding="p-5">
              <h4 className="text-[10px] font-bold text-[var(--color-dark-400)] uppercase tracking-wider mb-5 flex items-center gap-2">
                <Shield size={14} className="text-[var(--color-accent-500)]" />
                Goal Constraints
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Max goals per cycle', value: '8' },
                  { label: 'Min weightage per goal', value: '10%' },
                  { label: 'Total weightage per cycle', value: '100%' },
                  { label: 'Title min length', value: '5 chars' },
                  { label: 'Title max length', value: '120 chars' },
                  { label: 'Description min length', value: '10 chars' },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between pb-3 border-b border-[var(--color-dark-700)] last:border-0 last:pb-0">
                    <span className="text-[12px] font-medium text-[var(--color-dark-200)]">{rule.label}</span>
                    <span className="text-[11px] font-bold text-[var(--color-dark-50)] bg-[var(--color-dark-800)] border border-[var(--color-dark-700)] px-2 py-0.5 rounded-md" style={{ fontFamily: 'var(--font-mono)' }}>{rule.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card hover={false} padding="p-5">
              <h4 className="text-[10px] font-bold text-[var(--color-dark-400)] uppercase tracking-wider mb-5 flex items-center gap-2">
                <AlertTriangle size={14} className="text-[var(--color-warning-500)]" />
                Goal Locking Rules
              </h4>
              <div className="space-y-3">
                <div className="bg-[var(--color-dark-900)] p-4 rounded-xl border border-[var(--color-dark-700)]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle size={14} className="text-[var(--color-warning-400)]" />
                    <span className="text-[13px] font-bold text-[var(--color-dark-50)]">Post-Approval Lock</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-dark-300)] leading-relaxed">
                    Goals are locked from editing after manager approval. Only progress updates are allowed on approved goals. Employees must resubmit if rejected.
                  </p>
                </div>
                <div className="bg-[var(--color-dark-900)] p-4 rounded-xl border border-[var(--color-dark-700)]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield size={14} className="text-[var(--color-accent-400)]" />
                    <span className="text-[13px] font-bold text-[var(--color-dark-50)]">Weightage Enforcement</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-dark-300)] leading-relaxed">
                    Total goal weightage must equal exactly 100%. Minimum 10% per goal. Maximum 8 goals per employee per cycle. Validated client-side and server-side.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Create Cycle Modal */}
      <Modal isOpen={cycleModal} onClose={() => setCycleModal(false)} title="Create New Cycle" size="md">
        <CycleForm onClose={() => setCycleModal(false)} />
      </Modal>
    </motion.div>
  );
}

function CycleForm({ onClose }) {
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.name || !form.startDate || !form.endDate) {
      setError('All fields are required');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError('End date must be after start date');
      return;
    }
    onClose();
  };

  return (
    <div className="space-y-4">
      {error && <div className="p-3 rounded-lg bg-[var(--color-danger-500)]/10 border border-[var(--color-danger-500)]/20 text-[var(--color-danger-400)] text-[12px] font-medium">{error}</div>}
      <div>
        <label className="label">Cycle Name</label>
        <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., FY27 Q1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Start Date</label>
          <input type="date" className="input" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div>
          <label className="label">End Date</label>
          <input type="date" className="input" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-dark-700)] mt-2">
        <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        <button onClick={handleSubmit} className="btn btn-primary">Create Cycle</button>
      </div>
    </div>
  );
}
