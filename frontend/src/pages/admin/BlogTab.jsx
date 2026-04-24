import React, { useState, useEffect } from 'react';
import {
  RefreshCw, Plus, Trash2, Edit3, X, Save, AlertCircle,
  Eye, EyeOff, Upload, FileText, Image, Film, Link2
} from 'lucide-react';
import { adminApi } from './adminApi.js';

const CATEGORIES = [
  'E-commerce Growth Automation',
  'Marketing Automation',
  'Sales Pipeline Automation',
  'Customer Support Automation',
  'HR Automation',
  'Business Operations Automation',
  'Finance Automation',
  'Other',
];

const BADGES = ['Article', 'Tutorial', 'Project', 'Case Study'];

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD || '';
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || '';

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 text-sm transition-colors";

const EMPTY = {
  title: '', category: CATEGORIES[0], badge: 'Article', excerpt: '',
  content: '', thumbnail: '', thumbnailId: '', tags: '', readTime: 3,
  author: 'AgenticOS Team', isPublished: false, attachments: [],
};

// Upload a file to Cloudinary
async function uploadToCloudinary(file) {
  if (!CLOUDINARY_CLOUD || !CLOUDINARY_PRESET) {
    throw new Error('Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD and VITE_CLOUDINARY_PRESET to .env');
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');

  const type = file.type.startsWith('image/') ? 'image'
    : file.type.startsWith('video/') ? 'video'
    : file.type === 'application/pdf' ? 'pdf'
    : 'other';

  return { url: data.secure_url, publicId: data.public_id, type, name: file.name };
}

function FormModal({ initial, onClose, onSave }) {
  const [form, setForm]         = useState(initial ? {
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : '',
    attachments: initial.attachments || [],
  } : EMPTY);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [error, setError]       = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Upload thumbnail
  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setThumbUploading(true);
      const result = await uploadToCloudinary(file);
      set('thumbnail', result.url);
      set('thumbnailId', result.publicId);
    } catch (err) { setError(err.message); }
    finally { setThumbUploading(false); }
  };

  // Upload attachments (images, videos, PDFs)
  const handleAttachUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      const results = await Promise.all(files.map(uploadToCloudinary));
      setForm(p => ({ ...p, attachments: [...p.attachments, ...results] }));
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  const removeAttachment = (i) =>
    setForm(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    try {
      setSaving(true);
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        readTime: Number(form.readTime) || 2,
      };
      await onSave(payload);
      onClose();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const AttachIcon = ({ type }) => {
    if (type === 'image') return <Image className="w-4 h-4 text-cyan-400" />;
    if (type === 'video') return <Film  className="w-4 h-4 text-purple-400" />;
    if (type === 'pdf')   return <FileText className="w-4 h-4 text-red-400" />;
    return <Link2 className="w-4 h-4 text-white/40" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl bg-[#0c0c14] border border-white/10 rounded-3xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
          <p className="text-white font-semibold">{initial?._id ? 'Edit Blog Post' : 'New Blog Post'}</p>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}

          {/* Title */}
          <div>
            <label className="text-white/40 text-xs mb-1 block">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="How I Built a WhatsApp Automation Tool" className={inputCls} />
          </div>

          {/* Category + Badge + ReadTime */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-white/40 text-xs mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0c0c14]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Badge</label>
              <select value={form.badge} onChange={e => set('badge', e.target.value)} className={inputCls}>
                {BADGES.map(b => <option key={b} value={b} className="bg-[#0c0c14]">{b}</option>)}
              </select>
            </div>
          </div>

          {/* Author + ReadTime */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/40 text-xs mb-1 block">Author</label>
              <input value={form.author} onChange={e => set('author', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1 block">Read Time (mins)</label>
              <input type="number" min="1" value={form.readTime} onChange={e => set('readTime', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Thumbnail upload */}
          <div>
            <label className="text-white/40 text-xs mb-2 block">Thumbnail Image</label>
            <div className="flex gap-3 items-start">
              <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-white/40 hover:border-indigo-500/50 hover:text-white/60 cursor-pointer transition-all text-xs ${thumbUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-3.5 h-3.5" />
                {thumbUploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
              </label>
              {form.thumbnail && (
                <div className="relative">
                  <img src={form.thumbnail} alt="thumb" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                  <button onClick={() => { set('thumbnail', ''); set('thumbnailId', ''); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-white/20 text-[10px] mt-1">
              {CLOUDINARY_CLOUD ? 'Uploads to Cloudinary' : '⚠️ Add VITE_CLOUDINARY_CLOUD + VITE_CLOUDINARY_PRESET to .env to enable uploads'}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-white/40 text-xs mb-1 block">Excerpt (shown on card)</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
              placeholder="Short description shown on the blog listing page..."
              className={`${inputCls} resize-none`} />
          </div>

          {/* Content */}
          <div>
            <label className="text-white/40 text-xs mb-1 block">Content (HTML/Markdown)</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={8}
              placeholder="Full article content. You can use HTML tags like <h2>, <p>, <ul>, <strong>, <code>..."
              className={`${inputCls} resize-none font-mono text-xs`} />
          </div>

          {/* Tags */}
          <div>
            <label className="text-white/40 text-xs mb-1 block">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)}
              placeholder="automation, whatsapp, ai-agent" className={inputCls} />
          </div>

          {/* Attachments */}
          <div>
            <label className="text-white/40 text-xs mb-2 block">Attachments (images, videos, PDFs)</label>
            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-white/40 hover:border-indigo-500/50 hover:text-white/60 cursor-pointer transition-all text-xs w-fit ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : 'Add Files (image / video / PDF)'}
              <input type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleAttachUpload} className="hidden" />
            </label>

            {form.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {form.attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <AttachIcon type={att.type} />
                    <span className="text-white/60 text-xs flex-1 truncate">{att.name}</span>
                    <span className="text-white/25 text-[10px] uppercase">{att.type}</span>
                    <button onClick={() => removeAttachment(i)} className="text-white/20 hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div>
              <p className="text-white text-sm font-medium">Publish Status</p>
              <p className="text-white/35 text-xs">{form.isPublished ? 'Live on website' : 'Draft — not visible'}</p>
            </div>
            <button
              onClick={() => set('isPublished', !form.isPublished)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-indigo-600' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isPublished ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 shrink-0">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> {form.isPublished ? 'Save & Publish' : 'Save Draft'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogTab() {
  const [blogs, setBlogs]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [filter, setFilter]     = useState('all');

  const BADGE_COLORS = {
    Article:      'text-white/50',
    Tutorial:     'text-indigo-400',
    Project:      'text-purple-400',
    'Case Study': 'text-emerald-400',
  };

  const load = async () => {
    try {
      setLoading(true); setError('');
      const data = await adminApi.getBlogs();
      setBlogs(data.blogs || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload) => {
    if (editing?._id) await adminApi.updateBlog(editing._id, payload);
    else              await adminApi.createBlog(payload);
    load();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this blog post?')) return;
    await adminApi.deleteBlog(id);
    load();
  };

  const togglePublish = async (blog, e) => {
    e.stopPropagation();
    await adminApi.updateBlog(blog._id, { isPublished: !blog.isPublished });
    load();
  };

  const filtered = filter === 'all' ? blogs
    : filter === 'published' ? blogs.filter(b => b.isPublished)
    : blogs.filter(b => !b.isPublished);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Blog Posts</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {blogs.filter(b => b.isPublished).length} published · {blogs.filter(b => !b.isPublished).length} drafts
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {['all', 'published', 'drafts'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
              filter === f ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'bg-white/[0.03] text-white/40 border-white/5 hover:border-white/15'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

      {loading ? (
        <div className="space-y-3 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/[0.03]" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-white/30 mb-4">No posts yet.</p>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-medium">
            Write First Post
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(b => (
            <div key={b._id}
              onClick={() => { setEditing(b); setShowForm(true); }}
              className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors cursor-pointer">

              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] overflow-hidden shrink-0">
                {b.thumbnail
                  ? <img src={b.thumbnail} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl">📝</div>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-medium text-sm truncate">{b.title}</p>
                  <span className={`text-xs font-medium ${BADGE_COLORS[b.badge] || 'text-white/40'}`}>{b.badge}</span>
                </div>
                <p className="text-white/35 text-xs mt-0.5 truncate">{b.category} · {b.readTime} min · {b.views || 0} views</p>
              </div>

              {/* Status + Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.isPublished ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                  {b.isPublished ? 'Live' : 'Draft'}
                </span>
                <button
                  onClick={e => togglePublish(b, e)}
                  className="p-1.5 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                  title={b.isPublished ? 'Unpublish' : 'Publish'}>
                  {b.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={e => { setEditing(b); setShowForm(true); e.stopPropagation(); }}
                  className="p-1.5 text-white/30 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={e => handleDelete(b._id, e)}
                  className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <FormModal initial={editing} onClose={() => setShowForm(false)} onSave={handleSave} />}
    </div>
  );
}
