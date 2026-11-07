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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
              {currentUser.role} View
            </span>
            <span className="text-xs font-mono text-slate-400">SESSION ID: #ADR-2026-9041</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Procurement Intelligence Command
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-intelligence"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:border-[#00F0FF] hover:text-[#00F0FF] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>AI Copilot Active ({anomalies.length} Flags)</span>
          </Link>
          <Link
            to="/requests"
            className="btn-orange text-xs py-2 px-4 shadow-lg shadow-[#FF5E1E]/20"
          >
            <span>+ Create Requisition</span>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Spent */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-2 border-t-[#FF5E1E]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 tracking-wider">TOTAL SPENT YTD</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF5E1E]/10 text-[#FF5E1E] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
            ${(totalSpent).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-400 font-mono flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> 8.4%
            </span>
            <span className="text-slate-400 font-sans">Budget Cap: ${(totalAllocated).toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 2: Budget Utilization */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-2 border-t-[#00F0FF]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 tracking-wider">BUDGET UTILIZATION</span>
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
            {utilizationPct}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00F0FF] to-[#3B82F6] rounded-full" style={{ width: `${utilizationPct}%` }}></div>
          </div>
        </div>

        {/* KPI 3: Supplier Rating */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-2 border-t-emerald-400">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 tracking-wider">SUPPLIER RELIABILITY</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
            96.2%
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-mono font-medium">{suppliers.length} Active</span>
            <span>Registered Vendors</span>
          </div>
        </div>

        {/* KPI 4: Pending Approvals */}
        <div className="glass-panel p-5 rounded-2xl relative border-t-2 border-t-amber-400">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-400 tracking-wider">PENDING APPROVALS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
            {pendingCount} Requisitions
          </div>
          <div className="text-xs text-amber-400 font-mono flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Requires signoff</span>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid: Spend Burn by Department & Anomaly Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Department Spend Burn Progress */}
        <div className="lg:col-span-7 glass-panel-glow p-6 sm:p-7 rounded-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">FISCAL Q4-2026</span>
              <h3 className="font-display text-lg font-bold text-white">Departmental Budget Allocation</h3>
            </div>
            <Link to="/budgets" className="text-xs font-mono text-[#00F0FF] hover:underline">
              Manage Budgets &rarr;
            </Link>
          </div>

          <div className="space-y-5">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.allocated) * 100);
              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-bold text-slate-200">{b.department}</span>
                    <span className="font-mono text-slate-400">
                      <strong className="text-white">${b.spent.toLocaleString()}</strong> / ${b.allocated.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 90 ? 'bg-red-500' :
                        pct > 75 ? 'bg-amber-500' :
                        'bg-gradient-to-r from-[#00F0FF] to-[#3B82F6]'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Anomaly & Fraud Flags */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5E1E]" />
                <h3 className="font-display text-lg font-bold text-white">AI Spend Intelligence Flags</h3>
              </div>
              <span className="text-[10px] font-mono text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded font-bold">
                {anomalies.length} ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {anomalies.map((a) => (
                <div key={a.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      a.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      a.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {a.severity} Severity
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{a.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{a.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{a.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 text-center">
            <Link to="/ai-intelligence" className="text-xs font-mono text-[#00F0FF] hover:underline flex items-center justify-center gap-1">
              <span>Access Neural Anomaly Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Procurement Requests Stream */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">AUDITED WORKFLOWS</span>
            <h3 className="font-display text-xl font-bold text-white">Recent Purchase Requests</h3>
          </div>
          <Link to="/requests" className="text-xs font-mono text-[#00F0FF] hover:underline">
            View All Requisitions &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 pb-3">
                <th className="py-3 px-3">REQ_ID</th>
                <th className="py-3 px-3">DEPARTMENT</th>
                <th className="py-3 px-3">PURCHASE ITEM</th>
                <th className="py-3 px-3">REQUESTER</th>
                <th className="py-3 px-3 text-right">EST. COST</th>
                <th className="py-3 px-3 text-center">PRIORITY</th>
                <th className="py-3 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {requests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[#FF5E1E]">{req.id}</td>
                  <td className="py-3.5 px-3 text-slate-200">{req.department}</td>
                  <td className="py-3.5 px-3 font-sans text-white font-medium">{req.title}</td>
                  <td className="py-3.5 px-3 text-slate-400">{req.requester}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">${Number(req.estimatedCost).toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      req.priority === 'Urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      req.priority === 'High' ? 'bg-[#FF5E1E]/20 text-[#FF5E1E] border border-[#FF5E1E]/30' :
                      'bg-slate-700/40 text-slate-300'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${
                      req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      req.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      req.status === 'Under Review' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' :
                      'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === 'Pending Approval' && <Clock className="w-3 h-3" />}
                      {req.status}
                    </span>
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
