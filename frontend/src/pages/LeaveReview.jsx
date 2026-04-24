import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

const BASE_URL    = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SERVICES    = [
  'D2C Brand Solutions',
  'Real Estate Solutions',
  'Advanced Sales & Lead Gen',
  'Content Production Factory',
  'Master Agent Services',
  'AI Strategic Consultancy',
  'Other',
];
const inputCls = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm";

export default function LeaveReview() {
  const [form, setForm]       = useState({ name: '', role: '', email: '', rating: 0, review: '', serviceUsed: '' });
  const [hover, setHover]     = useState(0);
  const [submitting, setSub]  = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())        { setError('Please enter your name.'); return; }
    if (!form.rating)             { setError('Please select a rating.'); return; }
    if (!form.review.trim())      { setError('Please write your review.'); return; }
    if (form.review.trim().length < 20) { setError('Review must be at least 20 characters.'); return; }

    try {
      setSub(true);
      const res  = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSub(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-emerald-900/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-md w-full text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Thank you, {form.name}! 🙏</h2>
        <p className="text-white/55 mb-2">Your review has been submitted successfully.</p>
        <p className="text-white/35 text-sm mb-8">It will appear on our website after a quick review by our team.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex items-center justify-center p-4 py-16">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-900/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)]">A</div>
          <span className="text-white font-bold text-xl">Agentic<span className="text-white/40">OS</span></span>
        </Link>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Leave a Review ⭐</h1>
          <p className="text-white/45 text-sm mb-8">Share your experience working with AgenticOS.</p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="text-white/50 text-xs font-medium mb-3 block">Your Rating *</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => set('rating', star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 transition-colors ${
                      star <= (hover || form.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/20'
                    }`} />
                  </button>
                ))}
                {form.rating > 0 && (
                  <span className="ml-2 text-white/50 text-sm self-center">
                    {['','Poor','Fair','Good','Great','Excellent!'][form.rating]}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rajesh Mehta" className={inputCls} />
              </div>
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Role & Company</label>
                <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="CEO, FashionMart" className={inputCls} />
              </div>
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Email (private)</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Service Used</label>
                <select value={form.serviceUsed} onChange={e => set('serviceUsed', e.target.value)} className={inputCls}>
                  <option value="" className="bg-[#0c0c14]">Select a service...</option>
                  {SERVICES.map(s => <option key={s} value={s} className="bg-[#0c0c14]">{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Your Review *</label>
                <textarea
                  value={form.review}
                  onChange={e => set('review', e.target.value)}
                  rows={5}
                  placeholder="Tell us about your experience — what problem did we solve, what results did you see?"
                  className={`${inputCls} resize-none`}
                />
                <p className="text-white/20 text-xs mt-1 text-right">{form.review.length}/600</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                : <>Submit Review ⭐</>}
            </button>

            <p className="text-center text-white/20 text-xs">
              Your email is never shown publicly. Reviews are approved before going live.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
