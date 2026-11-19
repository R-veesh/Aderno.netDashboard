import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  PieChart, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Sparkles,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardOverview() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [reqs, sups, bdgs, anoms] = await Promise.all([
        api.getRequests(),
        api.getSuppliers(),
        api.getBudgets(),
        api.getAiAnomalies()
      ]);
      setRequests(reqs);
      setSuppliers(sups);
      setBudgets(bdgs);
      setAnomalies(anoms);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalAllocated = budgets.reduce((acc, b) => acc + Number(b.allocated || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent || 0), 0);
  const utilizationPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const pendingCount = requests.filter(r => r.status === 'Pending Approval').length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Procurement Intelligence Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time spend orchestration, dynamic budget guardrails, and automated supplier intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-intelligence"
            className="btn-secondary-cyber text-xs py-2 px-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0038FF]" />
            <span>AI Copilot Active ({anomalies.length} Flags)</span>
          </Link>
          <Link
            to="/requests"
            className="btn-primary-cyber text-xs py-2 px-5"
          >
            <span>+ Create Requisition</span>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Spent */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-4 border-t-[#0038FF] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">TOTAL SPENT YTD</span>
            <div className="w-8 h-8 rounded-lg bg-[#0038FF]/10 text-[#0038FF] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            ${(totalSpent).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-emerald-600 font-mono flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
            <span>vs previous fiscal cycle</span>
          </div>
        </div>

        {/* KPI 2: Budget Allocated */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">BUDGET ALLOCATED</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            ${(totalAllocated).toLocaleString()}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 mb-1.5 overflow-hidden">
            <div 
              className="bg-[#0038FF] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
            />
          </div>
          <div className="text-xs font-mono text-slate-500 flex justify-between">
            <span>Utilization:</span>
            <span className="font-bold text-slate-900">{utilizationPct}% Cap Reached</span>
          </div>
        </div>

        {/* KPI 3: Requisitions in Pipe */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-4 border-t-[#FF5E1E] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">REQUISITIONS</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF5E1E]/10 text-[#FF5E1E] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {requests.length} Requests
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5E1E]/10 text-[#FF5E1E]">
              {pendingCount} Pending Signoff
            </span>
          </div>
        </div>

        {/* KPI 4: Active Suppliers */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-4 border-t-[#00F0FF] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 tracking-wider">SUPPLIER REGISTRY</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            {suppliers.length} Certified
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-emerald-600 font-mono font-bold">100% Tax Compliant</span>
            <span>& SOC-2 audited</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Departmental Budgets & AI Anomaly Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Department Spend & Utilization Guardrails (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Departmental Budget Guardrails
              </h2>
              <p className="text-xs text-slate-500">Live spend allocation vs defined ceiling constraints</p>
            </div>
            <Link to="/budgets" className="text-xs font-mono text-[#0038FF] font-bold hover:underline flex items-center gap-1">
              <span>Manage Budgets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {budgets.map((b) => {
              const spent = Number(b.spent || 0);
              const allocated = Number(b.allocated || 0);
              const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
              const isOver = pct >= 90;

              return (
                <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{b.department}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">Category: {b.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        ${spent.toLocaleString()} <span className="text-slate-400">/ ${allocated.toLocaleString()}</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold block ${isOver ? 'text-[#FF5E1E]' : 'text-emerald-600'}`}>
                        {pct}% Allocated
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isOver ? 'bg-[#FF5E1E]' : 'bg-[#0038FF]'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Spend Intelligence Copilot Alerts (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0038FF]/10 text-[#0038FF] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  AI Spend Intelligence
                </h2>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">ACCELERATED TENSOR SCAN // ACTIVE</span>
              </div>
            </div>
            <Link to="/ai-intelligence" className="text-xs font-mono text-[#0038FF] font-bold hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {anomalies.map((anom) => (
              <div 
                key={anom.id} 
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0038FF]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    anom.severity === 'Critical' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : anom.severity === 'High' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20'
                  }`}>
                    {anom.severity} • {anom.flag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Score: {anom.riskScore}/100</span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-2">
                  {anom.explanation}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] font-mono">
                  <span className="text-slate-500">Ref: {anom.refId}</span>
                  <span className="font-bold text-slate-900">${Number(anom.amount).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/ai-intelligence"
              className="btn-primary-cyber text-xs py-2 px-5 w-full justify-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Copilot Spend Graph</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Procurement Requisitions Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Recent Procurement Requisitions
            </h2>
            <p className="text-xs text-slate-500">Tracking incoming departmental requests, approvals, and order dispatch</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/requests" className="btn-secondary-cyber text-xs py-1.5 px-3.5">
              <span>View All Requisitions</span>
            </Link>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">REQ ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {requests.slice(0, 6).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#0038FF]">
                    {r.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {r.title}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {r.department}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ${Number(r.estimatedCost || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      r.priority === 'Critical' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : r.priority === 'High' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      r.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : r.status === 'Pending Approval' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : r.status === 'Under Review'
                        ? 'bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/requests"
                      className="font-mono text-xs text-[#0038FF] font-bold hover:underline"
                    >
                      Audit &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
