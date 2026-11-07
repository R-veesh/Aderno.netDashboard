import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Search, Truck, CheckCircle, Clock, Eye, X } from 'lucide-react';
import { api } from '../services/api';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    reqId: 'REQ-1042',
    supplierName: 'Apex Tensor Systems Ltd',
    totalAmount: '',
    itemsCount: 1,
    deliveryDate: '2026-11-25',
    status: 'Dispatched'
  });

  const loadData = async () => {
    const [pos, sups] = await Promise.all([
      api.getPurchaseOrders(),
      api.getSuppliers()
    ]);
    setOrders(pos);
    setSuppliers(sups);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.totalAmount) return;
    setLoading(true);
    await api.createPurchaseOrder({
      ...formData,
      totalAmount: Number(formData.totalAmount),
      itemsCount: Number(formData.itemsCount)
    });
    setLoading(false);
    setIsModalOpen(false);
    loadData();
  };

  const filtered = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded border border-[#FF5E1E]/30 font-bold uppercase">
              MODULE 03
            </span>
            <span className="text-xs font-mono text-slate-400">TOTAL: {orders.length} PURCHASE ORDERS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Purchase Order Management
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-orange text-xs py-2.5 px-5 shadow-lg shadow-[#FF5E1E]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Purchase Order</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO number, title, or linked supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5E1E]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#05070B] border-b border-white/10 text-slate-400">
                <th className="py-3 px-4">PO_NUMBER</th>
                <th className="py-3 px-4">LINKED_REQ</th>
                <th className="py-3 px-4">SUPPLIER</th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4 text-right">AMOUNT</th>
                <th className="py-3 px-4 text-center">FULFILLMENT</th>
                <th className="py-3 px-4 text-center">PAYMENT</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{po.id}</td>
                  <td className="py-3.5 px-4 text-[#FF5E1E]">{po.reqId}</td>
                  <td className="py-3.5 px-4 text-slate-200 font-sans font-medium">{po.supplierName}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs truncate">{po.title}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-white">${Number(po.totalAmount).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${
                      po.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      po.status === 'Dispatched' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' :
                      'bg-slate-700/30 text-slate-300'
                    }`}>
                      {po.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {po.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPo(po)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Inspect PO"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate PO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-xl p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-mono text-[#FF5E1E] uppercase tracking-wider block">DISPATCH WORKFLOW</span>
                <h3 className="font-display text-xl font-bold text-white">Generate Purchase Order</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">PO Title / Scope *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Workstation NVMe Storage Batch"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Contracted Supplier</label>
                  <select
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Requisition Ref</label>
                  <input
                    type="text"
                    value={formData.reqId}
                    onChange={(e) => setFormData({ ...formData, reqId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Total Cost Amount (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="18000"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Target Delivery Date</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
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
                  className="btn-orange text-xs py-2 px-6"
                >
                  {loading ? 'Generating...' : 'Issue Purchase Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Detail View Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-lg p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#FF5E1E] uppercase tracking-wider block">{selectedPo.id}</span>
                <h3 className="font-display text-xl font-bold text-white">{selectedPo.title}</h3>
              </div>
              <button onClick={() => setSelectedPo(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">SUPPLIER</span>
                <span className="text-white font-bold">{selectedPo.supplierName}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">TOTAL AMOUNT</span>
                <span className="text-[#00F0FF] font-bold text-sm">${Number(selectedPo.totalAmount).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">FULFILLMENT</span>
                <span className="text-emerald-400 font-bold">{selectedPo.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">TARGET DELIVERY</span>
                <span className="text-white">{selectedPo.deliveryDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-400">Payment Status:</span>
              <span className="text-white font-bold">{selectedPo.paymentStatus}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPo(null)}
                className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs font-mono hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
