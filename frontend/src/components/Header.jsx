import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, Plus, Sparkles, ExternalLink, Check, AlertCircle, LogOut, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ setMobileOpen }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef(null);

  // Operational Notification Items with Interactive State
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Duplicate Invoice Warning', 
      time: '2m ago', 
      type: 'alert', 
      text: 'OmniFreight freight manifest matched PO-7711',
      link: '/spending',
      read: false 
    },
    { 
      id: 2, 
      title: 'Budget Threshold Notice', 
      time: '1h ago', 
      type: 'warn', 
      text: 'Global Marketing is at 93.8% utilization cap',
      link: '/budgets',
      read: false 
    },
    { 
      id: 3, 
      title: 'New Requisition Pending', 
      time: '3h ago', 
      type: 'info', 
      text: 'Alex Vance submitted REQ-1042 for H100 cluster',
      link: '/requests',
      read: false 
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = (e) => {
    e?.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (e, id) => {
    e?.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (link) => {
    setNotificationsOpen(false);
    if (link) navigate(link);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 max-w-full">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">LIVE_CLUSTER //</span>
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] sm:text-xs font-mono font-bold text-emerald-700 truncate">
            app.aderno.net
          </span>
          {currentUser?.roleKey === 'superadmin' && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0038FF] text-white text-[10px] font-mono font-bold tracking-wider">
              SUPER ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {/* Quick New Requisition Button */}
        <Link
          to="/requests"
          className="btn-primary-cyber text-xs py-1.5 px-2.5 sm:py-2 sm:px-3.5 shadow-md shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Request</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 relative hover:border-[#0038FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0038FF]/30"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FF5E1E] ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {notificationsOpen && (
            <>
              {/* Backdrop for seamless closing on mobile and desktop */}
              <div 
                className="fixed inset-0 z-40 bg-slate-900/10 sm:bg-transparent" 
                onClick={() => setNotificationsOpen(false)} 
              />

              <div className="fixed left-3 right-3 top-14 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] font-mono text-[#0038FF] bg-[#0038FF]/10 font-bold px-2 py-0.5 rounded-full border border-[#0038FF]/20">
                        {unreadCount} NEW
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        CAUGHT UP
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-mono text-[#0038FF] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 space-y-1">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">All caught up!</span>
                    <span className="text-[11px] text-slate-400 block font-mono">No new alerts at this time</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => handleNotificationClick(n.link)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                          n.read 
                            ? 'bg-slate-50/50 border-slate-100 opacity-75 hover:bg-slate-50' 
                            : 'bg-slate-50 border-slate-200 hover:bg-blue-50/40 hover:border-[#0038FF]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 text-xs font-bold text-slate-900 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#0038FF] shrink-0"></span>}
                            <span className="truncate">{n.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                            <button
                              type="button"
                              onClick={(e) => removeNotification(e, n.id)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-slate-200/60 transition-colors"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 mt-3 border-t border-slate-200 text-center">
                  <Link
                    to="/ai-intelligence"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-mono text-[#0038FF] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View AI Spend Copilot Alerts</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Identity Chip */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="text-right leading-tight">
              <span className="text-xs font-bold text-slate-900 block truncate max-w-[140px]">{currentUser.name}</span>
              <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[140px]">{currentUser.role}</span>
            </div>
            
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-lg object-cover border border-[#0038FF]/20 shadow-xs" 
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#0038FF]/10 text-[#0038FF] font-mono font-bold text-xs flex items-center justify-center border border-[#0038FF]/20">
                {currentUser.avatar || 'SA'}
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out / Lock Session"
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>

    </header>
  );
}
