import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Calendar, Tag, ArrowRight, Search } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'All',
  'E-commerce Growth Automation',
  'Marketing Automation',
  'Sales Pipeline Automation',
  'Customer Support Automation',
  'HR Automation',
  'Business Operations Automation',
  'Finance Automation',
];

const BADGE_COLORS = {
  Article:      'bg-white/10 text-white/70 border-white/10',
  Tutorial:     'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Project:      'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Case Study': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Other:        'bg-white/10 text-white/50 border-white/10',
};

function BlogCard({ blog }) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="group bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-900/40 to-purple-900/30 overflow-hidden shrink-0">
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20">📝</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${BADGE_COLORS[blog.badge] || BADGE_COLORS.Other}`}>
            {blog.badge}
          </span>
          <span className="flex items-center gap-1 text-white/35 text-xs">
            <Clock className="w-3 h-3" /> {blog.readTime} min read
          </span>
          {date && (
            <span className="flex items-center gap-1 text-white/35 text-xs">
              <Calendar className="w-3 h-3" /> {date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.slice(0, 3).map((t, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-white/35 text-[10px] border border-white/5">
                <Tag className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
          </div>
        )}

        {/* Read link */}
        <Link
          to={`/blog/${blog.slug}`}
          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors group/link"
        >
          Read Article <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';

  const [blogs, setBlogs]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActive]     = useState(initCategory);
  const [search, setSearch]             = useState('');
  const [total, setTotal]               = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: 50 });
        if (activeCategory !== 'All') params.set('category', activeCategory);
        const res  = await fetch(`${BASE_URL}/api/blogs?${params}`);
        const data = await res.json();
        setBlogs(data.blogs || []);
        setTotal(data.total || 0);
      } catch { setBlogs([]); }
      finally  { setLoading(false); }
    };
    fetch_();
    setSearchParams(activeCategory !== 'All' ? { category: activeCategory } : {});
  }, [activeCategory]);

  const filtered = search
    ? blogs.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        b.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : blogs;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300">
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="pt-36 pb-10 px-4 sm:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-medium mb-6">
            AUTOMATION INSIGHTS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            AI Automation <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Blog</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
            Real automation strategies, tutorials and case studies for businesses ready to scale.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs — horizontal scroll on mobile */}
      <section className="px-4 sm:px-6 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium border whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white/[0.03] text-white/55 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
              {[...Array(6)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-white/[0.03]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-white/30 text-lg mb-1">No articles found.</p>
              <p className="text-white/20 text-sm">Try a different category or search term.</p>
            </div>
          ) : (
            <>
              <p className="text-white/30 text-xs mb-5">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(b => <BlogCard key={b._id} blog={b} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
