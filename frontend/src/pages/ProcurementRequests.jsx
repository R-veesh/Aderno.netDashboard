import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProcurementRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [loading, setLoading] = useState(false);

  // New Request Form State
  const [formData, setFormData] = useState({
    title: '',
    department: currentUser.department || 'Engineering & Technology',
    category: 'Hardware & IoT',
    estimatedCost: '',
    priority: 'Normal',
    description: '',
    requester: currentUser.name,
    requesterEmail: currentUser.email
  });

  const loadRequests = async () => {
    const data = await api.getRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.estimatedCost) return;
    setLoading(true);
    await api.createRequest({
      ...formData,
      estimatedCost: Number(formData.estimatedCost)
    });
    setLoading(false);
    setIsModalOpen(false);
    setFormData({
      title: '',
      department: currentUser.department || 'Engineering & Technology',
      category: 'Hardware & IoT',
      estimatedCost: '',
      priority: 'Normal',
      description: '',
      requester: currentUser.name,
      requesterEmail: currentUser.email
    });
    loadRequests();
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    await api.updateRequestStatus(id, newStatus, currentUser.name, `Manual action by ${currentUser.name}`);
    setLoading(false);
    setSelectedReq(null);
    loadRequests();
  };

  const filtered = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchDept = deptFilter === 'ALL' || r.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const canApprove = ['Administrator', 'Procurement Manager', 'Finance Officer'].includes(currentUser.role);

  return (
    <div className="space-y-6">
      
      {/* Header & New Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#0038FF] bg-[#0038FF]/10 px-3 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase tracking-wider">
              MODULE 01
            </span>
            <span className="text-xs font-mono text-slate-500">TOTAL: {requests.length} REQUISITIONS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement Request Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Initiate, track, and approve corporate purchasing requisitions with autonomous audit trails.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary-cyber text-xs py-2.5 px-5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by REQ code, item description, or requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white transition-all shadow-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0038FF] focus:bg-white shadow-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0038FF] focus:bg-white shadow-xs"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering & Technology">Engineering</option>
            <option value="Corporate IT">Corporate IT</option>
            <option value="Operations & Fleet">Operations</option>
            <option value="Global Marketing">Marketing</option>
            <option value="Facilities & Logistics">Facilities</option>
          </select>
        </div>

      </div>

      {/* Requisitions Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">REQ ID</th>
                <th className="py-3.5 px-4">Title & Description</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Est. Cost</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 font-mono">
                    No procurement requisitions match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0038FF]">
                      {r.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{r.title}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{r.description}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {r.department}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{r.requester}</span>
                      <span className="text-[10px] font-mono text-slate-400">{r.requesterEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${Number(r.estimatedCost || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        r.priority === 'Critical' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : r.priority === 'High' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        r.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : r.status === 'Pending Approval' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : r.status === 'Under Review'
                          ? 'bg-[#0038FF]/10 text-[#0038FF] border border-[#0038FF]/20'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReq(r)}
                        className="btn-secondary-cyber text-xs py-1 px-3 shadow-none"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Requisition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#0038FF] bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20 font-bold uppercase">
                NEW REQUISITION
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Create Procurement Request
              </h2>
              <p className="text-xs text-slate-500">Requires budget ceiling verification and approver signoff.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Item Title / Project Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5x NVIDIA Tensor-Core H100 GPU Nodes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  >
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Corporate IT">Corporate IT</option>
                    <option value="Operations & Fleet">Operations & Fleet</option>
                    <option value="Global Marketing">Global Marketing</option>
                    <option value="Facilities & Logistics">Facilities & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  >
                    <option value="Hardware & IoT">Hardware & IoT</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="SaaS & Tooling">SaaS & Tooling</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Office & Facilities">Office & Facilities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Cost (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 45000"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0038FF]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Technical Justification & Vendor Notes</label>
                <textarea
                  rows="3"
                  placeholder="Provide scope, quotes or justification for budget approval..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038FF] focus:bg-white"
                />
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
                  {loading ? 'Submitting Requisition...' : 'Submit Requisition &rarr;'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Requisition Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-[#0038FF] bg-[#0038FF]/10 px-2 py-0.5 rounded-full border border-[#0038FF]/20 font-bold">
                AUDIT LOG // {selectedReq.id}
              </span>
              <h2 className="font-display text-xl font-bold text-slate-900 mt-1">
                {selectedReq.title}
              </h2>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-900">{selectedReq.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Cost:</span>
                <span className="font-bold text-[#0038FF]">${Number(selectedReq.estimatedCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requester:</span>
                <span className="font-bold text-slate-900">{selectedReq.requester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-slate-900">{selectedReq.status}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 font-sans text-slate-600 leading-relaxed">
                <span className="font-mono text-slate-400 block text-[10px] uppercase font-bold">Justification Scope:</span>
                {selectedReq.description}
              </div>
            </div>

            {canApprove && selectedReq.status === 'Pending Approval' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStatusChange(selectedReq.id, 'Approved')}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Requisition</span>
                </button>
                <button
                  onClick={() => handleStatusChange(selectedReq.id, 'Rejected')}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Request</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
