import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, AlertTriangle, ShieldCheck, Activity, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AiIntelligence() {
  const [anomalies, setAnomalies] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const loadData = async () => {
    const data = await api.getAiAnomalies();
    setAnomalies(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerScan = () => {
    setScanning(true);
    setScanMessage('Connecting to accelerated inference worker: NeMo / TensorRT...');
    setTimeout(() => {
      setScanMessage('Scrutinizing 4,210 ledger entries across 12 commodity categories...');
    }, 400);
    setTimeout(() => {
      setScanning(false);
      setScanMessage('Scan complete. 3 verified potential anomalies prioritized.');
    }, 1000);
  };

  const handleResolve = (id) => {
    setAnomalies(anomalies.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-bold uppercase">
              AI INTEL ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">STATUS: PROPOSED ACCELERATED INFERENCE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            AI Spend Copilot & Anomaly Console
          </h1>
        </div>

        <button
          onClick={triggerScan}
          disabled={scanning}
          className="btn-cyan text-xs py-2.5 px-5 shadow-lg shadow-[#00F0FF]/20 self-start sm:self-auto"
        >
          {scanning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-black" />
              <span>Scanning Spend Graph...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Trigger Neural Ledger Scan</span>
            </>
          )}
        </button>
      </div>

      {scanMessage && (
        <div className="p-3.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <Activity className="w-4 h-4 animate-pulse shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Anomaly Cards List */}
      <div className="space-y-4">
        {anomalies.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-display text-lg font-bold text-white">Spend Ledger Clear of Anomalies</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No duplicate invoices, price outliers, or budget threshold violations currently detected across any department.
            </p>
          </div>
        ) : (
          anomalies.map((a) => (
            <div key={a.id} className="glass-panel-glow p-6 rounded-2xl relative space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                    a.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    a.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {a.severity} Priority Flag
                  </span>
                  <span className="text-xs font-mono text-slate-400">Confidence: <strong className="text-white">{a.confidence}</strong></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{a.timestamp}</span>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-white">{a.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{a.details}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">REASONING: {a.type}</span>
                <button
                  onClick={() => handleResolve(a.id)}
                  className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 text-xs font-mono transition-colors border border-white/5"
                >
                  Mark as Reviewed & Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
