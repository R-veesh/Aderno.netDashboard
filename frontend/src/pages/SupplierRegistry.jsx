import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Star, ShieldCheck, Mail, Phone, ExternalLink, X } from 'lucide-react';
import { api } from '../services/api';

export default function SupplierRegistry() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Cloud Infrastructure',
    contactPerson: '',
    email: '',
    phone: '',
    taxId: '',
    paymentTerms: 'Net 30',
    status: 'Active'
  });

  const loadSuppliers = async () => {
    const data = await api.getSuppliers();
    setSuppliers(data);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    setLoading(true);
    await api.createSupplier(formData);
    setLoading(false);
    setIsModalOpen(false);
    setFormData({
      name: '',
      code: '',
      category: 'Cloud Infrastructure',
      contactPerson: '',
      email: '',
      phone: '',
      taxId: '',
      paymentTerms: 'Net 30',
      status: 'Active'
    });
    loadSuppliers();
  };

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30 font-bold uppercase">
              MODULE 02
            </span>
            <span className="text-xs font-mono text-slate-400">TOTAL: {suppliers.length} ACTIVE VENDORS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Supplier Registry & Scorecards
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-cyan text-xs py-2.5 px-5 shadow-lg shadow-[#00F0FF]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Vendor</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by legal entity, vendor code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Commodity:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-mono bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F0FF]"
          >
            <option value="ALL">All Categories</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Logistics & Distribution">Logistics & Distribution</option>
            <option value="Software & SaaS">Software & SaaS</option>
            <option value="Hardware & IoT">Hardware & IoT</option>
            <option value="Professional Services">Professional Services</option>
          </select>
        </div>
      </div>

      {/* Supplier Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((sup) => (
          <div key={sup.id} className="glass-panel p-6 rounded-2xl relative group hover:border-[#00F0FF]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-slate-400">{sup.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  sup.status.includes('Preferred') ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30' :
                  sup.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                  'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {sup.status}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-[#00F0FF] transition-colors">
                {sup.name}
              </h3>
              <span className="text-xs text-slate-400 font-mono block mb-4">{sup.category}</span>

              {/* Performance Scorecard */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs mb-4">
                <div>
                  <span className="text-slate-400 text-[10px] block">QUALITY SCORE</span>
                  <span className="text-emerald-400 font-bold">{sup.rating}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ON-TIME DELIVERY</span>
                  <span className="text-white font-bold">{sup.onTimeDeliveryRate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">YTD SPEND</span>
                  <span className="text-[#FF5E1E] font-bold">${Number(sup.ytdSpend).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">TERMS</span>
                  <span className="text-white">{sup.paymentTerms}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{sup.email}</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] ${
                sup.riskLevel === 'Low' || sup.riskLevel === 'Minimal' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                {sup.riskLevel} Risk
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-xl p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block">ONBOARDING PIPELINE</span>
                <h3 className="font-display text-xl font-bold text-white">Register Vendor Entity</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Vendor Legal Entity *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Dynamics Ltd"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Supplier Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="APEX-DYN"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Commodity Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Logistics & Distribution">Logistics & Distribution</option>
                    <option value="Software & SaaS">Software & SaaS</option>
                    <option value="Hardware & IoT">Hardware & IoT</option>
                    <option value="Professional Services">Professional Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="Net 15">Net 15 (2% Discount)</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Contact Representative</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Contact Email</label>
                  <input
                    type="email"
                    placeholder="billing@vendor.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cyan text-xs py-2 px-6"
                >
                  {loading ? 'Registering...' : 'Register Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
