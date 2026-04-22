import React from 'react';
import { LayoutDashboard, Calendar, Layers, Users, LogOut, ExternalLink, ChevronRight, Briefcase, Info } from 'lucide-react';

const NAV = [
  { key: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { key: 'bookings',     label: 'Bookings',     icon: Calendar },
  { key: 'services',     label: 'Services',     icon: Layers },
  { key: 'caseStudies',  label: 'Case Studies', icon: Briefcase },
  { key: 'about',        label: 'About Page',   icon: Info },
  { key: 'users',        label: 'Users',        icon: Users },
];

export default function AdminSidebar({ active, onNav, user, onLogout }) {
  return (
    <aside className="w-60 min-h-screen bg-[#08080f] border-r border-white/5 flex flex-col shrink-0">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <div>
            <p className="text-white font-semibold text-sm">AgenticOS</p>
            <p className="text-white/30 text-[10px]">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNav(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === key
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {active === key && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <a href="/" target="_blank" rel="noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 text-xs transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> View Website
        </a>
        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-white/70 text-xs font-medium truncate">{user?.name}</p>
          <p className="text-white/30 text-[10px] truncate">{user?.email}</p>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 text-xs transition-all">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
