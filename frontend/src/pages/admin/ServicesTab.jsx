import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { adminApi } from './adminApi.js';

export default function ServicesTab() {
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [expanded, setExpanded]     = useState(null);
  const [editing, setEditing]       = useState({});
  const [saving, setSaving]         = useState(null);
  const [saved, setSaved]           = useState(null);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const data = await adminApi.getServices();
      setServices(data.services);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (svc) => {
    setEditing(prev => ({
      ...prev,
      [svc.slug]: {
        title:    svc.title,
        badge:    svc.badge,
        solution: svc.solution,
      },
    }));
    setExpanded(svc.slug);
  };

  const handleSave = async (slug) => {
    try {
      setSaving(slug);
      await adminApi.updateService(slug, editing[slug]);
      setSaved(slug);
      setTimeout(() => setSaved(null), 2000);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Services</h2>
          <p className="text-white/40 text-sm mt-0.5">Edit service content shown on the website</p>
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
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/[0.03]" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(svc => {
            const isOpen  = expanded === svc.slug;
            const ed      = editing[svc.slug];
            const isSaved = saved === svc.slug;
            return (
              <div key={svc.slug} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">

                {/* Header */}
                <button
                  onClick={() => { setExpanded(isOpen ? null : svc.slug); if (!ed) startEdit(svc); }}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                      {svc.badge}
                    </div>
                    <p className="text-white font-medium text-sm">{svc.title}</p>
                    <span className="text-white/30 text-xs hidden sm:block">· {svc.features?.length} features</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                </button>

                {/* Editable Body */}
                {isOpen && ed && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Title</label>
                      <input value={ed.title} onChange={e => setEditing(p => ({ ...p, [svc.slug]: { ...p[svc.slug], title: e.target.value } }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 text-sm transition-colors" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Badge</label>
                      <input value={ed.badge} onChange={e => setEditing(p => ({ ...p, [svc.slug]: { ...p[svc.slug], badge: e.target.value } }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 text-sm transition-colors" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Solution Description</label>
                      <textarea value={ed.solution} rows={3}
                        onChange={e => setEditing(p => ({ ...p, [svc.slug]: { ...p[svc.slug], solution: e.target.value } }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 text-sm resize-none transition-colors" />
                    </div>

                    {/* Features preview */}
                    <div>
                      <p className="text-white/40 text-xs mb-2">Features ({svc.features?.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {svc.features?.map((f, i) => (
                          <div key={i} className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                            <p className="text-white/70 text-xs font-medium">{f.title}</p>
                            <p className="text-white/35 text-[10px] mt-0.5">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => handleSave(svc.slug)} disabled={saving === svc.slug}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        isSaved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}>
                      {saving === svc.slug ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> :
                       isSaved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved!</> :
                       <><Save className="w-3.5 h-3.5" /> Save Changes</>}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
