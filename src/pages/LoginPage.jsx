import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Mail, Lock, LogIn, User, Shield, Users } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { label: 'Employee', sublabel: 'Arjun Mehta', userId: 'u1', icon: User, color: '#0891b2' },
  { label: 'Manager (L1)', sublabel: 'Sneha Patel', userId: 'u4', icon: Users, color: '#185FA5' },
  { label: 'Admin / HR', sublabel: 'Ananya Reddy', userId: 'u6', icon: Shield, color: '#6366f1' },
];

export default function LoginPage({ onLogin }) {
  const { setCurrentUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoLogin = (userId) => {
    setCurrentUser(userId);
    onLogin();
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    // For demo, default to employee
    setCurrentUser('u1');
    onLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0d1117' }}
    >
      {/* Subtle radial gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(24,95,165,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(22, 27, 45, 0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                style={{
                  background: 'linear-gradient(135deg, #185FA5, #0891b2)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                AQ
              </div>
              <div>
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                >
                  AtomQuest
                </span>
              </div>
            </div>
            <p className="text-sm text-[#5E6D8C]">
              Performance Tracking Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormLogin} className="space-y-4 mb-6">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D4A63]" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d1117] text-white text-sm placeholder-[#3D4A63] pl-11 pr-4 py-3 rounded-xl outline-none transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(24,95,165,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D4A63]" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d1117] text-white text-sm placeholder-[#3D4A63] pl-11 pr-4 py-3 rounded-xl outline-none transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(24,95,165,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #185FA5, #0891b2)',
                fontFamily: 'var(--font-display)',
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              <LogIn size={16} />
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-[#3D4A63] font-medium tracking-wide">
              or continue as
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo Role Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {DEMO_ACCOUNTS.map((account) => (
              <motion.button
                key={account.userId}
                onClick={() => handleDemoLogin(account.userId)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all duration-200 group"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${account.color}40`;
                  e.currentTarget.style.background = `${account.color}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${account.color}15` }}
                >
                  <account.icon size={17} style={{ color: account.color }} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-white mb-0.5">{account.label}</div>
                  <div className="text-[10px] text-[#3D4A63]">{account.sublabel}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-[11px] text-[#2D3548] font-medium tracking-wide">
            AtomQuest Hackathon 1.0
          </span>
        </div>
      </motion.div>
    </div>
  );
}
