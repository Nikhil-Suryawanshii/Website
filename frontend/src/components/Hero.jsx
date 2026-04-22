import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-52 md:pb-32 px-4 sm:px-6 overflow-hidden border-b border-white/5">
      <div className="max-w-5xl mx-auto text-center relative z-10">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-medium mb-6 md:mb-8 animate-fade-in-up">
          <Sparkles className="w-3 h-3" />
          <span>The Execution Gap is Closed</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 md:mb-8 animate-fade-in-up delay-100 leading-[1.1] md:leading-[1.1]">
          Stop Managing Tasks. <br className="hidden md:block" />
          Start Scaling Revenue with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            AI Agents.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 animate-fade-in-up delay-200 leading-relaxed px-2">
          We deploy intelligent AI agents that autonomously handle complex business operations
          with unprecedented precision and efficiency. You're not buying software; you're buying your time back.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300 w-full sm:w-auto px-2">
          <a
            href="#booking"
            className="w-full sm:w-auto px-6 md:px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
          >
            Book Your Free Systems Audit <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto px-6 md:px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all text-sm md:text-base text-center"
          >
            Explore Architecture
          </a>
        </div>
      </div>

      {/* Ambient rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] md:h-[400px] opacity-20 pointer-events-none -z-10 animate-float">
        <div className="absolute inset-0 border border-white/10 rounded-full scale-[1.5]" />
        <div className="absolute inset-0 border border-indigo-500/20 rounded-full scale-[1.2] animate-pulse" />
        <div className="absolute inset-0 border border-cyan-500/30 rounded-full" />
      </div>
    </section>
  );
}
