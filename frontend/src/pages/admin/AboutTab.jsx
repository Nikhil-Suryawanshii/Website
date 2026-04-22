import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { adminApi } from './adminApi.js';

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 text-sm transition-colors";

export default function AboutTab() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const load = async () => {
    try { setLoading(true); const d = await adminApi.getAbout(); if (d.about) setData(d.about);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const set = (key, val) => setData(p => ({ ...p, [key]: val }));
  const setStory = (key, val) => setData(p => ({ ...p, story: { ...p.story, [key]: val } }));
  const setParagraph = (i, val) => {
    const arr = [...(data.story.paragraphs || [])]; arr[i] = val;
    setStory('paragraphs', arr);
  };
  const addParagraph  = () => setStory('paragraphs', [...(data.story?.paragraphs || []), '']);
  const delParagraph  = (i) => setStory('paragraphs', data.story.paragraphs.filter((_, idx) => idx !== i));

  const setStat  = (i, key, val) => { const arr = [...data.stats];  arr[i] = { ...arr[i], [key]: val };  set('stats', arr); };
  const setVal   = (i, key, val) => { const arr = [...data.values]; arr[i] = { ...arr[i], [key]: val }; set('values', arr); };

  const handleSave = async () => {
    try { setSaving(true); setError(''); await adminApi.updateAbout(data); setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/[0.03]" />)}</div>;
  if (!data)   return <div className="text-white/40 text-sm">No about content found. Run <code className="text-indigo-400">npm run seed</code> first.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-white">About Page</h2><p className="text-white/40 text-sm mt-0.5">Edit content shown on /about</p></div>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save All</>}
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0"/>{error}</div>}

      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Hero Section</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-white/40 text-xs mb-1 block">Headline</label><input value={data.headline || ''} onChange={e => set('headline', e.target.value)} className={inputCls} /></div>
            <div><label className="text-white/40 text-xs mb-1 block">Headline Sub (gradient)</label><input value={data.headlineSub || ''} onChange={e => set('headlineSub', e.target.value)} className={inputCls} /></div>
            <div className="col-span-2"><label className="text-white/40 text-xs mb-1 block">Tagline</label><textarea value={data.tagline || ''} onChange={e => set('tagline', e.target.value)} rows={2} className={`${inputCls} resize-none`} /></div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Our Story</p>
          <div><label className="text-white/40 text-xs mb-1 block">Title</label><input value={data.story?.title || ''} onChange={e => setStory('title', e.target.value)} className={inputCls} /></div>
          {(data.story?.paragraphs || []).map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={p} onChange={e => setParagraph(i, e.target.value)} rows={2} className={`${inputCls} resize-none flex-1`} placeholder={`Paragraph ${i + 1}`} />
              <button onClick={() => delParagraph(i)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={addParagraph} className="flex items-center gap-1.5 text-indigo-400 text-xs hover:text-indigo-300 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Paragraph</button>
        </div>

        {/* Stats */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Stats</p>
          <div className="grid grid-cols-2 gap-3">
            {(data.stats || []).map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s.value || ''} onChange={e => setStat(i, 'value', e.target.value)} placeholder="50+" className={`${inputCls} w-20`} />
                <input value={s.label || ''} onChange={e => setStat(i, 'label', e.target.value)} placeholder="Projects Delivered" className={inputCls} />
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Values</p>
          {(data.values || []).map((v, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input value={v.icon || ''} onChange={e => setVal(i, 'icon', e.target.value)} placeholder="Icon (Users/Zap/etc)" className={inputCls} />
              <input value={v.title || ''} onChange={e => setVal(i, 'title', e.target.value)} placeholder="Title" className={inputCls} />
              <input value={v.desc || ''} onChange={e => setVal(i, 'desc', e.target.value)} placeholder="Description" className={inputCls} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
