import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  UserCheck,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Command Overview', icon: LayoutDashboard },
    { to: '/requests', label: 'Procurement Requests', icon: FileText, badge: '6' },
    { to: '/suppliers', label: 'Supplier Registry', icon: Users },
    { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingBag },
    { to: '/budgets', label: 'Budget Allocation', icon: PieChart },
    { to: '/spending', label: 'Spending Ledger', icon: Receipt },
    { to: '/approvals', label: 'Approval Queue', icon: CheckSquare, badge: '3', badgeColor: 'bg-[#FF5E1E] text-white' },
    { to: '/ai-intelligence', label: 'AI Spend Copilot', icon: Sparkles, highlight: true },
    { to: '/settings', label: 'System & Audit Logs', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 shadow-xs flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Brand Logo */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img 
                src="/aderno-logo.svg" 
                alt="Aderno Logo" 
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="px-3 pt-3 pb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 px-3">
              PLATFORM NAVIGATION
            </span>
          </div>

          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0038FF] text-white shadow-md shadow-[#0038FF]/25 font-bold'
                      : item.highlight
                      ? 'text-[#0038FF] hover:bg-[#0038FF]/10 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Active User & Fast Role Switcher & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-3 bg-[#F8FAFC]">
          
          {/* User Card */}
          {currentUser && (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-lg object-cover border border-[#0038FF]/20 shadow-xs shrink-0" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                    {currentUser.avatar || 'SA'}
                  </div>
                )}
                <div className="leading-tight min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">{currentUser.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 block truncate">{currentUser.email || currentUser.role}</span>
                </div>
              </div>
              {currentUser.isDemo ? (
                <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase">
                  DEMO
                </span>
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
              )}
            </div>
          )}

          {/* Actions: Sign Out & External Link */}
          <div className="pt-1 flex items-center justify-between border-t border-slate-200/80">
            <a
              href="https://aderno.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-[#0038FF] transition-colors"
            >
              <span>aderno.net</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-[11px] font-mono text-rose-600 hover:text-rose-700 font-bold transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

      </aside>
    </>
  );
}
