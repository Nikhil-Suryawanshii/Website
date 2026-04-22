import { useState, useEffect, useCallback } from 'react';
import { authApi, getToken, setToken, removeToken } from '../services/api.js';

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        const data = await authApi.me();
        setUser(data.user);
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi.login(payload);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi.register(payload);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { user, loading, error, login, register, logout, clearError };
}
