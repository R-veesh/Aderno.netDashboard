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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              MODULE 03
            </span>
            <span className="text-xs font-mono text-slate-500">TOTAL: {orders.length} PURCHASE ORDERS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Purchase Orders & Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Generate and monitor binding purchase orders, delivery statuses, and supplier fulfillment.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary-cyber text-xs py-2.5 px-5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Purchase Order</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PO number, item title, or supplier..."
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
                <th className="py-3.5 px-4">PO Number</th>
                <th className="py-3.5 px-4">Origin REQ</th>
                <th className="py-3.5 px-4">Line Items Title</th>
                <th className="py-3.5 px-4">Vendor Partner</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Delivery SLA</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0038FF]">
                    {po.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {po.reqId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {po.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {po.supplierName}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${Number(po.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {po.deliveryDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      po.status === 'Fulfilled' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : po.status === 'Dispatched' 
                        ? 'bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {po.status === 'Dispatched' && <Truck className="w-3 h-3" />}
                      <span>{po.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPo(po)}
                      className="btn-secondary-cyber text-xs py-1 px-3 shadow-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                PURCHASE ORDER ENGINE
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Generate PO to Vendor
              </h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Purchase Order Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Tier GPU Compute Deployment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Approved Requisition Ref</label>
                  <input
                    type="text"
                    required
                    value={formData.reqId}
                    onChange={(e) => setFormData({ ...formData, reqId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#0038FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Supplier Entity</label>
                  <select
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total PO Amount ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 52000"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#0038FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#0038FF]"
                  />
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
                  {loading ? 'Generating...' : 'Issue Purchase Order &rarr;'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect PO Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedPo(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-[#0038FF] bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20 font-bold">
                PURCHASE ORDER VOUCHER // {selectedPo.id}
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
                {selectedPo.title}
              </h2>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Vendor:</span>
                <span className="font-bold text-slate-900">{selectedPo.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Origin Requisition:</span>
                <span className="font-bold text-[#0038FF]">{selectedPo.reqId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Purchase Value:</span>
                <span className="font-bold text-slate-900">${Number(selectedPo.totalAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery SLA:</span>
                <span className="font-bold text-slate-900">{selectedPo.deliveryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment State:</span>
                <span className="font-bold text-emerald-600">{selectedPo.status}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPo(null)}
              className="btn-primary-cyber text-xs py-2 px-5 w-full justify-center"
            >
              Close Voucher &rarr;
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
