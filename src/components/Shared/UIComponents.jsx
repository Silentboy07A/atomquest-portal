import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusConfig, getProgressColor } from '../../utils/helpers';

// ── Status Badge — clean pill ──
export function StatusBadge({ status, size = 'sm' }) {
  const config = getStatusConfig(status);
  return (
    <span
      className="inline-flex items-center justify-center rounded-[12px] uppercase font-[600] tracking-[0.05em]"
      style={{
        background: config.bg || 'transparent',
        border: `1px solid ${config.border || config.color}`,
        color: config.color,
        padding: '2px 8px',
        fontSize: '10px',
      }}
    >
      {config.label}
    </span>
  );
}

// ── Progress Bar — clean, flat ──
export function ProgressBar({ value = 0, size = 'sm', showLabel = true, className = '' }) {
  const color = getProgressColor(value);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 h-[6px] rounded-full overflow-hidden`} style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold min-w-[36px] text-right tabular-nums" style={{ color }}>
          {value}%
        </span>
      )}
    </div>
  );
}

// ── Avatar — subtle gradient palette ──
export function Avatar({ name, size = 'md', className = '' }) {
  const initials = name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-[12px]',
    lg: 'w-12 h-12 text-[14px]',
    xl: 'w-16 h-16 text-[16px]',
  };
  const palettes = [
    'from-[var(--color-accent-600)] to-[var(--color-accent-700)]',
    'from-emerald-600 to-emerald-700',
    'from-violet-600 to-violet-700',
    'from-cyan-600 to-cyan-700',
    'from-slate-600 to-slate-700',
  ];
  const colorIdx = name ? name.charCodeAt(0) % palettes.length : 0;
  return (
    <div
      className={`${sizes[size]} rounded-lg bg-gradient-to-br ${palettes[colorIdx]} flex items-center justify-center font-semibold text-white ${className}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {initials}
    </div>
  );
}

// ── Card — clean elevated surface ──
export function Card({ children, className = '', hover = true, onClick, padding = 'p-[24px]' }) {
  return (
    <motion.div
      className={`bg-[#0d1117] border border-[rgba(255,255,255,0.06)] rounded-[10px] ${padding} ${hover ? 'cursor-pointer hover:border-[rgba(255,255,255,0.1)] transition-colors duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ── Stat Card — enterprise KPI with larger numbers ──
export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'var(--color-accent-600)' }) {
  return (
    <div className="flex-1 h-[96px] bg-[#0d1117] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-colors duration-200 rounded-[10px] relative overflow-hidden flex flex-col justify-center px-[24px] py-[20px]">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between w-full relative z-10">
        <div className="flex flex-col">
          <div className="text-[11px] uppercase text-[#64748b] tracking-wider font-semibold mb-1">
            {title}
          </div>
          <div className="text-[28px] font-bold text-[#f1f5f9] leading-none animate-count" style={{ fontFamily: 'var(--font-display)' }}>
            {value}
          </div>
          {subtitle && (
            <div className="text-[11px] text-[#334155] mt-1 font-medium">{subtitle}</div>
          )}
        </div>
        <div className="flex flex-col items-end justify-between h-full">
          {Icon && <Icon size={20} style={{ color, opacity: 0.8 }} className="mb-2" />}
          {trend && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-auto ${
                trend > 0 ? 'text-[#10b981] bg-[rgba(16,185,129,0.1)]' : 'text-[#ef4444] bg-[rgba(239,68,68,0.1)]'
              }`}
            >
              {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal — clean overlay ──
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`modal-content ${widths[size]}`}
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-bold text-[var(--color-dark-50)]" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--color-dark-400)] hover:text-[var(--color-dark-50)] hover:bg-[var(--color-dark-700)] transition-colors"
              >
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Empty State ──
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[var(--color-dark-800)] border border-[var(--color-dark-700)] flex items-center justify-center mb-4">
          <Icon size={20} className="text-[var(--color-dark-300)]" />
        </div>
      )}
      <h3 className="text-[14px] font-semibold text-[var(--color-dark-50)] mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p className="text-[12px] text-[var(--color-dark-400)] max-w-xs mb-5 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

// ── Priority Badge ──
export function PriorityBadge({ priority }) {
  const colors = {
    Critical: 'var(--color-danger-400)',
    High: 'var(--color-warning-400)',
    Medium: 'var(--color-accent-400)',
    Low: 'var(--color-dark-300)',
  };
  const c = colors[priority] || colors.Low;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: c }}>
      <span className="w-1.5 h-1.5 rounded-sm" style={{ background: c }} />
      {priority}
    </span>
  );
}

// ── Icon Button ──
export function IconButton({ icon: Icon, onClick, tooltip, variant = 'ghost', size = 'sm', className = '' }) {
  return (
    <button onClick={onClick} className={`btn btn-${variant} btn-icon tooltip ${className}`} data-tooltip={tooltip} title={tooltip}>
      <Icon size={size === 'sm' ? 14 : 18} />
    </button>
  );
}

// ── Weightage Gauge — clean ring ──
export function WeightageGauge({ total, className = '' }) {
  const isComplete = total === 100;
  const isOver = total > 100;
  const strokeColor = isOver ? 'var(--color-danger-500)' : isComplete ? 'var(--color-success-500)' : 'var(--color-accent-600)';
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-dark-700)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={strokeColor} strokeWidth="3"
                  strokeDasharray={`${Math.min(total, 100)} ${100 - Math.min(total, 100)}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[var(--color-dark-50)]"
              style={{ fontFamily: 'var(--font-display)' }}>
          {total}
        </span>
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--color-dark-400)] font-medium mb-0.5">
          Weight
        </div>
        <div className={`text-[13px] font-bold ${isComplete ? 'text-[var(--color-success-400)]' : isOver ? 'text-[var(--color-danger-400)]' : 'text-[var(--color-accent-400)]'}`}
             style={{ fontFamily: 'var(--font-display)' }}>
          {total}/100
        </div>
      </div>
    </div>
  );
}
