import React, { useState, useEffect } from 'react';
import { Bot, ShoppingCart, Building2, Lightbulb, Users, PenTool, ChevronRight } from 'lucide-react';
import { useServices } from '../hooks/useServices.js';

const ICON_MAP = {
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  Building2:    <Building2 className="w-6 h-6" />,
  Bot:          <Bot className="w-6 h-6" />,
  PenTool:      <PenTool className="w-6 h-6" />,
  Users:        <Users className="w-6 h-6" />,
  Lightbulb:    <Lightbulb className="w-6 h-6" />,
};

function ServiceCard({ service, isActive, onClick }) {
  const icon = ICON_MAP[service.iconName] ?? <Bot className="w-6 h-6" />;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 md:p-6 rounded-2xl border transition-all duration-200 ${
        isActive
          ? 'bg-indigo-500/15 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
          : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/50'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm md:text-base truncate transition-colors ${isActive ? 'text-white' : 'text-white/70'}`}>
            {service.title}
          </p>
          <p className="text-xs text-white/40 mt-0.5 truncate">{service.badge}</p>
        </div>
        <ChevronRight className={`w-4 h-4 shrink-0 transition-all ${isActive ? 'text-indigo-400 translate-x-0.5' : 'text-white/20'}`} />
      </div>
    </button>
  );
}

export function Services() {
  const { services, loading } = useServices();
  const [activeSlug, setActiveSlug] = useState('');

  useEffect(() => {
    if (services.length > 0 && !activeSlug) {
      setActiveSlug(services[0].slug);
    }
  }, [services]);

  const active = services.find(s => s.slug === activeSlug) ?? services[0];

  return (
    <section id="services" className="py-16 md:py-32 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 animate-pulse">
            <div className="lg:col-span-1 space-y-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/[0.03]" />)}
            </div>
            <div className="lg:col-span-2 h-[400px] rounded-3xl bg-white/[0.03]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-start">

            {/* Service List */}
            <div className="lg:col-span-1 space-y-2 md:space-y-3">
              {services.map(svc => (
                <ServiceCard
                  key={svc.slug}
                  service={svc}
                  isActive={svc.slug === activeSlug}
                  onClick={() => setActiveSlug(svc.slug)}
                />
              ))}
            </div>

            {/* Service Detail */}
            {active && (
              <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
                  {active.badge}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{active.title}</h3>
                <p className="text-white/60 text-base md:text-lg mb-6 md:mb-10 leading-relaxed">{active.solution}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
        )}
      </div>
    </section>
  );
}
