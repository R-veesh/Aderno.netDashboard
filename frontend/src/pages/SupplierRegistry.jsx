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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              MODULE 02
            </span>
            <span className="text-xs font-mono text-slate-500">TOTAL: {suppliers.length} REGISTERED VENDORS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supplier & Vendor Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Maintain authorized enterprise vendor records, performance scores, tax IDs, and payment terms.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary-cyber text-xs py-2.5 px-5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Supplier</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by vendor name, supplier code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white shadow-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0038FF] shadow-xs"
          >
            <option value="ALL">All Categories</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Hardware & Networking">Hardware & Networking</option>
            <option value="Logistics & Warehousing">Logistics & Warehousing</option>
            <option value="Enterprise Software">Enterprise Software</option>
            <option value="Consulting & Audit">Consulting & Audit</option>
          </select>
        </div>

      </div>

      {/* Suppliers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div 
            key={s.id} 
            className="glass-panel p-5 rounded-2xl space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#0038FF] font-bold bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20">
                  {s.code}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 mt-1.5">{s.name}</h3>
                <span className="text-xs text-slate-500">{s.category}</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200 text-xs font-mono font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{s.rating || 4.8}</span>
              </div>
            </div>

            <div className="space-y-2 py-2 border-y border-slate-100 text-xs font-mono text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contact:</span>
                <span className="text-slate-900 font-semibold">{s.contactPerson}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Terms:</span>
                <span className="text-slate-900 font-bold">{s.paymentTerms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tax ID:</span>
                <span className="text-slate-900 font-bold">{s.taxId}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certified Active</span>
              </span>
              <a
                href={`mailto:${s.email}`}
                className="text-xs font-mono text-[#0038FF] font-bold hover:underline flex items-center gap-1"
              >
                <span>Inquire</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#0038FF] bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase">
                NEW ONBOARDING
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Register Authorized Supplier
              </h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Entity Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tensor Systems Ltd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vendor Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VEN-904"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#0038FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Hardware & Networking">Hardware & Networking</option>
                    <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                    <option value="Enterprise Software">Enterprise Software</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Representative</label>
                  <input
                    type="text"
                    placeholder="Enter contact name"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Representative Email</label>
                  <input
                    type="email"
                    placeholder="Enter contact email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tax EIN / VAT ID</label>
                  <input
                    type="text"
                    placeholder="e.g. US-88-29401"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#0038FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary-cyber text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-cyber text-xs py-2 px-5"
                >
                  {loading ? 'Registering...' : 'Register Vendor &rarr;'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
