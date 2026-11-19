import React from 'react';
import { Settings, ShieldCheck, Database, Server, Lock, User, Terminal, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { currentUser, firebaseUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
            CONFIGURATION
          </span>
          {currentUser?.roleKey === 'superadmin' && (
            <span className="text-xs font-mono text-white bg-[#0038FF] px-2.5 py-0.5 rounded-full font-bold">
              SUPER ADMIN CONSOLE
            </span>
          )}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Settings & Platform Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review tenant connection details, Firebase active identity credentials, and cryptographic system environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User Profile Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.name} 
                className="w-14 h-14 rounded-2xl object-cover border border-[#0038FF]/30 shadow-sm" 
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#0038FF]/10 text-[#0038FF] font-mono font-bold text-xl flex items-center justify-center border border-[#0038FF]/20">
                {currentUser?.avatar || 'SA'}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-slate-900 truncate">{currentUser?.name}</h2>
              <span className="text-xs font-mono font-bold text-[#0038FF] block">{currentUser?.role}</span>
              <span className="text-[11px] text-slate-500 block font-mono truncate">{currentUser?.email}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Department:</span>
              <span className="text-slate-900 font-bold">{currentUser?.department}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Access Level:</span>
              <span className="text-emerald-700 font-bold">
                {currentUser?.roleKey === 'superadmin' ? 'Super Admin Master' : 'Authenticated Bearer'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Auth Provider:</span>
              <span className="text-slate-900 font-bold">
                {firebaseUser ? (firebaseUser.providerData[0]?.providerId || 'Firebase Auth') : 'Enterprise Local Session'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Tenant Project ID:</span>
              <span className="text-slate-900 font-bold">aderno-ff9b0</span>
            </div>
            {currentUser?.id && (
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Subject UID:</span>
                <span className="text-slate-500 font-mono text-[10px] truncate max-w-[170px]">{currentUser.id}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-2">
              ASSIGNED ROLE CAPABILITIES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentUser?.permissions?.map((p, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 font-semibold">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold font-mono transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>

        {/* System & Architecture Info */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <Server className="w-5 h-5 text-[#0038FF]" />
              <h2 className="font-display text-base font-bold text-slate-900">Topology & Environment Context</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">AUTHENTICATION SERVICE</span>
                <span className="text-slate-900 font-bold">Google Firebase Auth (v11)</span>
                <span className="text-emerald-600 block text-[10px]">aderno-ff9b0.firebaseapp.com</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">FRONTEND ARCHITECTURE</span>
                <span className="text-slate-900 font-bold">React 19 & Vite 6 (Tailwind v4)</span>
                <span className="text-emerald-600 block text-[10px]">app.aderno.net SPA Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">SERVICE LAYER</span>
                <span className="text-slate-900 font-bold">PHP 8.2 / REST Controller</span>
                <span className="text-[#0038FF] block text-[10px]">FastCGI / Nginx Reverse Proxy</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">PUBLIC WEB SHOWCASE</span>
                <span className="text-slate-900 font-bold">https://aderno.net</span>
                <span className="text-emerald-600 block text-[10px]">SSL TLS 1.3 Certified</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <span className="font-display font-bold text-sm text-slate-900 block">Cryptographic Audit Enforcement</span>
                <span className="text-xs text-slate-500">Every requisition decision is cryptographically signed and stored.</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              Active
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
