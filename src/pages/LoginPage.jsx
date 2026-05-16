import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Mail, Lock, LogIn, User, Shield, Users, Zap } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { label: 'Employee', sublabel: 'Arjun Mehta', userId: 'u1', icon: User, color: '#0891b2', gradient: 'from-cyan-500/20 to-teal-600/20' },
  { label: 'Manager (L1)', sublabel: 'Sneha Patel', userId: 'u4', icon: Users, color: '#185FA5', gradient: 'from-blue-500/20 to-indigo-600/20' },
  { label: 'Admin / HR', sublabel: 'Ananya Reddy', userId: 'u6', icon: Shield, color: '#8b5cf6', gradient: 'from-violet-500/20 to-purple-600/20' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function LoginPage({ onLogin }) {
  const { setCurrentUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleDemoLogin = (userId) => {
    setCurrentUser(userId);
    onLogin();
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    setCurrentUser('u1');
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#0a0e1a' }}>
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary glow */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          left: '50%', top: '30%', transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(8,145,178,0.07) 0%, transparent 70%)',
        }} />
        {/* Secondary glow */}
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          left: '30%', top: '60%', transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(24,95,165,0.05) 0%, transparent 70%)',
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[420px]"
      >
        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(15,20,35,0.95) 0%, rgba(12,16,28,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.02), 0 20px 50px rgba(0,0,0,0.4), 0 0 100px rgba(8,145,178,0.04)',
          }}
        >
          {/* Top accent line */}
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #0891b2, #185FA5, transparent)' }} />
          
          <div className="p-8 pt-7">
            {/* Logo */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm relative"
                  style={{
                    background: 'linear-gradient(135deg, #0f6e85, #185FA5)',
                    fontFamily: 'var(--font-display)',
                    boxShadow: '0 4px 16px rgba(8,145,178,0.25)',
                  }}
                >
                  AQ
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
                </div>
                <div>
                  <span
                    className="text-[22px] font-bold text-white block leading-tight"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
                  >
                    AtomQuest
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-[#4A5568] font-medium">
                Performance Tracking Portal
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              onSubmit={handleFormLogin}
              className="space-y-3 mb-6"
            >
              <div className="relative group">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D3A4F] group-focus-within:text-[#0891b2] transition-colors" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d1219] text-white text-[13px] placeholder-[#2D3A4F] pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-[#0891b2]/30"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D3A4F] group-focus-within:text-[#0891b2] transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d1219] text-white text-[13px] placeholder-[#2D3A4F] pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-[#0891b2]/30"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 mt-1"
                style={{
                  background: 'linear-gradient(135deg, #0c7085, #185FA5)',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 16px rgba(8,145,178,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <LogIn size={15} />
                Sign In
              </motion.button>
            </motion.form>

            {/* Divider */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex items-center gap-4 mb-6"
            >
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
              <div className="flex items-center gap-2">
                <Zap size={10} className="text-[#2D3A4F]" />
                <span className="text-[10px] text-[#2D3A4F] font-semibold tracking-[0.1em] uppercase">
                  Quick Demo
                </span>
                <Zap size={10} className="text-[#2D3A4F]" />
              </div>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
            </motion.div>

            {/* Demo Role Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map((account, idx) => (
                <motion.button
                  key={account.userId}
                  custom={3 + idx}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  onClick={() => handleDemoLogin(account.userId)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => setHoveredCard(account.userId)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative flex flex-col items-center gap-2.5 py-5 px-2 rounded-xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: hoveredCard === account.userId ? `${account.color}08` : 'rgba(255,255,255,0.015)',
                    border: hoveredCard === account.userId
                      ? `1px solid ${account.color}30`
                      : '1px solid rgba(255,255,255,0.04)',
                    boxShadow: hoveredCard === account.userId
                      ? `0 8px 24px ${account.color}10, 0 0 0 1px ${account.color}08`
                      : 'none',
                  }}
                >
                  {/* Glow on hover */}
                  {hoveredCard === account.userId && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${account.color}08 0%, transparent 70%)`,
                      }}
                    />
                  )}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center relative z-10"
                    style={{
                      background: `${account.color}12`,
                      border: `1px solid ${account.color}18`,
                    }}
                  >
                    <account.icon size={18} style={{ color: account.color }} />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-[12px] font-semibold text-white mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                      {account.label}
                    </div>
                    <div className="text-[10px] text-[#3D4A63] font-medium">{account.sublabel}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center mt-6 flex items-center justify-center gap-2"
        >
          <div className="w-1 h-1 rounded-full bg-[#1a2030]" />
          <span className="text-[10px] text-[#1e2538] font-semibold tracking-[0.15em] uppercase">
            AtomQuest Hackathon 1.0
          </span>
          <div className="w-1 h-1 rounded-full bg-[#1a2030]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
