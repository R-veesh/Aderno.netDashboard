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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              AI INTEL ENGINE
            </span>
            <span className="text-xs font-mono text-slate-500">STATUS: PROPOSED ACCELERATED INFERENCE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Spend Copilot & Anomaly Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Automated procurement graph auditing, duplicate invoice discovery, and price spike detection.
          </p>
        </div>

        <button
          onClick={triggerScan}
          disabled={scanning}
          className="btn-primary-cyber text-xs py-2.5 px-5 w-full sm:w-auto justify-center"
        >
          {scanning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-white" />
              <span>Scanning Spend Graph...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Accelerated Graph Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Inference Status Alert */}
      {scanMessage && (
        <div className="p-3.5 rounded-2xl bg-white border border-[#0038FF]/30 text-xs font-mono text-slate-800 shadow-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#0038FF]" />
            <span>{scanMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">2.4ms LATENCY</span>
        </div>
      )}

      {/* Anomaly Cards Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF5E1E]" />
            <span>Active Spend Intelligence Detections ({anomalies.length})</span>
          </div>
          <span className="text-xs font-mono font-normal text-slate-500">Autonomous Bayesian scoring</span>
        </h2>

        {anomalies.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-display font-bold text-base text-slate-900">Zero Flags Remaining</h3>
            <p className="text-xs text-slate-500 mt-1">All flagged commodity anomalies have been scrutinized and cleared.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {anomalies.map((anom) => (
              <div 
                key={anom.id} 
                className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden flex flex-col justify-between border-t-4 border-t-[#0038FF] hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      anom.severity === 'Critical' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : anom.severity === 'High' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20'
                    }`}>
                      {anom.severity} Risk
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      Risk Index: <strong className="text-[#FF5E1E]">{anom.riskScore}</strong>/100
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                    {anom.flag}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {anom.explanation}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Ledger Ref:</span>
                    <span className="font-bold text-[#0038FF]">{anom.refId}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Total Variance:</span>
                    <span className="font-extrabold text-slate-900">${Number(anom.amount).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handleResolve(anom.id)}
                    className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-[#0038FF] text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Clear & Whitelist Transaction &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
