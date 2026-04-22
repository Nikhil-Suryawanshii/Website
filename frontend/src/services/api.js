const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Token helpers
export const getToken = () => localStorage.getItem('agentic_token');
export const setToken = (token) => localStorage.setItem('agentic_token', token);
export const removeToken = () => localStorage.removeItem('agentic_token');

// Core fetch wrapper
async function apiFetch(path, options = {}) {
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

// Services API
export const servicesApi = {
  getAll:    () => apiFetch('/api/services'),
  getBySlug: (slug) => apiFetch(`/api/services/${slug}`),
};

// Bookings API
export const bookingsApi = {
  create: (payload) =>
    apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }),
};

// Auth API
export const authApi = {
  login:    (payload) => apiFetch('/api/auth/login',    { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me:       ()        => apiFetch('/api/auth/me'),
};
