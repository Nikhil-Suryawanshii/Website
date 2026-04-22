import React, { useState, useEffect } from 'react';
import { RefreshCw, UserCheck, UserX, Shield, User, AlertCircle } from 'lucide-react';
import { adminApi } from './adminApi.js';

export default function UsersTab() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = async () => {
    try {
      setLoading(true); setError('');
      const data = await adminApi.getUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Users</h2>
          <p className="text-white/40 text-sm mt-0.5">{users.length} registered accounts</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/[0.03]" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center text-white/30 text-sm">No users registered yet</div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium">User</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium hidden md:table-cell">Company</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium">Role</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium hidden lg:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium hidden lg:table-cell">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === users.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-white/40 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-white/50 text-xs">{u.company || '—'}</td>
                  <td className="px-5 py-3.5">
                    {u.role === 'admin' ? (
                      <span className="flex items-center gap-1.5 text-indigo-400 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5" /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-white/50 text-xs">
                        <User className="w-3.5 h-3.5" /> Client
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {u.isActive ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs"><UserCheck className="w-3.5 h-3.5" /> Active</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs"><UserX className="w-3.5 h-3.5" /> Disabled</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-white/35 text-xs">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
