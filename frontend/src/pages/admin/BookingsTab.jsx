import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Trash2, ChevronLeft, ChevronRight, X, Save, AlertCircle, Phone, Mail, Building2 } from 'lucide-react';
import { adminApi } from './adminApi.js';

const STATUS_STYLES = {
  new:       'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  contacted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  booked:    'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const ALL_STATUSES = ['new', 'contacted', 'booked', 'completed', 'cancelled'];

function DetailModal({ booking, onClose, onSave }) {
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes]   = useState(booking.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(booking._id, { status, notes });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg bg-[#0c0c14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <p className="text-white font-semibold">{booking.name}</p>
            <p className="text-white/40 text-xs mt-0.5">
              {booking.sessionType === 'discovery' ? 'Discovery Call' : 'Deep-Dive Session'} •{' '}
              {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-white/40 text-[10px] mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
              <p className="text-white text-xs break-all">{booking.email}</p>
            </div>
            {booking.phone && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-white/40 text-[10px] mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                <p className="text-white text-xs">{booking.phone}</p>
              </div>
            )}
            {booking.company && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 col-span-2">
                <p className="text-white/40 text-[10px] mb-1 flex items-center gap-1"><Building2 className="w-3 h-3" /> Company</p>
                <p className="text-white text-xs">{booking.company}</p>
              </div>
            )}
          </div>

          {booking.message && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-white/40 text-[10px] mb-1">Message</p>
              <p className="text-white/70 text-xs leading-relaxed">{booking.message}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-white/50 text-xs font-medium mb-2 block">Update Status</label>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                    status === s ? STATUS_STYLES[s] : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block">Admin Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Add internal notes about this lead..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 text-xs resize-none transition-colors" />
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsTab() {
  const [bookings, setBookings]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filterStatus, setFilter] = useState('');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  const limit = 10;

  const load = async () => {
    try {
      setLoading(true); setError('');
      const params = { page, limit };
      if (filterStatus) params.status = filterStatus;
      const data = await adminApi.getBookings(params);
      setBookings(data.bookings);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this booking?')) return;
    await adminApi.deleteBooking(id);
    load();
  };

  const handleSave = async (id, body) => {
    await adminApi.updateBooking(id, body);
    load();
  };

  const filtered = search
    ? bookings.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase()))
    : bookings;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Bookings & Leads</h2>
          <p className="text-white/40 text-sm mt-0.5">{total} total leads captured</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 text-sm transition-colors" />
        </div>
        <select value={filterStatus} onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 focus:outline-none text-sm">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s} className="bg-[#0c0c14] capitalize">{s}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-white/30 text-sm">No bookings found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/40 text-xs font-medium">Name</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs font-medium hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs font-medium hidden lg:table-cell">Session</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs font-medium">Status</th>
                <th className="text-left px-4 py-3 text-white/40 text-xs font-medium hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b._id}
                  onClick={() => setSelected(b)}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{b.name}</p>
                    {b.company && <p className="text-white/35 text-xs">{b.company}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-white/50 text-xs">{b.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-white/50 text-xs">
                      {b.sessionType === 'discovery' ? 'Discovery Call' : 'Deep-Dive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border capitalize ${STATUS_STYLES[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-white/35 text-xs">
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={e => handleDelete(b._id, e)}
                      className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-xs">Page {page} of {Math.ceil(total / limit)}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / limit)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selected && (
        <DetailModal booking={selected} onClose={() => setSelected(null)} onSave={handleSave} />
      )}
    </div>
  );
}
