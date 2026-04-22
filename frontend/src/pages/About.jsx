import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Zap, Shield, ArrowRight } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK = {
  headline:    'Built by Engineers,',
  headlineSub: 'For Ambitious Businesses',
  tagline:     "We're a lean, focused team of engineers and AI specialists. No fluff, no middlemen — just clean code and measurable results.",
  story: {
    title: 'Why We Started AgenticOS',
    paragraphs: [
      'We saw too many businesses struggle with agencies that over-promised, under-delivered, and had no clue how to leverage AI effectively.',
      'So we built AgenticOS — an agency that combines deep engineering expertise with AI-first thinking to build systems that actually move the needle.',
      'Every member of our team has built production systems used by real users. We know the difference between a demo and a product that scales.',
    ],
  },
  values: [
    { icon: 'Users',  title: 'Client First',      desc: 'Your success is our success. We measure our work by the impact it creates for your business.' },
    { icon: 'Target', title: 'Outcome Driven',     desc: 'Every feature is tied to a business objective. We don\'t build for the sake of building.' },
    { icon: 'Zap',    title: 'Move Fast',          desc: 'We ship fast without breaking things. Rapid iteration with rock-solid quality.' },
    { icon: 'Shield', title: 'Transparent',        desc: 'Weekly updates, open communication, and honest timelines. No surprises.' },
  ],
  stats: [
    { value: '50+',  label: 'Projects Delivered' },
    { value: '98%',  label: 'Client Satisfaction' },
    { value: '5+',   label: 'Years Experience' },
    { value: '24/7', label: 'Support Available' },
  ],
};

const VALUE_ICONS = { Users, Target, Zap, Shield };

export default function About() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE_URL}/api/about`)
      .then(r => r.json())
      .then(d => { if (d.success && d.about) setData(d.about); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300">
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-medium mb-6">
            WHO WE ARE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {data.headline}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {data.headlineSub}
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {data.tagline}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.values.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon] || Shield;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all group text-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/25 transition-colors">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story + Stats */}
      <section className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Story */}
          <div>
            <div className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">OUR STORY</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{data.story.title}</h2>
            <div className="space-y-4">
              {data.story.paragraphs.map((p, i) => (
                <p key={i} className="text-white/60 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-4xl font-bold text-indigo-400 mb-1">{s.value}</p>
                <p className="text-white/50 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Work Together?</h2>
            <p className="text-white/60 mb-8">Let's discuss your project and see if we're the right fit for you.</p>
            <Link
              to="/#booking"
              onClick={() => setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Start a Conversation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
