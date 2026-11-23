import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './pages/DashboardOverview';
import ProcurementRequests from './pages/ProcurementRequests';
import SupplierRegistry from './pages/SupplierRegistry';
import PurchaseOrders from './pages/PurchaseOrders';
import BudgetManagement from './pages/BudgetManagement';
import SpendingLedger from './pages/SpendingLedger';
import ApprovalQueue from './pages/ApprovalQueue';
import AiIntelligence from './pages/AiIntelligence';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuth } from './context/AuthContext';

function ProtectedLayout({ mobileOpen, setMobileOpen }) {
  const { currentUser, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#CCFF00] selection:text-slate-900">
      {/* Demo View Indicator Banner */}
      {currentUser?.isDemo && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-900 flex items-center justify-center gap-3 z-40 relative">
          <span className="font-bold uppercase tracking-wider font-mono text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
            DEMO VIEW MODE
          </span>
          <span className="hidden sm:inline">Exploring with sample data. No login keys or credentials saved.</span>
          <button
            onClick={logout}
            className="font-bold underline text-[#0038FF] hover:text-[#0038FF]/80 ml-1"
          >
            Sign In with Real Account &rarr;
          </button>
        </div>
      )}

      <div className="flex-1 flex w-full max-w-full">
        {/* Sidebar Navigation */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full max-w-full">
          <Header setMobileOpen={setMobileOpen} />

          <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/requests" element={<ProcurementRequests />} />
              <Route path="/suppliers" element={<SupplierRegistry />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/budgets" element={<BudgetManagement />} />
              <Route path="/spending" element={<SpendingLedger />} />
              <Route path="/approvals" element={<ApprovalQueue />} />
              <Route path="/ai-intelligence" element={<AiIntelligence />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <img src="/aderno-logo.svg" alt="Aderno" className="h-14 sm:h-16 w-auto animate-pulse mb-3" />
        <span className="text-xs font-mono text-slate-500">Initializing Secure Firebase Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <img src="/aderno-logo.svg" alt="Aderno" className="h-14 sm:h-16 w-auto animate-pulse mb-3" />
        <span className="text-xs font-mono text-slate-500">Connecting to Aderno Firebase Auth Cluster...</span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route 
        path="/*" 
        element={
          <RequireAuth>
            <ProtectedLayout mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </RequireAuth>
        } 
      />
    </Routes>
  );
}
