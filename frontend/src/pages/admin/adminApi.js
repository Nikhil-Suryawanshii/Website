import { getToken } from '../../services/api.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function adminFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

export const adminApi = {
  // ── Bookings ──────────────────────────────────────────────────────
  getBookings:   (params = {}) => { const q = new URLSearchParams(params).toString(); return adminFetch(`/api/bookings${q ? '?' + q : ''}`); },
  getStats:      ()            => adminFetch('/api/bookings/stats'),
  updateBooking: (id, body)    => adminFetch(`/api/bookings/${id}`,    { method: 'PUT',    body: JSON.stringify(body) }),
  deleteBooking: (id)          => adminFetch(`/api/bookings/${id}`,    { method: 'DELETE' }),

  // ── Services ──────────────────────────────────────────────────────
  getServices:   ()            => adminFetch('/api/services'),
  updateService: (slug, body)  => adminFetch(`/api/services/${slug}`,  { method: 'PUT',    body: JSON.stringify(body) }),

  // ── Case Studies ──────────────────────────────────────────────────
  getCaseStudies:  ()          => adminFetch('/api/case-studies'),
  createCaseStudy: (body)      => adminFetch('/api/case-studies',       { method: 'POST',   body: JSON.stringify(body) }),
  updateCaseStudy: (id, body)  => adminFetch(`/api/case-studies/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
  deleteCaseStudy: (id)        => adminFetch(`/api/case-studies/${id}`, { method: 'DELETE' }),

  // ── About ─────────────────────────────────────────────────────────
  getAbout:      ()            => adminFetch('/api/about'),
  updateAbout:   (body)        => adminFetch('/api/about',              { method: 'PUT',    body: JSON.stringify(body) }),

  // ── Blogs ─────────────────────────────────────────────────────────
  getBlogs:      ()            => adminFetch('/api/blogs/all'),
  createBlog:    (body)        => adminFetch('/api/blogs',              { method: 'POST',   body: JSON.stringify(body) }),
  updateBlog:    (id, body)    => adminFetch(`/api/blogs/${id}`,        { method: 'PUT',    body: JSON.stringify(body) }),
  deleteBlog:    (id)          => adminFetch(`/api/blogs/${id}`,        { method: 'DELETE' }),

  // ── Reviews ───────────────────────────────────────────────────────
  getReviews:    (params = {}) => { const q = new URLSearchParams(params).toString(); return adminFetch(`/api/reviews/all${q ? '?' + q : ''}`); },
  updateReview:  (id, body)    => adminFetch(`/api/reviews/${id}`,      { method: 'PUT',    body: JSON.stringify(body) }),
  deleteReview:  (id)          => adminFetch(`/api/reviews/${id}`,      { method: 'DELETE' }),

  // ── Users ─────────────────────────────────────────────────────────
  getUsers:      ()            => adminFetch('/api/auth/users'),
};
