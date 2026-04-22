import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 md:py-14 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="text-white/70 font-semibold tracking-tight">
            Agentic<span className="text-white/30">OS</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-white/40">
          <a href="#services"  className="hover:text-white/70 transition-colors">Solutions</a>
          <a href="#transform" className="hover:text-white/70 transition-colors">Transformation</a>
          <a href="#booking"   className="hover:text-white/70 transition-colors">Book a Call</a>
        </div>

        {/* Copyright */}
        <p className="text-white/25 text-xs text-center md:text-right">
          © {new Date().getFullYear()} AgenticOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
