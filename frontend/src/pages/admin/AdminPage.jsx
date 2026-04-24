import React, { useState, useEffect } from 'react';
import AdminLogin      from './AdminLogin.jsx';
import AdminSidebar    from './AdminSidebar.jsx';
import DashboardTab    from './DashboardTab.jsx';
import BookingsTab     from './BookingsTab.jsx';
import BlogTab         from './BlogTab.jsx';
import ReviewsTab      from './ReviewsTab.jsx';
import ServicesTab     from './ServicesTab.jsx';
import CaseStudiesTab  from './CaseStudiesTab.jsx';
import AboutTab        from './AboutTab.jsx';
import UsersTab        from './UsersTab.jsx';
import { Menu }        from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TAB_LABELS = {
  dashboard:   'Dashboard',
  bookings:    'Bookings',
  blog:        'Blog Posts',
  reviews:     'Reviews',
  services:    'Services',
  caseStudies: 'Case Studies',
  about:       'About Page',
  users:       'Users',
};

export default function AdminPage() {
  const [user, setUser]               = useState(null);
  const [checking, setChecking]       = useState(true);
  const [tab, setTab]                 = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingReviews, setPendingReviews] = useState(0);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem('agentic_token');
    if (!token) { setChecking(false); return; }
    (async () => {
      try {
        const res  = await fetch(`${BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.user?.role === 'admin') { setUser(data.user); }
        else { localStorage.removeItem('agentic_token'); }
      } catch { localStorage.removeItem('agentic_token'); }
      finally { setChecking(false); }
    })();
  }, []);

  // Poll pending reviews count
  useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem('agentic_token');
        const res   = await fetch(`${BASE_URL}/api/reviews/all?status=pending`, { headers: { Authorization: `Bearer ${token}` } });
        const data  = await res.json();
        setPendingReviews(data.count || 0);
      } catch {}
    };
    fetchPending();
    const interval = setInterval(fetchPending, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => { localStorage.removeItem('agentic_token'); setUser(null); setTab('dashboard'); };
  const handleNav    = (key) => { setTab(key); setSidebarOpen(false); };

  if (checking) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <AdminLogin onLogin={setUser} />;

  const TABS = {
    dashboard:   <DashboardTab />,
    bookings:    <BookingsTab />,
    blog:        <BlogTab />,
    reviews:     <ReviewsTab />,
    services:    <ServicesTab />,
    caseStudies: <CaseStudiesTab />,
    about:       <AboutTab />,
    users:       <UsersTab />,
  };

  return (
    <div className="min-h-screen bg-[#060609] flex">

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          active={tab} onNav={setTab} user={user}
          onLogout={handleLogout} pendingReviews={pendingReviews}
        />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-60 shrink-0 z-50">
            <AdminSidebar
              active={tab} onNav={handleNav} user={user}
              onLogout={handleLogout} pendingReviews={pendingReviews}
            />
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-[#07070d] shrink-0">
          <button className="lg:hidden p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-white/70 text-sm font-medium">{TAB_LABELS[tab]}</h1>
          </div>
          {pendingReviews > 0 && tab !== 'reviews' && (
            <button onClick={() => setTab('reviews')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-medium hover:bg-yellow-500/25 transition-colors">
              ⭐ {pendingReviews} pending review{pendingReviews > 1 ? 's' : ''}
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-[9px] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-white/60 text-xs hidden sm:block">{user.name}</span>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {TABS[tab]}
        </main>
      </div>
    </div>
  );
}
