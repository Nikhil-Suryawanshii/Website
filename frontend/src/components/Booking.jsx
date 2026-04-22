import React, { useState } from 'react';
import {
  CheckCircle2, PhoneCall, MessageCircle, Calendar,
  CreditCard, Clock, ArrowRight, Loader2, X,
} from 'lucide-react';
import { bookingsApi } from '../services/api.js';

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', message: '' };

export function Booking({ onBook }) {
  const [pendingSession, setPendingSession] = useState(null);
  const [form, setForm]                     = useState(EMPTY_FORM);
  const [submitting, setSubmitting]         = useState(false);
  const [formError, setFormError]           = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleBookClick = (type, url) => {
    setPendingSession({ type, url });
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!pendingSession) return;
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    try {
      setSubmitting(true);
      await bookingsApi.create({
        name:        form.name.trim(),
        email:       form.email.trim(),
        phone:       form.phone.trim(),
        company:     form.company.trim(),
        message:     form.message.trim(),
        sessionType: pendingSession.type,
        calendlyUrl: pendingSession.url,
      });
    } catch {
      // Non-blocking — open Calendly even if API fails
    } finally {
      setSubmitting(false);
      const url = pendingSession.url;
      setPendingSession(null);
      onBook(url);
    }
  };

  return (
    <section id="booking" className="py-16 md:py-32 px-4 sm:px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Ready to reclaim your time?
          </h2>
          <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto px-2">
            Choose how you'd like to get started. We'll map your current workflows and show you
            exactly where an AI agent can recover lost revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">

          {/* Left: What to Expect */}
          <div className="bg-white/[0.02] border border-white/5 p-6 md:p-12 rounded-3xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">What to Expect in Your Call</h3>
              <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                {[
                  'Understand your current challenges and goals',
                  'Identify automation opportunities in your workflow',
                  'Discuss MVP validation strategies for your market',
                  'Outline potential solutions and realistic timelines',
                  'Define success metrics and ROI expectations',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 md:gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-400 shrink-0 mt-0.5 md:mt-0" />
                    <span className="text-white/80 text-base md:text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 md:p-8 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <h4 className="text-white font-medium mb-3 md:mb-4 flex items-center gap-2 text-base md:text-lg">
                <PhoneCall className="w-5 h-5 text-indigo-400" /> Direct Contact
              </h4>
              <p className="text-white/60 mb-4 md:mb-5 text-sm md:text-base">Prefer to call directly? Reach Sachin at:</p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <a href="tel:+917517366568"
                  className="px-4 md:px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors font-medium flex items-center justify-center gap-2 flex-1 text-sm md:text-base">
                  +91 7517366568
                </a>
                <a href="https://wa.me/917517366568" target="_blank" rel="noreferrer"
                  className="px-4 md:px-6 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors font-medium flex items-center justify-center gap-2 flex-1 text-sm md:text-base">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right: Booking Cards */}
          <div className="space-y-6">

            {/* Discovery Call */}
            <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/20 transition-colors" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
                Recommended
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Discovery Call</h3>
              <p className="text-white/60 text-base md:text-lg mb-6 md:mb-8 flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white/40" /> 30 minutes • Free consultation
              </p>
              <button
                onClick={() => handleBookClick('discovery', 'https://calendly.com/sachin/discovery-call')}
                className="w-full py-4 md:py-5 rounded-full bg-white text-black font-bold text-base md:text-lg hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 md:gap-3"
              >
                Book Discovery Call <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Founder Session */}
            <div className="p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Prefer a founder session?</h3>
              <p className="text-white/60 text-base md:text-lg mb-6 md:mb-8 flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-white/40" /> $250 Deep-Dive with Sachin
              </p>
              <button
                onClick={() => handleBookClick('founder-deep-dive', 'https://calendly.com/sachin/founder-deep-dive')}
                className="w-full py-4 md:py-5 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 font-bold text-base md:text-lg transition-all flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-5"
              >
                Book Deep-Dive Session <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <p className="text-center text-white/40 text-xs md:text-sm flex items-center justify-center gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4" /> Usually responds within 2 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      {pendingSession && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setPendingSession(null); }}
        >
          <div className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <p className="text-white font-semibold">
                  {pendingSession.type === 'discovery' ? 'Book Discovery Call' : 'Book Deep-Dive Session'}
                </p>
                <p className="text-white/40 text-sm mt-0.5">Quick details before we open the calendar</p>
              </div>
              <button onClick={() => setPendingSession(null)}
                className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *"
                  className="col-span-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email *"
                  className="col-span-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone"
                  className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                <input name="company" value={form.company} onChange={handleChange} placeholder="Company"
                  className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="What would you like to discuss? (optional)" rows={3}
                  className="col-span-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm resize-none" />
              </div>
              <button onClick={handleFormSubmit} disabled={submitting}
                className="w-full py-4 rounded-full bg-white text-black font-bold hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2 text-sm">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue to Calendar <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-white/25 text-xs">Your details are saved securely and never shared.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
