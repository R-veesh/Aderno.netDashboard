import React, { useState } from 'react';
import { Menu, Bell, Search, Plus, Sparkles, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header({ setMobileOpen }) {
  const { currentUser } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Duplicate Invoice Warning', time: '2m ago', type: 'alert', text: 'OmniFreight freight manifest matched PO-7711' },
    { id: 2, title: 'Budget Threshold Notice', time: '1h ago', type: 'warn', text: 'Global Marketing is at 93.8% utilization' },
    { id: 3, title: 'New Requisition Pending', time: '3h ago', type: 'info', text: 'Alex Vance submitted REQ-1042 for H100 cluster' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#080A0F]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">LIVE_CLUSTER //</span>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">app.aderno.net</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Quick New Requisition Button */}
        <Link
          to="/requests"
          className="btn-orange text-xs py-1.5 px-3 shadow-md shadow-[#FF5E1E]/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Request</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white relative hover:border-[#00F0FF]/40 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5E1E]"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0D111A] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className="font-display font-bold text-xs text-white uppercase tracking-wider">Operational Notifications</span>
                <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded">3 NEW</span>
              </div>

              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">{n.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 text-center">
                <Link
                  to="/ai-intelligence"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-mono text-[#00F0FF] hover:underline"
                >
                  View AI Spend Copilot Alerts &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Chip */}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="text-right leading-tight">
            <span className="text-xs font-bold text-white block">{currentUser.name}</span>
            <span className="text-[10px] font-mono text-slate-400">{currentUser.role}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#FF5E1E]/20 text-[#FF5E1E] font-mono font-bold text-xs flex items-center justify-center border border-[#FF5E1E]/30">
            {currentUser.avatar}
          </div>
        </div>

      </div>

    </header>
  );
}
