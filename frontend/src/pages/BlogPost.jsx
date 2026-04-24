import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Tag, Eye, Download, Play, FileText } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BADGE_COLORS = {
  Article:      'bg-white/10 text-white/70',
  Tutorial:     'bg-indigo-500/20 text-indigo-400',
  Project:      'bg-purple-500/20 text-purple-400',
  'Case Study': 'bg-emerald-500/20 text-emerald-400',
};

function AttachmentCard({ att }) {
  const isVideo = att.type === 'video';
  const isPdf   = att.type === 'pdf';
  const isImage = att.type === 'image';

  if (isVideo) return (
    <div className="rounded-2xl overflow-hidden bg-black">
      <video controls className="w-full max-h-96" src={att.url}>
        Your browser does not support video.
      </video>
      <p className="text-white/40 text-xs p-3">{att.name}</p>
    </div>
  );

  if (isPdf) return (
    <a href={att.url} target="_blank" rel="noreferrer"
      className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{att.name}</p>
        <p className="text-white/40 text-xs">PDF Document</p>
      </div>
      <Download className="w-4 h-4 text-white/30 group-hover:text-indigo-400 transition-colors" />
    </a>
  );

  if (isImage) return (
    <div className="rounded-2xl overflow-hidden">
      <img src={att.url} alt={att.name} className="w-full object-cover rounded-2xl" />
      {att.name && <p className="text-white/30 text-xs text-center mt-2">{att.name}</p>}
    </div>
  );

  return null;
}

export default function BlogPost() {
  const { slug }          = useParams();
  const [blog, setBlog]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const res  = await fetch(`${BASE_URL}/api/blogs/${slug}`);
        const data = await res.json();
        if (!res.ok || !data.blog) { setNotFound(true); return; }
        setBlog(data.blog);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
      <p className="text-white/50 text-xl">Article not found.</p>
      <Link to="/blog" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
    </div>
  );

  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const images     = blog.attachments?.filter(a => a.type === 'image') || [];
  const videos     = blog.attachments?.filter(a => a.type === 'video') || [];
  const pdfs       = blog.attachments?.filter(a => a.type === 'pdf')   || [];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-900/15 blur-[120px] pointer-events-none rounded-full" />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24 relative z-10">

        {/* Back */}
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Category */}
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">{blog.category}</p>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">{blog.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${BADGE_COLORS[blog.badge] || 'bg-white/10 text-white/60'}`}>
            {blog.badge}
          </span>
          <span className="flex items-center gap-1.5 text-white/40 text-sm">
            <Clock className="w-3.5 h-3.5" /> {blog.readTime} min read
          </span>
          {date && (
            <span className="flex items-center gap-1.5 text-white/40 text-sm">
              <Calendar className="w-3.5 h-3.5" /> {date}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-white/40 text-sm">
            <Eye className="w-3.5 h-3.5" /> {blog.views} views
          </span>
          <span className="text-white/40 text-sm">By {blog.author}</span>
        </div>

        {/* Hero Thumbnail */}
        {blog.thumbnail && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={blog.thumbnail} alt={blog.title} className="w-full object-cover max-h-96" />
          </div>
        )}

        {/* Content */}
        {blog.content && (
          <div className="prose prose-invert prose-lg max-w-none mb-10
            prose-headings:text-white prose-p:text-white/65 prose-p:leading-relaxed
            prose-a:text-indigo-400 prose-strong:text-white prose-code:text-indigo-300
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
            prose-blockquote:border-indigo-500 prose-blockquote:text-white/60
            prose-li:text-white/65"
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
          />
        )}

        {/* Video Attachments */}
        {videos.length > 0 && (
          <div className="mb-10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-400" /> Videos
            </h3>
            <div className="space-y-4">
              {videos.map((v, i) => <AttachmentCard key={i} att={v} />)}
            </div>
          </div>
        )}

        {/* Image Attachments */}
        {images.length > 0 && (
          <div className="mb-10">
            <h3 className="text-white font-semibold mb-4">Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((img, i) => <AttachmentCard key={i} att={img} />)}
            </div>
          </div>
        )}

        {/* PDF Attachments */}
        {pdfs.length > 0 && (
          <div className="mb-10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" /> Downloads
            </h3>
            <div className="space-y-3">
              {pdfs.map((p, i) => <AttachmentCard key={i} att={p} />)}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/5">
            {blog.tags.map((t, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] text-white/40 text-xs border border-white/5">
                <Tag className="w-3 h-3" /> {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
