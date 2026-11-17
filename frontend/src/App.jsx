import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          </Routes>
        </main>
      </div>
    </div>
  );
}
