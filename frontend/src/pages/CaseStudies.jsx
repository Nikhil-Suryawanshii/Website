import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, TrendingUp } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = ['All', 'Web', 'Mobile', 'AI', 'Automation'];

const CATEGORY_COLORS = {
  Web:        'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Mobile:     'bg-purple-500/15 text-purple-400 border-purple-500/30',
  AI:         'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Automation: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

function ProjectCard({ project }) {
  return (
    <div className="group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-900/40 to-purple-900/30 flex items-center justify-center overflow-hidden">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-6xl opacity-30">{project.emoji || '🚀'}</div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${CATEGORY_COLORS[project.category] || 'bg-white/10 text-white/60 border-white/10'}`}>
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">{project.client}</p>
        <h3 className="text-white font-bold text-lg mb-3 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-5">{project.description}</p>

        {/* Results */}
        {project.results?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {project.results.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">{r}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px] border border-white/5">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActive] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE_URL}/api/case-studies`)
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.caseStudies || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300">
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="pt-36 pb-12 px-4 sm:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-medium mb-6">
            PORTFOLIO
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Studies</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Real projects. Real results. See how we've helped businesses transform with technology.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 px-4 sm:px-6 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => <div key={i} className="h-80 rounded-3xl bg-white/[0.03]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-white/30 text-lg mb-2">No projects found for this category.</p>
              <p className="text-white/20 text-sm">Check back soon — we're always shipping new work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center p-10 rounded-3xl bg-white/[0.02] border border-white/5">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Want results like these?</h2>
          <p className="text-white/50 mb-6">Let's discuss how we can build something remarkable for your business.</p>
          <Link
            to="/"
            onClick={() => setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
          >
            Book a Free Call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
