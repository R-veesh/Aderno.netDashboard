import React from 'react';
import { Settings, ShieldCheck, Database, Server, Lock, User, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">CONFIGURATION</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          System Settings & Platform Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Profile Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5E1E]/20 text-[#FF5E1E] font-mono font-bold text-xl flex items-center justify-center border border-[#FF5E1E]/30">
              {currentUser.avatar}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">{currentUser.name}</h2>
              <span className="text-xs font-mono text-[#00F0FF]">{currentUser.role}</span>
              <span className="text-[11px] text-slate-400 block font-mono">{currentUser.email}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-400">
              <span>Department:</span>
              <span className="text-white">{currentUser.department}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-400">
              <span>Access Level:</span>
              <span className="text-emerald-400 font-bold">Authenticated Bearer</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-400">
              <span>Tenant Environment:</span>
              <span className="text-white">aderno.net (Enterprise Prod)</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">ASSIGNED ROLE CAPABILITIES</span>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.permissions.map((p, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-slate-300">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Backend & Deployment Status */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-5">
          <div className="pb-4 border-b border-white/10">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-[#FF5E1E]" />
              <span>Full-Stack Architecture Diagnostics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Verified environment configuration for app.aderno.net</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-slate-300">Frontend Client:</span>
              </div>
              <span className="text-white">React 19 / Vite SPA (Subdomain Gateway)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-slate-300">REST Service Layer:</span>
              </div>
              <span className="text-white">PHP / Laravel 11 REST API</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-slate-300">Relational Database:</span>
              </div>
              <span className="text-white">SQLite Relational Engine</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#00F0FF]"></div>
                <span className="text-slate-300">Proposed AI Framework:</span>
              </div>
              <span className="text-[#00F0FF]">NVIDIA NeMo & NIM Microservices</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">Production Maintenance Policy:</strong>
            All transaction states, approval timestamps, and vendor scorecards are persisted under transactional ACID guarantees. Requisitions cannot be purged once dispatched to a Purchase Order.
          </div>
        </div>

      </div>

    </div>
  );
}
