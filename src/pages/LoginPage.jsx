import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const { setCurrentUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const credentialsMap = {
    'employee@atomquest.com': 'u1',
    'manager@atomquest.com': 'u4',
    'admin@atomquest.com': 'u6'
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const userId = credentialsMap[email] || 'u1';
      setCurrentUser(userId);
      onLogin();
    }, 800);
  };

  const autoFillAndLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentUser(credentialsMap[roleEmail]);
      onLogin();
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[var(--color-dark-950)]">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[80px] opacity-[0.12] mesh-blob-1" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[80px] opacity-[0.12] mesh-blob-2" />
      </div>

      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none login-grid" />

      {/* Floating Card */}
      <div className="relative w-full max-w-[400px] rounded-[16px] p-[48px] z-10 animate-fade-in-up" style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 40px rgba(13,148,136,0.08), 0 25px 50px rgba(0,0,0,0.5)'
      }}>
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-[32px]">
          <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #0d9488, #4f46e5)' }}>
            <span className="text-white font-bold text-2xl tracking-tight">AQ</span>
          </div>
          <h1 className="text-[var(--color-dark-50)] font-bold tracking-tight mt-[16px]" style={{ fontSize: '26px' }}>AtomQuest</h1>
          <p className="text-[var(--color-dark-300)] font-semibold tracking-[0.15em] uppercase mt-[4px]" style={{ fontSize: '11px' }}>Performance Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-[16px]">
          <div>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-dark-800)] border rounded-[8px] px-[16px] py-[12px] text-[13px] text-[var(--color-dark-50)] placeholder-[var(--color-dark-400)] outline-none transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              onFocus={(e) => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-dark-800)] border rounded-[8px] px-[16px] py-[12px] pr-10 text-[13px] text-[var(--color-dark-50)] placeholder-[var(--color-dark-400)] outline-none transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              onFocus={(e) => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-dark-300)] hover:text-[var(--color-dark-50)] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="flex justify-end mt-[-8px]">
            <a href="#" className="text-[12px] text-[var(--color-dark-300)] hover:text-[var(--color-accent-600)] transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative w-full py-[12px] rounded-[8px] text-[14px] font-[600] text-white shadow-lg overflow-hidden disabled:opacity-70 mt-2 hover:brightness-110 transition-all duration-150 animate-shimmer"
            style={{ background: 'linear-gradient(135deg, #0d9488, #4f46e5)' }}
          >
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
            </div>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-[28px] text-[12px] text-[var(--color-dark-400)]">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          <span>— or jump in as —</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Role Buttons */}
        <div className="flex gap-3 justify-between">
          {[
            { label: 'Employee', email: 'employee@atomquest.com', pass: 'emp123' },
            { label: 'Manager', email: 'manager@atomquest.com', pass: 'mgr123' },
            { label: 'Admin', email: 'admin@atomquest.com', pass: 'adm123' }
          ].map((role) => (
            <button 
              key={role.label}
              onClick={() => autoFillAndLogin(role.email, role.pass)}
              className="flex-1 py-[10px] flex items-center justify-center text-[13px] font-medium text-[var(--color-dark-300)] bg-transparent border border-[rgba(255,255,255,0.08)] rounded-[6px] hover:border-[var(--color-accent-600)] hover:text-[var(--color-dark-50)] transition-all duration-150 hover:scale-[1.02]"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center z-10">
        <span className="text-[11px] text-[var(--color-dark-400)] tracking-wide">AtomQuest Hackathon 1.0 · Alliance University</span>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
