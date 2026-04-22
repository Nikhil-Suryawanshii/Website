import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { adminApi } from './adminApi.js';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/50 text-xs font-medium">{label}</p>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value ?? '—'}</p>
      {sub && <p className="text-white/30 text-xs">{sub}</p>}
    </div>
  );
}

export default function DashboardTab() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = async () => {
    try {
      setLoading(true); setError('');
      const data = await adminApi.getStats();
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const getCount = (arr, id) => arr?.find(x => x._id === id)?.count ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
          <p className="text-white/40 text-sm mt-0.5">Overview of your AgenticOS platform</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2 items-center">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading && !stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/[0.03]" />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Calendar} label="Total Leads"      value={stats?.total}          sub="All time bookings"           color="bg-indigo-500/20 text-indigo-400" />
            <StatCard icon={TrendingUp} label="Last 7 Days"    value={stats?.last7Days}       sub="Recent lead submissions"     color="bg-cyan-500/20 text-cyan-400" />
            <StatCard icon={Clock} label="New / Uncontacted"   value={getCount(stats?.byStatus, 'new')} sub="Awaiting follow-up" color="bg-yellow-500/20 text-yellow-400" />
            <StatCard icon={Users} label="Completed Sessions"  value={getCount(stats?.byStatus, 'completed')} sub="Closed deals" color="bg-emerald-500/20 text-emerald-400" />
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
              <p className="text-white/60 text-sm font-medium mb-4">Leads by Status</p>
              <div className="space-y-3">
                {[
                  { id: 'new',       label: 'New',        color: 'bg-yellow-400' },
                  { id: 'contacted', label: 'Contacted',  color: 'bg-blue-400' },
                  { id: 'booked',    label: 'Booked',     color: 'bg-indigo-400' },
                  { id: 'completed', label: 'Completed',  color: 'bg-emerald-400' },
                  { id: 'cancelled', label: 'Cancelled',  color: 'bg-red-400' },
                ].map(s => {
                  const count = getCount(stats?.byStatus, s.id);
                  const pct   = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={s.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">{s.label}</span>
                        <span className="text-white/40">{count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
              <p className="text-white/60 text-sm font-medium mb-4">Leads by Session Type</p>
              <div className="space-y-4">
                {[
                  { id: 'discovery',         label: 'Discovery Call (Free)',   color: 'bg-indigo-500', textColor: 'text-indigo-400' },
                  { id: 'founder-deep-dive', label: 'Deep-Dive ($250)',        color: 'bg-cyan-500',   textColor: 'text-cyan-400' },
                ].map(t => {
                  const count = getCount(stats?.byType, t.id);
                  const pct   = stats?.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={t.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${t.textColor}`}>{t.label}</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${t.color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-white/30 text-xs mt-1">{pct}% of total leads</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
