import React from 'react';
import { Zap, TrendingUp, BarChart3, Clock, PieChart, Plug } from 'lucide-react';

const transformData = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: 'Work Smarter, Not Harder',
    subtitle: 'Intelligent Automation',
    desc: 'Deploy AI agents that automate repetitive tasks, streamline workflows, and free your team to focus on strategic initiatives. Achieve 10x productivity gains.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    title: 'Expand Without Limits',
    subtitle: 'Scalable Growth',
    desc: 'Our agentic solutions grow with your business. Handle 100x more operations without proportional cost increases. Scale confidently into new markets.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
    title: 'Predict, Don\'t React',
    subtitle: 'Data-Driven Insights',
    desc: 'Harness AI-powered analytics to uncover hidden patterns, predict trends, and make decisions backed by real-time intelligence. Turn data into competitive advantage.',
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-400" />,
    title: 'Always-On Excellence',
    subtitle: '24/7 AI Agents',
    desc: 'Never miss an opportunity. Our AI agents work around the clock, providing instant responses, processing requests, and managing operations while you sleep.',
  },
  {
    icon: <PieChart className="w-6 h-6 text-emerald-400" />,
    title: 'Invest Smart, Earn More',
    subtitle: 'Maximize ROI',
    desc: 'Reduce operational costs by up to 70% while increasing output quality. Our clients see ROI within 3-6 months. Transform expenses into investments.',
  },
  {
    icon: <Plug className="w-6 h-6 text-pink-400" />,
    title: 'Plug & Play Power',
    subtitle: 'Seamless Integration',
    desc: 'Connect with your existing tools effortlessly. Our solutions integrate with 1000+ platforms, ensuring minimal disruption and maximum value from day one.',
  },
];

export function Transform() {
  return (
    <section id="transform" className="py-16 md:py-32 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-medium mb-4">
            Why AgenticOS
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Transform How You Operate
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            Every agent we deploy is engineered to deliver measurable results from day one
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {transformData.map((item, i) => (
            <div
              key={i}
              className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
            >
              <div className="p-3 rounded-xl bg-white/5 w-fit mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">{item.subtitle}</p>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
