import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClientLoginModal } from './ClientLoginModal.jsx';
import { getToken, servicesApi } from '../services/api.js';

const SERVICE_ICONS = {
  d2c:         '🛒',
  realestate:  '🏢',
  leadgen:     '🤖',
  content:     '✍️',
  master:      '👥',
  consultancy: '💡',
};

export function Navbar() {
  const [scrolled, setScrolled]               = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [loginOpen, setLoginOpen]             = useState(false);
  const [isLoggedIn, setIsLoggedIn]           = useState(false);
  const [servicesOpen, setServicesOpen]       = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [navServices, setNavServices]         = useState([]);
  const dropdownRef = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    servicesApi.getAll().then(d => setNavServices(d.services || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsLoggedIn(!!getToken()); }, [loginOpen]);
  useEffect(() => { setIsLoggedIn(!!getToken()); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleServiceClick = () => {
    setServicesOpen(false);
    setMobileMenuOpen(false);
    if (isHome) {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  return (
    <header>
      <nav
        aria-label="Main Navigation"
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex justify-between items-center">

          <Link to="/" className="flex items-center gap-2 group cursor-pointer z-50 relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
              A
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              Agentic<span className="text-white/50">OS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(o => !o)}
                className="flex items-center gap-1 hover:text-white transition-colors py-1"
              >
                Solutions
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#0d0d18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2">
                    {navServices.map(svc => (
                      <button
                        key={svc.slug}
                        onClick={handleServiceClick}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                      >
                        <span className="text-base">{SERVICE_ICONS[svc.slug] || '⚡'}</span>
                        <span className="text-white/70 group-hover:text-white text-sm transition-colors">{svc.title}</span>
                      </button>
                    ))}
                    <div className="mt-1 pt-2 border-t border-white/5">
                      <button
                        onClick={() => { setServicesOpen(false); scrollToSection('transform'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-500/10 transition-colors text-left"
                      >
                        <span className="text-base">✨</span>
                        <span className="text-indigo-400 text-sm">Why AgenticOS?</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/case-studies" className={`hover:text-white transition-colors ${location.pathname === '/case-studies' ? 'text-white' : ''}`}>
              Case Studies
            </Link>

            <Link to="/about" className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-white' : ''}`}>
              About
            </Link>

            <button
              onClick={() => setLoginOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
            >
              {isLoggedIn && <User className="w-3.5 h-3.5 text-indigo-400" />}
              {isLoggedIn ? 'My Account' : 'Client Login'}
            </button>
          </div>

          <button
            className="md:hidden p-2 text-white/70 hover:text-white z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-[#050505]/97 backdrop-blur-lg z-40 transition-all duration-300 overflow-y-auto ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="flex flex-col items-center pt-28 pb-12 px-8 min-h-full gap-1">

          <div className="w-full max-w-xs">
            <button
              onClick={() => setMobileServicesOpen(o => !o)}
              className="w-full flex items-center justify-between text-xl text-white/80 hover:text-white font-medium py-3 border-b border-white/5"
            >
              Solutions
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileServicesOpen && (
              <div className="mb-2 rounded-b-2xl bg-white/[0.03] border border-t-0 border-white/5 overflow-hidden">
                {navServices.map(svc => (
                  <button
                    key={svc.slug}
                    onClick={handleServiceClick}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                  >
                    <span>{SERVICE_ICONS[svc.slug] || '⚡'}</span>
                    <span className="text-white/70 text-sm">{svc.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/case-studies"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full max-w-xs text-xl text-white/80 hover:text-white font-medium py-3 border-b border-white/5 text-center"
          >
            Case Studies
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full max-w-xs text-xl text-white/80 hover:text-white font-medium py-3 border-b border-white/5 text-center"
          >
            About
          </Link>

          <button
            onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }}
            className="mt-6 px-8 py-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-medium text-lg flex items-center gap-2"
          >
            {isLoggedIn && <User className="w-4 h-4" />}
            {isLoggedIn ? 'My Account' : 'Client Login'}
          </button>
        </div>
      </div>

      <ClientLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
