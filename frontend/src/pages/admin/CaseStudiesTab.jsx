import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, Edit3, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { adminApi } from './adminApi.js';

const CATEGORIES = ['Web', 'Mobile', 'AI', 'Automation'];

const EMPTY_FORM = { title: '', client: '', category: 'AI', description: '', results: '', tags: '', emoji: '🚀', order: 0 };

function FormModal({ initial, onClose, onSave }) {
  const [form, setForm]     = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    if (!form.title || !form.category) { setError('Title and category are required.'); return; }
    try {
      setSaving(true);
      const payload = {
        ...form,
        results: form.results ? form.results.split('\n').map(r => r.trim()).filter(Boolean) : [],
        tags:    form.tags    ? form.tags.split(',').map(t => t.trim()).filter(Boolean)     : [],
        order:   Number(form.order) || 0,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 text-sm transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg bg-[#0c0c14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <p className="text-white font-semibold">{initial?._id ? 'Edit Case Study' : 'New Case Study'}</p>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="AI Inventory System" className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Client</label>
              <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Fashion Brand" className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0c0c14]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Emoji</label>
              <input value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="🚀" className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Order</label>
              <input type="number" value={form.order} onChange={e => set('order', e.target.value)} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="What did you build and what problem did it solve?" />
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Results (one per line)</label>
              <textarea value={typeof form.results === 'string' ? form.results : form.results?.join('\n')} onChange={e => set('results', e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder={"87% fewer stockouts\n40% cost reduction"} />
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Tags (comma separated)</label>
              <input value={typeof form.tags === 'string' ? form.tags : form.tags?.join(', ')} onChange={e => set('tags', e.target.value)} placeholder="AI Agent, Inventory, D2C" className={inputCls} />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-white/5 shrink-0">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Case Study</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudiesTab() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);

  const CATEGORY_COLORS = { Web: 'text-blue-400', Mobile: 'text-purple-400', AI: 'text-cyan-400', Automation: 'text-emerald-400' };

  const load = async () => {
    try { setLoading(true); setError('');
      const d = await adminApi.getCaseStudies(); setItems(d.caseStudies || []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload) => {
    if (editing?._id) { await adminApi.updateCaseStudy(editing._id, payload); }
    else              { await adminApi.createCaseStudy(payload); }
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this case study?')) return;
    await adminApi.deleteCaseStudy(id); load();
  };

  const openEdit = (item) => {
    setEditing({ ...item, results: item.results?.join('\n') || '', tags: item.tags?.join(', ') || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Case Studies</h2>
          <p className="text-white/40 text-sm mt-0.5">{items.length} projects — shown on /case-studies page</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

      {loading ? (
        <div className="space-y-3 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/[0.03]" />)}</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-white/30 mb-4">No case studies yet.</p>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-medium">
            Add First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <span className="text-2xl shrink-0">{item.emoji || '🚀'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-medium text-sm">{item.title}</p>
                  <span className={`text-xs font-medium ${CATEGORY_COLORS[item.category] || 'text-white/40'}`}>{item.category}</span>
                </div>
                <p className="text-white/40 text-xs mt-0.5 truncate">{item.client} {item.results?.length > 0 && `· ${item.results.length} results`}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item._id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <FormModal initial={editing} onClose={() => setShowForm(false)} onSave={handleSave} />}
    </div>
  );
}
