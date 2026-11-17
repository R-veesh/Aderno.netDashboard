import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, AlertTriangle, ShieldCheck, Edit3, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BudgetManagement() {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newAllocated, setNewAllocated] = useState('');
  const [loading, setLoading] = useState(false);

  const loadBudgets = async () => {
    const data = await api.getBudgets();
    setBudgets(data);
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBudget || !newAllocated) return;
    setLoading(true);
    await api.updateBudget(editingBudget.id, newAllocated);
    setLoading(false);
    setEditingBudget(null);
    loadBudgets();
  };

  const totalAllocated = budgets.reduce((acc, b) => acc + Number(b.allocated || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent || 0), 0);
  const remaining = totalAllocated - totalSpent;

  const canEdit = ['Administrator', 'Finance Officer'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              MODULE 04
            </span>
            <span className="text-xs font-mono text-slate-500">FISCAL CYCLE: Q4-2026</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Budget Allocation & Ceiling Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Enforce departmental spending caps, adjust fiscal allocations, and prevent runaway purchasing.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-mono flex items-center gap-4">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">TOTAL CAP</span>
            <span className="text-slate-900 font-extrabold">${totalAllocated.toLocaleString()}</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">REMAINING HEADROOM</span>
            <span className="text-emerald-600 font-extrabold">${remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const spent = Number(b.spent || 0);
          const allocated = Number(b.allocated || 0);
          const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
          const isCritical = pct >= 90;

          return (
            <div 
              key={b.id} 
              className={`glass-panel p-5 rounded-2xl space-y-4 hover:shadow-md transition-shadow relative overflow-hidden ${
                isCritical ? 'border-t-4 border-t-[#FF5E1E]' : 'border-t-4 border-t-[#0038FF]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0038FF] bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20">
                    {b.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900 mt-1.5">{b.department}</h3>
                </div>
                {canEdit && (
                  <button
                    onClick={() => {
                      setEditingBudget(b);
                      setNewAllocated(b.allocated);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0038FF] hover:bg-slate-100 transition-colors"
                    title="Edit Allocation Cap"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress and Numbers */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Utilization:</span>
                  <span className={`font-bold ${isCritical ? 'text-[#FF5E1E]' : 'text-slate-900'}`}>{pct}%</span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-[#FF5E1E]' : 'bg-[#0038FF]'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs font-mono pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">SPENT</span>
                    <span className="text-slate-900 font-bold">${spent.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">LIMIT</span>
                    <span className="text-slate-900 font-bold">${allocated.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {isCritical && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-mono text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Threshold alert: &gt;90% of cap exhausted.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Budget Ceiling Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setEditingBudget(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-mono text-[#0038FF] bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase">
                CAP ADJUSTMENT
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
                Update Budget Limit
              </h2>
              <p className="text-xs text-slate-500">{editingBudget.department}</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Total Allocation (USD) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newAllocated}
                  onChange={(e) => setNewAllocated(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-[#0038FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="btn-secondary-cyber text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-cyber text-xs py-2 px-5"
                >
                  {loading ? 'Saving...' : 'Apply Cap Limit &rarr;'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
