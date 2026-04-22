import React, { useState, useEffect, useRef } from 'react';
import { Bot, ShoppingCart, Building2, Lightbulb, Users, PenTool, ChevronRight, ChevronDown } from 'lucide-react';
import { useServices } from '../hooks/useServices.js';

const ICON_MAP = {
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Building2:    <Building2   className="w-5 h-5" />,
  Bot:          <Bot         className="w-5 h-5" />,
  PenTool:      <PenTool     className="w-5 h-5" />,
  Users:        <Users       className="w-5 h-5" />,
  Lightbulb:    <Lightbulb   className="w-5 h-5" />,
};

/* ── Mobile Accordion Card ──────────────────────────────────────── */
function MobileServiceCard({ service, isOpen, onToggle }) {
  const icon    = ICON_MAP[service.iconName] ?? <Bot className="w-5 h-5" />;
  const bodyRef = useRef(null);

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isOpen ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/5'
    }`}>
      {/* Header */}
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left">
        <div className={`p-2 rounded-xl shrink-0 transition-colors ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/50'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm transition-colors ${isOpen ? 'text-white' : 'text-white/70'}`}>{service.title}</p>
          <p className="text-white/35 text-xs mt-0.5">{service.badge}</p>
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-all duration-300 ${isOpen ? 'text-indigo-400 rotate-180' : 'text-white/20'}`} />
      </button>

      {/* Expandable Detail */}
      <div
        ref={bodyRef}
        className={`transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ overflow: 'hidden' }}
      >
        <div className="px-4 pb-5 border-t border-white/5">
          <p className="text-white/60 text-sm leading-relaxed my-4">{service.solution}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.features.map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <p className="text-white font-semibold text-xs mb-0.5">{f.title}</p>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desktop Two-Column Card ────────────────────────────────────── */
function DesktopServiceCard({ service, isActive, onClick }) {
  const icon = ICON_MAP[service.iconName] ?? <Bot className="w-6 h-6" />;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-200 ${
        isActive
          ? 'bg-indigo-500/15 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
          : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/50'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate transition-colors ${isActive ? 'text-white' : 'text-white/70'}`}>
            {service.title}
          </p>
          <p className="text-white/35 text-xs mt-0.5 truncate">{service.badge}</p>
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${isActive ? 'text-indigo-400 translate-x-0.5' : 'text-white/20'}`} />
      </div>
    </button>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export function Services() {
  const { services, loading } = useServices();
  const [activeSlug, setActiveSlug] = useState('');
  const [openSlug, setOpenSlug]     = useState('');   // mobile accordion

  useEffect(() => {
    if (services.length > 0) {
      if (!activeSlug) setActiveSlug(services[0].slug);
      if (!openSlug)   setOpenSlug(services[0].slug);
    }
  }, [services]);

  const active = services.find(s => s.slug === activeSlug) ?? services[0];

  const toggleMobile = (slug) => setOpenSlug(o => o === slug ? '' : slug);

  return (
    <section id="services" className="py-16 md:py-32 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-medium mb-4">
            Our Solutions
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            AI Agents for Every Function
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            Industry-specific automation that plugs directly into your operations
          </p>
        </div>

        {loading && services.length === 0 ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/[0.03]" />)}
          </div>
        ) : (
          <>
            {/* ── MOBILE: Accordion ──────────────────────────────── */}
            <div className="flex flex-col gap-3 lg:hidden">
              {services.map(svc => (
                <MobileServiceCard
                  key={svc.slug}
                  service={svc}
                  isOpen={openSlug === svc.slug}
                  onToggle={() => toggleMobile(svc.slug)}
                />
              ))}
            </div>

            {/* ── DESKTOP: Two Column ────────────────────────────── */}
            <div className="hidden lg:grid grid-cols-3 gap-8 items-start">
              {/* Left list */}
              <div className="col-span-1 space-y-2">
                {services.map(svc => (
                  <DesktopServiceCard
                    key={svc.slug}
                    service={svc}
                    isActive={svc.slug === activeSlug}
                    onClick={() => setActiveSlug(svc.slug)}
                  />
                ))}
              </div>

              {/* Right detail */}
              {active && (
                <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8 sticky top-28">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-5">
                    {active.badge}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{active.title}</h3>
                  <p className="text-white/60 text-base md:text-lg mb-8 leading-relaxed">{active.solution}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {active.features.map((f, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all group">
                        <p className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-300 transition-colors">{f.title}</p>
                        <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
