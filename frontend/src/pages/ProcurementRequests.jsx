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
    const comment = prompt(`Enter optional audit comment for setting ${id} to ${newStatus}:`, '');
    await api.updateRequestStatus(id, newStatus, `${currentUser.name} (${currentUser.role})`, comment || '');
    if (selectedReq) setSelectedReq(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#FF5E1E] bg-[#FF5E1E]/10 px-2 py-0.5 rounded border border-[#FF5E1E]/30 font-bold uppercase">
              MODULE 01
            </span>
            <span className="text-xs font-mono text-slate-400">TOTAL: {requests.length} REQUISITIONS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Procurement Request Management
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-orange text-xs py-2.5 px-5 shadow-lg shadow-[#FF5E1E]/20 self-start sm:self-auto"
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
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-mono bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F0FF]"
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
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-mono bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00F0FF]"
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

      {/* Requests Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#05070B] border-b border-white/10 text-slate-400">
                <th className="py-3 px-4">REQ_ID</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4">PURCHASE ITEM</th>
                <th className="py-3 px-4">REQUESTER</th>
                <th className="py-3 px-4 text-right">EST. COST</th>
                <th className="py-3 px-4 text-center">PRIORITY</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No procurement requests match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#FF5E1E]">{req.id}</td>
                    <td className="py-3.5 px-4 text-slate-300">{req.department}</td>
                    <td className="py-3.5 px-4 font-sans text-white font-medium max-w-xs truncate">{req.title}</td>
                    <td className="py-3.5 px-4 text-slate-400">{req.requester}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      ${Number(req.estimatedCost).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        req.priority === 'Urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        req.priority === 'High' ? 'bg-[#FF5E1E]/20 text-[#FF5E1E] border border-[#FF5E1E]/30' :
                        'bg-slate-700/40 text-slate-300'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        req.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        req.status === 'Under Review' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' :
                        'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                        {req.status === 'Pending Approval' && <Clock className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canApprove && req.status === 'Pending Approval' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, 'Approved')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              title="Approve Request"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'Rejected')}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                              title="Reject Request"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-xl p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-[10px] font-mono text-[#FF5E1E] uppercase tracking-wider block">NEW PROCUREMENT REQUISITION</span>
                <h3 className="font-display text-xl font-bold text-white">Create Purchase Request</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Item or Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5x High-Density SAS Storage Enclosures"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  >
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Corporate IT">Corporate IT</option>
                    <option value="Operations & Fleet">Operations & Fleet</option>
                    <option value="Global Marketing">Global Marketing</option>
                    <option value="Facilities & Logistics">Facilities & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Hardware & IoT">Hardware & IoT</option>
                    <option value="Software & SaaS">Software & SaaS</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Estimated Cost (USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="25000"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Business Justification</label>
                <textarea
                  rows="3"
                  placeholder="Describe operational need and consequence of delay..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF5E1E]"
                ></textarea>
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
                  {loading ? 'Submitting...' : 'Submit Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow w-full max-w-lg p-6 sm:p-8 rounded-3xl relative animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider block">{selectedReq.id}</span>
                <h3 className="font-display text-xl font-bold text-white">{selectedReq.title}</h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">DEPARTMENT</span>
                <span className="text-white font-bold">{selectedReq.department}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">ESTIMATED COST</span>
                <span className="text-[#FF5E1E] font-bold text-sm">${Number(selectedReq.estimatedCost).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">REQUESTER</span>
                <span className="text-white">{selectedReq.requester}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[10px]">STATUS</span>
                <span className="text-emerald-400 font-bold">{selectedReq.status}</span>
              </div>
            </div>

            {selectedReq.description && (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                <span className="text-slate-400 font-mono text-[10px] block mb-1">JUSTIFICATION</span>
                <p className="text-slate-300 leading-relaxed">{selectedReq.description}</p>
              </div>
            )}

            {canApprove && selectedReq.status === 'Pending Approval' && (
              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => handleStatusChange(selectedReq.id, 'Rejected')}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-mono hover:bg-red-500/20"
                >
                  Reject Requisition
                </button>
                <button
                  onClick={() => handleStatusChange(selectedReq.id, 'Approved')}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs font-mono hover:bg-emerald-400"
                >
                  Approve Requisition
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
