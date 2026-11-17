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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              MODULE 05
            </span>
            <span className="text-xs font-mono text-slate-500">TOTAL DISBURSED: ${totalPaid.toLocaleString()}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement Spending Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Auditable transaction ledger recording completed vendor disbursements, PO references, and invoices.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn-secondary-cyber text-xs py-2 px-4 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#0038FF]" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Filter */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions by TXN ID, vendor, or line item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white shadow-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">TXN Code</th>
                <th className="py-3.5 px-4">Origin PO</th>
                <th className="py-3.5 px-4">Vendor Recipient</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Settlement Date</th>
                <th className="py-3.5 px-4">Disbursed Amount</th>
                <th className="py-3.5 px-4 text-right">Settlement State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0038FF]">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {t.poId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {t.vendor}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {t.department}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {t.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
                    ${Number(t.amount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t.status}</span>
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
