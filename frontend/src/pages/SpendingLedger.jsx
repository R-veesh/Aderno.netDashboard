import React, { useState, useEffect } from 'react';
import { Receipt, Search, Download, CheckCircle2, ArrowDownRight } from 'lucide-react';
import { api } from '../services/api';

export default function SpendingLedger() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await api.getTransactions();
      setTransactions(data);
    }
    loadData();
  }, []);

  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaid = transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["TXN_ID,PO_REF,VENDOR,DESCRIPTION,AMOUNT,CATEGORY,DEPARTMENT,DATE,STATUS"]
      .concat(transactions.map(t => `${t.id},${t.poId},"${t.vendor}","${t.description}",${t.amount},${t.category},${t.department},${t.date},${t.status}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aderno_spend_ledger_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded border border-[#FF5E1E]/30 font-bold uppercase">
              MODULE 05
            </span>
            <span className="text-xs font-mono text-slate-400">TOTAL DISBURSED: ${totalPaid.toLocaleString()}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Procurement Spending Ledger
          </h1>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white hover:bg-white/10 transition-colors"
        >
          <Download className="w-4 h-4 text-[#00F0FF]" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions by TXN ID, vendor, or scope..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5E1E]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#05070B] border-b border-white/10 text-slate-400">
                <th className="py-3 px-4">TXN_ID</th>
                <th className="py-3 px-4">PO_REF</th>
                <th className="py-3 px-4">VENDOR</th>
                <th className="py-3 px-4">ITEM / SCOPE</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4 text-right">SETTLED AMOUNT</th>
                <th className="py-3 px-4 text-center">DATE</th>
                <th className="py-3 px-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{t.id}</td>
                  <td className="py-3.5 px-4 text-[#FF5E1E]">{t.poId}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-200 font-medium">{t.vendor}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs truncate">{t.description}</td>
                  <td className="py-3.5 px-4 text-slate-400">{t.department}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">${Number(t.amount).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{t.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.status}
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
