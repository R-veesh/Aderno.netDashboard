import React, { useState, useEffect } from 'react';
import { CheckSquare, Check, X, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ApprovalQueue() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [reqs, lg] = await Promise.all([
      api.getRequests(),
      api.getApprovalLogs()
    ]);
    setRequests(reqs.filter(r => r.status === 'Pending Approval'));
    setLogs(lg);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (id, decision) => {
    const comment = prompt(`Enter optional audit reason for ${decision} ${id}:`, '');
    setLoading(true);
    await api.updateRequestStatus(id, decision, `${currentUser.name} (${currentUser.role})`, comment || '');
    setLoading(false);
    loadData();
  };

  const canApprove = ['Administrator', 'Procurement Manager', 'Finance Officer'].includes(currentUser.role);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              MODULE 06
            </span>
            <span className="text-xs font-mono text-slate-500">PENDING AUDIT: {requests.length} ITEMS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement Approval Queue & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Multilevel signoff controls and cryptographic audit log for high-value procurement requests.
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600">Authorized Signoff: <strong className="text-slate-900">{currentUser.role}</strong></span>
        </div>
      </div>

      {/* Pending Items */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF5E1E]" />
          <span>Pending Approver Attention</span>
        </h2>

        {requests.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl">
            <span className="text-emerald-600 font-mono text-sm font-bold block mb-1">
              ✓ All Approvals Cleared
            </span>
            <p className="text-xs text-slate-500">No requisitions currently awaiting signoff in your authorization queue.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div 
                key={r.id} 
                className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#FF5E1E] hover:shadow-md transition-shadow"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0038FF]">{r.id}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-900">{r.title}</span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      r.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {r.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{r.description}</p>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-1">
                    <span>Department: <strong className="text-slate-800">{r.department}</strong></span>
                    <span>Requester: <strong className="text-slate-800">{r.requester}</strong></span>
                    <span>Est. Cost: <strong className="text-slate-900 font-bold">${Number(r.estimatedCost).toLocaleString()}</strong></span>
                  </div>
                </div>

                {canApprove ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDecision(r.id, 'Approved')}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleDecision(r.id, 'Rejected')}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-slate-400 italic">
                    Requires Admin/Finance Signoff
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Audit Logs */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Governance & Decision Audit Trail
        </h2>
        
        <div className="space-y-3 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  log.action === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {log.action}
                </span>
                <span className="font-bold text-[#0038FF]">{log.requestId}</span>
                <span className="text-slate-700">{log.approver}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                <span className="italic">{log.notes}</span>
                <span className="text-slate-400">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
