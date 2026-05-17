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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden" style={{ backgroundColor: '#050508', fontFamily: 'var(--font-sans)' }}>
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px] opacity-15 animate-blob" style={{ background: '#0d9488', animation: 'blob 15s infinite alternate' }} />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-15 animate-blob" style={{ background: '#4f46e5', animation: 'blob 20s infinite alternate-reverse', animationDelay: '2s' }} />
      </div>

      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Card */}
      <div className="relative w-full max-w-[400px] rounded-2xl p-12 z-10 animate-fade-in-up" style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 80px rgba(13, 148, 136, 0.15)'
      }}>
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-[32px]">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #0d9488, #4f46e5)', marginBottom: '8px' }}>
            <span className="text-white font-bold text-2xl tracking-tight">AQ</span>
          </div>
          <h1 className="text-white font-bold tracking-tight" style={{ fontSize: '28px' }}>AtomQuest</h1>
          <p className="text-[#8b949e] font-semibold tracking-widest uppercase mt-1" style={{ fontSize: '13px' }}>Performance Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-[16px]">
          <div>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0d1117] border rounded-lg px-4 h-[52px] text-[15px] text-white placeholder-[#8b949e] outline-none transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              onFocus={(e) => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 10px rgba(13,148,136,0.3)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d1117] border rounded-lg pl-4 pr-10 h-[52px] text-[15px] text-white placeholder-[#8b949e] outline-none transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              onFocus={(e) => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 10px rgba(13,148,136,0.3)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="flex justify-end mt-[-8px]">
            <a href="#" className="text-[#8b949e] text-xs hover:text-white transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative w-full py-3 rounded-lg text-[14px] font-[600] text-white shadow-lg overflow-hidden disabled:opacity-70 mt-2"
            style={{ background: 'linear-gradient(to right, #0d9488, #4f46e5)' }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
            </div>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4" style={{ marginTop: '32px', marginBottom: '32px' }}>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[#8b949e] text-xs font-medium">— or jump in as —</span>
          <div className="flex-1 h-px bg-white/10" />
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
              className="flex-1 py-3 flex items-center justify-center text-[12px] font-semibold text-[#8b949e] bg-[#0d1117] border border-white/5 rounded-lg hover:border-[#0d9488] hover:text-[#0d9488] transition-all duration-200 hover:scale-[1.02]"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center z-10">
        <span className="text-[11px] text-[#8b949e] tracking-wide">AtomQuest Hackathon 1.0 · Alliance University</span>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
