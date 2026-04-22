import { getToken } from '../../services/api.js';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

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
  // Bookings
  getBookings: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return adminFetch(`/api/bookings${q ? '?' + q : ''}`);
  },
  getStats:      ()           => adminFetch('/api/bookings/stats'),
  updateBooking: (id, body)   => adminFetch(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBooking: (id)         => adminFetch(`/api/bookings/${id}`, { method: 'DELETE' }),

  // Services
  getServices:   ()           => adminFetch('/api/services'),
  updateService: (slug, body) => adminFetch(`/api/services/${slug}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Users
  getUsers: () => adminFetch('/api/auth/users'),
};
