import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Star, Trash2, AlertCircle, Award } from 'lucide-react';
import { adminApi } from './adminApi.js';

const STATUS_STYLES = {
  pending:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`} />
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filter, setFilter]       = useState('pending');
  const [actioning, setActioning] = useState(null);

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  const load = async () => {
    try {
      setLoading(true); setError('');
      const data = await adminApi.getReviews(filter === 'all' ? {} : { status: filter });
      setReviews(data.reviews || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const act = async (id, payload) => {
    try {
      setActioning(id);
      await adminApi.updateReview(id, payload);
      load();
    } catch (err) { setError(err.message); }
    finally { setActioning(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review permanently?')) return;
    await adminApi.deleteReview(id);
    load();
  };

  const tabs = [
    { key: 'pending',  label: 'Pending',  badge: pendingCount },
    { key: 'approved', label: 'Approved', badge: null },
    { key: 'rejected', label: 'Rejected', badge: null },
    { key: 'all',      label: 'All',      badge: null },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <p className="text-white/40 text-sm mt-0.5">Approve client reviews before they go live</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === t.key ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'bg-white/[0.03] text-white/50 border-white/5 hover:border-white/15'
            }`}>
            {t.label}
            {t.badge > 0 && (
              <span className="w-5 h-5 rounded-full bg-yellow-500 text-black text-[10px] font-bold flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/[0.03]" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center text-white/30">No {filter} reviews found.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r._id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <p className="text-white font-semibold">{r.name}</p>
                    {r.role && <p className="text-white/40 text-xs">{r.role}</p>}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                    {r.featured && (
                      <span className="flex items-center gap-1 text-yellow-400 text-[10px]">
                        <Award className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <StarRow rating={r.rating} />
                  <p className="text-white/60 text-sm mt-3 leading-relaxed">"{r.review}"</p>
                  {r.serviceUsed && <p className="text-indigo-400 text-xs mt-2">{r.serviceUsed}</p>}
                  <p className="text-white/25 text-xs mt-2">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {r.email && ` · ${r.email}`}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => act(r._id, { status: 'approved' })} disabled={actioning === r._id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-medium transition-all border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => act(r._id, { status: 'rejected' })} disabled={actioning === r._id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-all border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {r.status === 'approved' && (
                    <button onClick={() => act(r._id, { featured: !r.featured })} disabled={actioning === r._id}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                        r.featured
                          ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/25'
                          : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                      }`}>
                      <Award className="w-3.5 h-3.5" /> {r.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}
                  {r.status === 'rejected' && (
                    <button onClick={() => act(r._id, { status: 'approved' })} disabled={actioning === r._id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(r._id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.02] text-white/25 hover:text-red-400 hover:bg-red-500/10 text-xs border border-white/5 transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
