import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { ClientLoginModal } from './ClientLoginModal.jsx';
import { getToken } from '../services/api.js';

export function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen]           = useState(false);
  const [isLoggedIn, setIsLoggedIn]         = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, [loginOpen]);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  return (
    <header>
      <nav
        aria-label="Main Navigation"
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer z-50 relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
              A
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              Agentic<span className="text-white/50">OS</span>
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#services" className="hover:text-white transition-colors">Solutions</a>
            <a href="#transform" className="hover:text-white transition-colors">Transformation</a>
            <button
              onClick={() => setLoginOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
            >
              {isLoggedIn && <User className="w-3.5 h-3.5 text-indigo-400" />}
              {isLoggedIn ? 'My Account' : 'Client Login'}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-[#050505]/95 backdrop-blur-lg z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-2xl text-white/80 hover:text-white font-medium">Solutions</a>
          <a href="#transform" onClick={() => setMobileMenuOpen(false)} className="text-2xl text-white/80 hover:text-white font-medium">Transformation</a>
          <button
            onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }}
            className="px-8 py-4 mt-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-medium text-lg flex items-center gap-2"
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
