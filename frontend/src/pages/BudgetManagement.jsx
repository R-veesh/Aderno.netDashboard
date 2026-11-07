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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-bold uppercase">
              MODULE 04
            </span>
            <span className="text-xs font-mono text-slate-400">FISCAL CYCLE: Q4-2026</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Budget Allocation & Ceiling Controls
          </h1>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-[10px] block">TOTAL CAP</span>
            <span className="text-white font-bold">${totalAllocated.toLocaleString()}</span>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-slate-400 text-[10px] block">UNCOMMITTED</span>
            <span className="text-emerald-400 font-bold">${remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          const deptRemaining = b.allocated - b.spent;

          return (
            <div key={b.id} className="glass-panel p-6 rounded-2xl relative border-t-2 border-t-white/20 hover:border-t-[#00F0FF] transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">{b.id}</span>
                    <h3 className="font-display text-lg font-bold text-white">{b.department}</h3>
                    <span className="text-xs text-slate-400 font-mono">Head: {b.manager}</span>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => {
                        setEditingBudget(b);
                        setNewAllocated(b.allocated);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Adjust Allocation"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Burned: <strong className="text-white">${b.spent.toLocaleString()}</strong></span>
                    <span className={`font-bold ${
                      pct > 90 ? 'text-red-400' :
                      pct > 75 ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {pct}% Utilized
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
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
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">AUTHORIZED LIMIT</span>
                  <span className="text-white font-bold">${Number(b.allocated).toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">REMAINING HEADROOM</span>
                  <span className={`font-bold ${deptRemaining < 20000 ? 'text-red-400' : 'text-emerald-400'}`}>
                    ${deptRemaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-md p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block">BUDGET GOVERNANCE</span>
                <h3 className="font-display text-xl font-bold text-white">Adjust Allocation</h3>
              </div>
              <button onClick={() => setEditingBudget(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Target Department:</span>
                <span className="font-bold text-white text-sm">{editingBudget.department}</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">New Allocation Cap (USD) *</label>
                <input
                  type="number"
                  required
                  min={editingBudget.spent}
                  value={newAllocated}
                  onChange={(e) => setNewAllocated(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be at least equal to current commitments (${editingBudget.spent.toLocaleString()}).
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cyan text-xs py-2 px-6"
                >
                  {loading ? 'Saving...' : 'Update Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
