import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [form, setForm]           = useState({ email: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Both fields are required.'); return; }
    try {
      setLoading(true); setError('');
      const res  = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.user.role !== 'admin') throw new Error('Access denied. Admin accounts only.');
      localStorage.setItem('agentic_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-900/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            A
          </div>
          <div>
            <p className="text-white font-bold text-xl tracking-tight">AgenticOS</p>
            <p className="text-white/40 text-xs">Admin Dashboard</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-white font-semibold text-lg">Admin Sign In</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">Email</label>
              <input
                type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="admin@agenticos.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 mt-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In to Dashboard</>}
            </button>
          </form>

          <p className="text-center text-white/25 text-xs mt-6">
            Default: admin@agenticos.com / Admin@123456
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/40 transition-colors">← Back to Website</a>
        </p>
      </div>
    </div>
  );
}
