import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar }        from './components/Navbar.jsx';
import { Hero }          from './components/Hero.jsx';
import { Services }      from './components/Services.jsx';
import { Transform }     from './components/Transform.jsx';
import { Booking }       from './components/Booking.jsx';
import { CalendlyModal } from './components/CalendlyModal.jsx';
import { Footer }        from './components/Footer.jsx';
import AdminPage         from './pages/admin/AdminPage.jsx';

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
        <Booking onBook={(url) => setCalendlyUrl(url)} />
      </main>
      <Footer />
      {calendlyUrl && (
        <CalendlyModal url={calendlyUrl} onClose={() => setCalendlyUrl(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/*"       element={<MainSite />} />
    </Routes>
  );
}
