import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const { setCurrentUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Map credentials to our mock data users
  const credentialsMap = {
    'employee@atomquest.com': 'u1',
    'manager@atomquest.com': 'u4',
    'admin@atomquest.com': 'u6'
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const userId = credentialsMap[email] || 'u1'; // fallback to u1
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0d1117] text-white" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-[#0d1117] rounded-2xl p-8 border" style={{ borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(6,182,212,0.05)' }}>
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 mb-4">
              <span className="text-cyan-400 font-bold text-xl tracking-tight">AQ</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">AtomQuest</h1>
            <p className="text-sm text-slate-400">Performance Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <input 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                required
              />
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #06b6d4, #0ea5e9)' }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-400 font-medium">— or jump in as —</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Role Buttons */}
          <div className="flex gap-2 justify-between">
            <button 
              onClick={() => autoFillAndLogin('employee@atomquest.com', 'emp123')}
              className="flex-1 py-2 text-xs font-medium border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              👤 Employee
            </button>
            <button 
              onClick={() => autoFillAndLogin('manager@atomquest.com', 'mgr123')}
              className="flex-1 py-2 text-xs font-medium border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              🧑‍💼 Manager
            </button>
            <button 
              onClick={() => autoFillAndLogin('admin@atomquest.com', 'adm123')}
              className="flex-1 py-2 text-xs font-medium border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-[11px] text-slate-500 tracking-wide">AtomQuest Hackathon 1.0 · Alliance University</span>
        </div>
      </div>
    </div>
  );
}
