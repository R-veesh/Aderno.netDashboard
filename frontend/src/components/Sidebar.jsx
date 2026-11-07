import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShoppingBag, 
  PieChart, 
  Receipt, 
  CheckSquare, 
  Sparkles, 
  Settings, 
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, switchRole, USERS } = useAuth();

  const navLinks = [
    { to: '/', label: 'Command Overview', icon: LayoutDashboard },
    { to: '/requests', label: 'Procurement Requests', icon: FileText, badge: '6' },
    { to: '/suppliers', label: 'Supplier Registry', icon: Users },
    { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingBag },
    { to: '/budgets', label: 'Budget Allocation', icon: PieChart },
    { to: '/spending', label: 'Spending Ledger', icon: Receipt },
    { to: '/approvals', label: 'Approval Queue', icon: CheckSquare, badge: '3', badgeColor: 'bg-[#FF5E1E]' },
    { to: '/ai-intelligence', label: 'AI Spend Copilot', icon: Sparkles, highlight: true },
    { to: '/settings', label: 'System & Audit Logs', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0D14] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Brand Logo */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A1E29] to-[#0A0D14] border border-[#00F0FF]/40 flex items-center justify-center shadow-lg shadow-[#00F0FF]/20">
                <span className="font-tech text-[#00F0FF] text-lg font-bold">A</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg text-white tracking-tight">ADERNO</span>
                  <span className="text-[10px] font-mono bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 px-1 rounded font-semibold">APP</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">PROCUREMENT OS</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF5E1E] text-white shadow-lg shadow-[#FF5E1E]/25 font-semibold'
                      : item.highlight
                      ? 'text-[#00F0FF] hover:bg-[#00F0FF]/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-white/10'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Active User & Fast Role Switcher */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#07090E]">
          
          {/* User Card */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF5E1E]/20 text-[#FF5E1E] border border-[#FF5E1E]/30 font-bold font-mono text-xs flex items-center justify-center">
                {currentUser.avatar}
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{currentUser.role}</span>
              </div>
            </div>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Quick Role Switcher (For Evaluation & QA) */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
              FAST ROLE SWITCHER
            </label>
            <select
              value={currentUser.roleKey}
              onChange={(e) => switchRole(e.target.value)}
              className="w-full text-xs font-mono bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="admin">Admin: David Vance</option>
              <option value="procurement">Procurement: Sarah Jenkins</option>
              <option value="finance">Finance: Marcus Sterling</option>
              <option value="department">Dept User: Elena Rostova</option>
            </select>
          </div>

          {/* Back to Public Website Link */}
          <a
            href="https://aderno.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-[#00F0FF] transition-colors pt-1"
          >
            <span>Visit aderno.net</span>
            <ExternalLink className="w-3 h-3" />
          </a>

        </div>

      </aside>
    </>
  );
}
