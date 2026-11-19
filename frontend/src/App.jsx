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
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex selection:bg-[#CCFF00] selection:text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <img src="/aderno-logo.svg" alt="Aderno" className="h-10 w-auto animate-pulse mb-3" />
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
        <img src="/aderno-logo.svg" alt="Aderno" className="h-11 w-auto animate-pulse mb-3" />
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
