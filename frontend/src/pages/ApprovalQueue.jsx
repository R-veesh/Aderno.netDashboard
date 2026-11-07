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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-bold uppercase">
              MODULE 06
            </span>
            <span className="text-xs font-mono text-slate-400">PENDING AUDIT: {requests.length} ITEMS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Procurement Approval Queue & Governance
          </h1>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Authorized Signoff: <strong className="text-white">{currentUser.role}</strong></span>
        </div>
      </div>

      {/* Pending Items */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Awaiting Authorization Signoff</span>
        </h2>

        {requests.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 font-mono text-xs">
            Zero pending requisitions requiring your approval tier.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((r) => (
              <div key={r.id} className="glass-panel-glow p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#FF5E1E]">{r.id}</span>
                    <span className="text-xs text-slate-400 font-mono">[{r.department}]</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      r.priority === 'High' || r.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/30 text-slate-300'
                    }`}>
                      {r.priority} Priority
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white">{r.title}</h3>
                  <p className="text-xs text-slate-300">Requester: <strong className="text-white">{r.requester}</strong> &bull; Estimated Amount: <strong className="text-[#00F0FF]">${Number(r.estimatedCost).toLocaleString()}</strong></p>
                </div>

                {canApprove ? (
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <button
                      onClick={() => handleDecision(r.id, 'Rejected')}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleDecision(r.id, 'Approved')}
                      disabled={loading}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorize Signoff</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg">
                    Signoff restricted to Managers & Finance
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Audit Trail */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Historical Governance Audit Log</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#05070B] border-b border-white/10 text-slate-400">
                <th className="py-3 px-4">LOG_ID</th>
                <th className="py-3 px-4">REQUISITION</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">ACTOR / AUTHORIZER</th>
                <th className="py-3 px-4">AUDIT COMMENTARY</th>
                <th className="py-3 px-4 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-bold text-slate-400">{l.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#FF5E1E]">{l.reqId}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.action === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white">{l.actor}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans max-w-sm truncate">{l.comment}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">{l.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
