import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AVATAR_GRADIENTS = {
  indigo:  'from-indigo-500 to-purple-600',
  cyan:    'from-cyan-500 to-blue-600',
  purple:  'from-purple-500 to-pink-600',
  emerald: 'from-emerald-500 to-cyan-600',
  pink:    'from-pink-500 to-rose-600',
  orange:  'from-orange-500 to-yellow-600',
};

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const grad = AVATAR_GRADIENTS[review.avatarColor] || AVATAR_GRADIENTS.indigo;
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <StarRow rating={review.rating} />
        <Quote className="w-6 h-6 text-indigo-500/40 shrink-0" />
      </div>
      <p className="text-white/70 text-sm leading-relaxed flex-1 line-clamp-5">
        "{review.review}"
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{review.name}</p>
          {review.role && <p className="text-white/40 text-xs">{review.role}</p>}
          {review.serviceUsed && <p className="text-indigo-400 text-[10px] mt-0.5">{review.serviceUsed}</p>}
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const perPage               = 3;

  useEffect(() => {
    fetch(`${BASE_URL}/api/reviews`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && reviews.length === 0) return null;

  const totalPages = Math.ceil(reviews.length / perPage);
  const visible    = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-xs font-medium mb-4">
            ⭐ Client Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What Our Clients Say
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Real feedback from businesses that deployed AI agents with AgenticOS.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-52 rounded-2xl bg-white/[0.03]" />)}
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {visible.map(r => <ReviewCard key={r._id} review={r} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === page ? 'bg-indigo-400 w-5' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Leave review CTA */}
            <div className="text-center mt-10">
              <a
                href="/leave-review"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm transition-all"
              >
                ✍️ Share Your Experience
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
