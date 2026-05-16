import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusConfig, getProgressColor } from '../../utils/helpers';

// ── Status Badge — clean pill ──
export function StatusBadge({ status, size = 'sm' }) {
  const config = getStatusConfig(status);
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide ${sizeClass}`}
      style={{ background: config.bg, color: config.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

// ── Progress Bar — clean, flat ──
export function ProgressBar({ value = 0, size = 'sm', showLabel = true, className = '' }) {
  const h = size === 'lg' ? 'h-2.5' : size === 'md' ? 'h-2' : 'h-1.5';
  const color = getProgressColor(value);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 ${h} rounded-full overflow-hidden`} style={{ background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          className={`${h} rounded-full`}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold min-w-[36px] text-right tabular-nums" style={{ color }}>
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
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };
  const palettes = [
    'from-blue-500/80 to-blue-700/80',
    'from-teal-500/80 to-emerald-600/80',
    'from-indigo-500/80 to-violet-600/80',
    'from-sky-500/80 to-cyan-600/80',
    'from-slate-500/80 to-slate-700/80',
  ];
  const colorIdx = name ? name.charCodeAt(0) % palettes.length : 0;
  return (
    <div
      className={`${sizes[size]} rounded-lg bg-gradient-to-br ${palettes[colorIdx]} flex items-center justify-center font-semibold text-white/90 ${className}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {initials}
    </div>
  );
}

// ── Card — clean elevated surface ──
export function Card({ children, className = '', hover = true, onClick, padding = 'p-6' }) {
  return (
    <motion.div
      className={`glass-card ${padding} ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -1 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// ── Stat Card — enterprise KPI with larger numbers ──
export function StatCard({ title, value, subtitle, icon: Icon, trend, color = '#185FA5' }) {
  return (
    <Card hover={false} className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${color}12` }}
          >
            {Icon && <Icon size={17} style={{ color, opacity: 0.8 }} />}
          </div>
          {trend && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                trend > 0 ? 'text-emerald-400 bg-emerald-400/8' : 'text-red-400 bg-red-400/8'
              }`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div
          className="text-3xl font-bold text-white mb-1.5 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </div>
        <div className="text-[12px] font-medium text-[var(--color-dark-300)]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[11px] text-[var(--color-dark-400)] mt-1">{subtitle}</div>
        )}
      </div>
    </Card>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-dark-400)] hover:text-white hover:bg-white/5 transition-colors"
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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-[var(--color-dark-700)] flex items-center justify-center mb-5">
          <Icon size={24} className="text-[var(--color-dark-400)]" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--color-dark-100)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p className="text-sm text-[var(--color-dark-400)] max-w-xs mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

// ── Priority Badge ──
export function PriorityBadge({ priority }) {
  const colors = {
    Critical: '#ef4444',
    High: '#f59e0b',
    Medium: '#6366f1',
    Low: '#5c5c78',
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
      <Icon size={size === 'sm' ? 16 : 20} />
    </button>
  );
}

// ── Weightage Gauge — clean ring ──
export function WeightageGauge({ total, className = '' }) {
  const isComplete = total === 100;
  const isOver = total > 100;
  const strokeColor = isOver ? '#ef4444' : isComplete ? '#34d399' : '#185FA5';
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={strokeColor} strokeWidth="2.5"
                  strokeDasharray={`${Math.min(total, 100)} ${100 - Math.min(total, 100)}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}>
          {total}
        </span>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-400)] font-medium mb-0.5">
          Weight
        </div>
        <div className={`text-base font-bold ${isComplete ? 'text-emerald-400' : isOver ? 'text-red-400' : 'text-[var(--color-accent-300)]'}`}
             style={{ fontFamily: 'var(--font-display)' }}>
          {total}/100
        </div>
      </div>
    </div>
  );
}
