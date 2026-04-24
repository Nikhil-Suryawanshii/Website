import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar }        from './components/Navbar.jsx';
import { Hero }          from './components/Hero.jsx';
import { Services }      from './components/Services.jsx';
import { Transform }     from './components/Transform.jsx';
import { Reviews }       from './components/Reviews.jsx';
import { Booking }       from './components/Booking.jsx';
import { CalendlyModal } from './components/CalendlyModal.jsx';
import { Footer }        from './components/Footer.jsx';
import AdminPage         from './pages/admin/AdminPage.jsx';
import About             from './pages/About.jsx';
import CaseStudies       from './pages/CaseStudies.jsx';
import Blog              from './pages/Blog.jsx';
import BlogPost          from './pages/BlogPost.jsx';
import LeaveReview       from './pages/LeaveReview.jsx';

function MainSite() {
  const [calendlyUrl, setCalendlyUrl] = useState(null);
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none animate-pulse-glow delay-300" />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Transform />
        <Reviews />
        <Booking onBook={(url) => setCalendlyUrl(url)} />
      </main>
      <Footer />
      {calendlyUrl && <CalendlyModal url={calendlyUrl} onClose={() => setCalendlyUrl(null)} />}
    </div>
  );
}

function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans overflow-x-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*"      element={<AdminPage />} />
      <Route path="/leave-review" element={<LeaveReview />} />
      <Route path="/about"        element={<PageLayout><About /></PageLayout>} />
      <Route path="/case-studies" element={<PageLayout><CaseStudies /></PageLayout>} />
      <Route path="/blog/:slug"   element={<PageLayout><BlogPost /></PageLayout>} />
      <Route path="/blog"         element={<PageLayout><Blog /></PageLayout>} />
      <Route path="/*"            element={<MainSite />} />
    </Routes>
  );
}
