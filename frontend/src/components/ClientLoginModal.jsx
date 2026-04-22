import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff, Loader2, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export function ClientLoginModal({ isOpen, onClose }) {
  const { user, loading, error, login, register, logout, clearError } = useAuth();
  const [mode, setMode]                 = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', phone: '' });

  useEffect(() => {
    setMode(user ? 'profile' : 'login');
  }, [user, isOpen]);

  useEffect(() => { clearError(); }, [mode]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ok = false;
    if (mode === 'login') {
      ok = await login({ email: form.email, password: form.password });
    } else {
      ok = await register({ name: form.name, email: form.email, password: form.password, company: form.company, phone: form.phone });
    }
    if (ok) onClose();
  };

  const handleLogout = () => { logout(); onClose(); };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="text-white font-semibold">
              {mode === 'profile' ? 'My Account' : mode === 'login' ? 'Client Login' : 'Create Account'}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">

          {/* Profile View */}
          {mode === 'profile' && user && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-white/50 text-sm">{user.email}</p>
                  {user.company && <p className="text-indigo-400 text-xs mt-0.5">{user.company}</p>}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-indigo-300 text-sm font-medium mb-1">Role</p>
                <p className="text-white capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3.5 rounded-full bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/30 font-medium transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}

          {/* Login / Register Form */}
          {(mode === 'login' || mode === 'register') && (
            <div className="space-y-4">

              {/* Tabs */}
              <div className="flex bg-white/[0.03] rounded-xl p-1 border border-white/5">
                {['login', 'register'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-indigo-600 text-white shadow' : 'text-white/50 hover:text-white'}`}
                  >
                    {m === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
              )}

              <div className="space-y-3">
                {mode === 'register' && (
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                )}
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Password *"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'register' && (
                  <>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Company (optional)"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                  </>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-white text-black font-bold hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                  mode === 'login' ? <><LogIn className="w-4 h-4" /> Sign In</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
              </button>

              <p className="text-center text-white/30 text-xs">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  {mode === 'login' ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
