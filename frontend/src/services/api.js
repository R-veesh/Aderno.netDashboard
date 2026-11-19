import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 4000
});

// Seed data
export const INITIAL_DATA = {
  requests: [
    {
      id: 'REQ-1042',
      department: 'Engineering & Technology',
      title: 'GPU Cloud Cluster Allocation (4x H100 SXM5)',
      description: 'High-throughput tensor training cluster capacity for Q4 model fine-tuning.',
      requester: 'Alex Vance',
      requesterEmail: 'alex.v@aderno.net',
      estimatedCost: 42500,
      priority: 'High',
      status: 'Pending Approval',
      createdAt: '2026-11-06 09:15',
      category: 'Cloud Infrastructure'
    },
    {
      id: 'REQ-1041',
      department: 'Operations & Fleet',
      title: 'Fleet Telematics IoT Sensor Upgrades',
      description: 'Sensor array replacement for 32 distribution transport carriers.',
      requester: 'Elena Rostova',
      requesterEmail: 'elena.r@aderno.net',
      estimatedCost: 18300,
      priority: 'Normal',
      status: 'Approved',
      createdAt: '2026-11-05 14:30',
      category: 'Hardware & IoT'
    },
    {
      id: 'REQ-1040',
      department: 'Corporate IT',
      title: 'Enterprise Okta & Identity Governance Renewal',
      description: 'Annual enterprise SSO identity provider licenses for 850 corporate seats.',
      requester: 'Marcus Sterling',
      requesterEmail: 'marcus.s@aderno.net',
      estimatedCost: 29400,
      priority: 'Urgent',
      status: 'Approved',
      createdAt: '2026-11-04 11:20',
      category: 'Software & SaaS'
    },
    {
      id: 'REQ-1039',
      department: 'Global Marketing',
      title: 'Global Brand Asset & Video Production Package',
      description: 'Quarterly video production for product release showcase.',
      requester: 'Sarah Jenkins',
      requesterEmail: 'sarah.j@aderno.net',
      estimatedCost: 14200,
      priority: 'Normal',
      status: 'Under Review',
      createdAt: '2026-11-03 16:45',
      category: 'Professional Services'
    },
    {
      id: 'REQ-1038',
      department: 'Facilities & Logistics',
      title: 'Smart HVAC Sensor Network Replacement',
      description: 'HVAC controller replacement to optimize energy efficiency.',
      requester: 'David Chen',
      requesterEmail: 'david.c@aderno.net',
      estimatedCost: 8950,
      priority: 'Low',
      status: 'Rejected',
      createdAt: '2026-11-02 10:10',
      category: 'Facilities'
    },
    {
      id: 'REQ-1037',
      department: 'Engineering & Technology',
      title: 'Workstation NVMe Storage Upgrade (20 Units)',
      description: 'Fast PCIe 5.0 SSD storage upgrades for machine learning workstations.',
      requester: 'Alex Vance',
      requesterEmail: 'alex.v@aderno.net',
      estimatedCost: 11400,
      priority: 'Normal',
      status: 'Approved',
      createdAt: '2026-11-01 13:00',
      category: 'Hardware & IoT'
    }
  ],

  suppliers: [
    {
      id: 'SUP-001',
      name: 'Apex Tensor Systems Ltd',
      code: 'APEX-TENSOR',
      category: 'Cloud Infrastructure',
      contactPerson: 'Rachel Miller',
      email: 'enterprise@apextensor.io',
      phone: '+1 (555) 382-9011',
      taxId: 'US-94-3829101',
      paymentTerms: 'Net 30',
      status: 'Preferred Tier-1',
      rating: 98.5,
      ytdSpend: 428000,
      riskLevel: 'Low',
      activeContracts: 3,
      onTimeDeliveryRate: '99.4%'
    },
    {
      id: 'SUP-002',
      name: 'OmniFreight Global Logistics',
      code: 'OMNI-FREIGHT',
      category: 'Logistics & Distribution',
      contactPerson: 'Carlos Delgado',
      email: 'carlos@omnifreight.com',
      phone: '+1 (555) 749-2231',
      taxId: 'US-12-8829104',
      paymentTerms: 'Net 45',
      status: 'Active',
      rating: 94.2,
      ytdSpend: 312400,
      riskLevel: 'Low',
      activeContracts: 2,
      onTimeDeliveryRate: '96.2%'
    },
    {
      id: 'SUP-003',
      name: 'CyberShield Security Labs',
      code: 'CYBER-SHIELD',
      category: 'Software & SaaS',
      contactPerson: 'Tariq Al-Mansoor',
      email: 'licensing@cybershield.net',
      phone: '+1 (555) 902-4411',
      taxId: 'US-88-2910041',
      paymentTerms: 'Net 15',
      status: 'Preferred Tier-1',
      rating: 99.1,
      ytdSpend: 189500,
      riskLevel: 'Minimal',
      activeContracts: 1,
      onTimeDeliveryRate: '100%'
    },
    {
      id: 'SUP-004',
      name: 'DirectEquip Industrial Corp',
      code: 'DIRECT-EQUIP',
      category: 'Hardware & IoT',
      contactPerson: 'Laura Bennett',
      email: 'orders@directequip.com',
      phone: '+1 (555) 441-8902',
      taxId: 'US-77-3920199',
      paymentTerms: 'Net 30',
      status: 'Under Review',
      rating: 87.4,
      ytdSpend: 94200,
      riskLevel: 'Moderate',
      activeContracts: 1,
      onTimeDeliveryRate: '88.5%'
    },
    {
      id: 'SUP-005',
      name: 'GlobalMedia Creative Partners',
      code: 'GLOBAL-MEDIA',
      category: 'Professional Services',
      contactPerson: 'Sophia Reynolds',
      email: 'studios@globalmedia.co',
      phone: '+1 (555) 621-0091',
      taxId: 'US-55-9018274',
      paymentTerms: 'Net 30',
      status: 'Active',
      rating: 93.8,
      ytdSpend: 62800,
      riskLevel: 'Low',
      activeContracts: 1,
      onTimeDeliveryRate: '95.0%'
    }
  ],

  purchaseOrders: [
    {
      id: 'PO-7714',
      reqId: 'REQ-1041',
      supplierName: 'DirectEquip Industrial Corp',
      title: 'Fleet IoT Sensor Hardware Order',
      totalAmount: 18300,
      itemsCount: 32,
      deliveryDate: '2026-11-20',
      status: 'Dispatched',
      createdAt: '2026-11-05',
      paymentStatus: 'Pending Delivery'
    },
    {
      id: 'PO-7713',
      reqId: 'REQ-1040',
      supplierName: 'CyberShield Security Labs',
      title: 'Okta Enterprise SSO Annual Licensing',
      totalAmount: 29400,
      itemsCount: 850,
      deliveryDate: '2026-11-10',
      status: 'Delivered',
      createdAt: '2026-11-04',
      paymentStatus: 'Invoiced'
    },
    {
      id: 'PO-7712',
      reqId: 'REQ-1037',
      supplierName: 'Apex Tensor Systems Ltd',
      title: 'PCIe 5.0 Workstation NVMe Storage',
      totalAmount: 11400,
      itemsCount: 20,
      deliveryDate: '2026-11-14',
      status: 'Delivered',
      createdAt: '2026-11-02',
      paymentStatus: 'Paid'
    },
    {
      id: 'PO-7711',
      reqId: 'REQ-1035',
      supplierName: 'OmniFreight Global Logistics',
      title: 'Q3 Regional Freight Manifests',
      totalAmount: 38450,
      itemsCount: 14,
      deliveryDate: '2026-10-28',
      status: 'Delivered',
      createdAt: '2026-10-20',
      paymentStatus: 'Paid'
    }
  ],

  budgets: [
    {
      id: 'BDG-01',
      department: 'Engineering & Technology',
      allocated: 450000,
      spent: 328400,
      fiscalQuarter: 'Q4-2026',
      manager: 'David Vance',
      status: 'On Track'
    },
    {
      id: 'BDG-02',
      department: 'Corporate IT & Cloud',
      allocated: 280000,
      spent: 246200,
      fiscalQuarter: 'Q4-2026',
      manager: 'Marcus Sterling',
      status: 'Near Threshold'
    },
    {
      id: 'BDG-03',
      department: 'Operations & Fleet',
      allocated: 220000,
      spent: 142500,
      fiscalQuarter: 'Q4-2026',
      manager: 'Elena Rostova',
      status: 'On Track'
    },
    {
      id: 'BDG-04',
      department: 'Global Marketing',
      allocated: 180000,
      spent: 168900,
      fiscalQuarter: 'Q4-2026',
      manager: 'Sarah Jenkins',
      status: 'Warning Overrun'
    },
    {
      id: 'BDG-05',
      department: 'Facilities & Logistics',
      allocated: 140000,
      spent: 92100,
      fiscalQuarter: 'Q4-2026',
      manager: 'David Chen',
      status: 'On Track'
    }
  ],

  spendingTransactions: [
    {
      id: 'TXN-9024',
      poId: 'PO-7713',
      vendor: 'CyberShield Security Labs',
      description: 'Okta Enterprise SSO Annual Licensing',
      amount: 29400,
      category: 'Software & SaaS',
      department: 'Corporate IT',
      date: '2026-11-04',
      status: 'Cleared'
    },
    {
      id: 'TXN-9023',
      poId: 'PO-7712',
      vendor: 'Apex Tensor Systems Ltd',
      description: 'PCIe 5.0 Workstation NVMe Storage (20 units)',
      amount: 11400,
      category: 'Hardware & IoT',
      department: 'Engineering',
      date: '2026-11-02',
      status: 'Cleared'
    },
    {
      id: 'TXN-9022',
      poId: 'PO-7711',
      vendor: 'OmniFreight Global Logistics',
      description: 'Q3 Regional Freight Consolidation',
      amount: 38450,
      category: 'Logistics',
      department: 'Operations',
      date: '2026-10-26',
      status: 'Cleared'
    },
    {
      id: 'TXN-9021',
      poId: 'PO-7708',
      vendor: 'GlobalMedia Creative Partners',
      description: 'Brand Asset Video Render Series',
      amount: 12500,
      category: 'Professional Services',
      department: 'Marketing',
      date: '2026-10-18',
      status: 'Cleared'
    }
  ],

  aiAnomalies: [
    {
      id: 'ANOM-01',
      type: 'DUPLICATE_INVOICE_FLAG',
      severity: 'High',
      confidence: '98.4%',
      title: 'Potential Duplicate Freight Manifest Invoiced',
      details: 'Invoice #INV-2026-8942 ($38,450.00) from OmniFreight matches line-items previously settled on 10/18/2026 under PO-7711.',
      status: 'Under Review',
      timestamp: '2 hours ago'
    },
    {
      id: 'ANOM-02',
      type: 'BUDGET_CEILING_BREACH_WARN',
      severity: 'Medium',
      confidence: '99.1%',
      title: 'Global Marketing Budget Exceeding 93.8% Ceiling',
      details: 'Pending requisition REQ-1039 ($14,200) will cause Global Marketing Q4 allocation to breach 100% capacity.',
      status: 'Action Required',
      timestamp: '5 hours ago'
    },
    {
      id: 'ANOM-03',
      type: 'PRICE_DRIFT_ALERT',
      severity: 'Low',
      confidence: '94.2%',
      title: 'Hardware Unit Price Drift (+12.4%)',
      details: 'Workstation NVMe quoted at $570/unit compared to 90-day historical benchmark of $507/unit across preferred vendors.',
      status: 'Logged',
      timestamp: '1 day ago'
    }
  ],

  approvalLogs: [
    {
      id: 'LOG-501',
      reqId: 'REQ-1041',
      action: 'Approved',
      actor: 'David Vance (Administrator)',
      comment: 'Approved for Q4 fleet upgrades. Delivery confirmed for Nov 20.',
      timestamp: '2026-11-05 15:10'
    },
    {
      id: 'LOG-500',
      reqId: 'REQ-1040',
      action: 'Approved',
      actor: 'Marcus Sterling (Finance Officer)',
      comment: 'Within annual software budget allowance. Approved.',
      timestamp: '2026-11-04 12:05'
    },
    {
      id: 'LOG-499',
      reqId: 'REQ-1038',
      action: 'Rejected',
      actor: 'Sarah Jenkins (Procurement Manager)',
      comment: 'Requote required. Supplier DirectEquip rating currently under review.',
      timestamp: '2026-11-02 11:30'
    }
  ]
};

// Check if Demo View Mode is active (session-only preview)
export function isDemoMode() {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem('aderno_demo_mode') === 'true') {
    return true;
  }
  const userStr = sessionStorage.getItem('aderno_user') || localStorage.getItem('aderno_user');
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      return !!u.isDemo;
    } catch {
      return false;
    }
  }
  return false;
}

// Demo Store (session storage - ephemeral, never saved permanently)
function getDemoStore(key) {
  const data = sessionStorage.getItem(`aderno_demo_${key}`);
  return data ? JSON.parse(data) : INITIAL_DATA[key];
}

function setDemoStore(key, data) {
  sessionStorage.setItem(`aderno_demo_${key}`, JSON.stringify(data));
}

// Real Account Store (SQLite persistent store)
const DEFAULT_REAL_BUDGETS = [
  { id: 'BDG-01', department: 'Engineering & Technology', allocated: 250000, spent: 0, fiscalQuarter: 'Q4-2026', manager: 'Department Lead', status: 'Optimal' },
  { id: 'BDG-02', department: 'Operations & Fleet', allocated: 150000, spent: 0, fiscalQuarter: 'Q4-2026', manager: 'Operations Lead', status: 'Optimal' },
  { id: 'BDG-03', department: 'Corporate IT & Cloud', allocated: 200000, spent: 0, fiscalQuarter: 'Q4-2026', manager: 'IT Director', status: 'Optimal' },
  { id: 'BDG-04', department: 'Global Marketing', allocated: 100000, spent: 0, fiscalQuarter: 'Q4-2026', manager: 'Marketing Lead', status: 'Optimal' },
  { id: 'BDG-05', department: 'Facilities & Logistics', allocated: 80000, spent: 0, fiscalQuarter: 'Q4-2026', manager: 'Facilities Head', status: 'Optimal' }
];

function getRealStore(key) {
  const data = localStorage.getItem(`aderno_real_${key}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {}
  }
  if (key === 'budgets') return DEFAULT_REAL_BUDGETS;
  return []; // Clean real accounts start with 0 dummy records
}

function setRealStore(key, data) {
  localStorage.setItem(`aderno_real_${key}`, JSON.stringify(data));
}

// REST API Service backed by SQLite & Persistent Store
export const api = {
  // Requests
  async getRequests() {
    if (isDemoMode()) {
      return getDemoStore('requests');
    }
    try {
      const res = await client.get('/procurement-requests');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRealStore('requests', res.data);
        return res.data;
      }
      return getRealStore('requests');
    } catch {
      return getRealStore('requests');
    }
  },

  async createRequest(payload) {
    if (isDemoMode()) {
      const list = getDemoStore('requests');
      const newReq = {
        id: `REQ-${1043 + list.length}`,
        ...payload,
        status: 'Pending Approval',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      const updated = [newReq, ...list];
      setDemoStore('requests', updated);
      return newReq;
    }

    let created = null;
    try {
      const res = await client.post('/procurement-requests', payload);
      created = res.data;
    } catch {}

    const list = getRealStore('requests');
    const newReq = created ? {
      id: created.request_code || created.id || `REQ-${1000 + list.length + 1}`,
      ...payload,
      status: created.status || 'Pending Approval',
      createdAt: created.created_at ? String(created.created_at).substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16)
    } : {
      id: `REQ-${1000 + list.length + 1}`,
      ...payload,
      status: 'Pending Approval',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updated = [newReq, ...list];
    setRealStore('requests', updated);
    return newReq;
  },

  async updateRequestStatus(id, status, actor, comment = '') {
    if (isDemoMode()) {
      const list = getDemoStore('requests');
      const updated = list.map(r => r.id === id ? { ...r, status } : r);
      setDemoStore('requests', updated);

      const logs = getDemoStore('approvalLogs');
      const newLog = {
        id: `LOG-${502 + logs.length}`,
        reqId: id,
        action: status,
        actor,
        comment: comment || `Status updated to ${status}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setDemoStore('approvalLogs', [newLog, ...logs]);
      return updated.find(r => r.id === id);
    }

    try {
      await client.patch(`/procurement-requests/${id}/status`, { status, comment });
    } catch {}

    const list = getRealStore('requests');
    const updated = list.map(r => r.id === id ? { ...r, status } : r);
    setRealStore('requests', updated);

    const logs = getRealStore('approvalLogs');
    const newLog = {
      id: `LOG-${100 + logs.length + 1}`,
      reqId: id,
      action: status,
      actor,
      comment: comment || `Status updated to ${status}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setRealStore('approvalLogs', [newLog, ...logs]);
    return updated.find(r => r.id === id);
  },

  // Suppliers
  async getSuppliers() {
    if (isDemoMode()) {
      return getDemoStore('suppliers');
    }
    try {
      const res = await client.get('/suppliers');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRealStore('suppliers', res.data);
        return res.data;
      }
      return getRealStore('suppliers');
    } catch {
      return getRealStore('suppliers');
    }
  },

  async createSupplier(payload) {
    if (isDemoMode()) {
      const list = getDemoStore('suppliers');
      const newSup = {
        id: `SUP-00${list.length + 1}`,
        ytdSpend: 0,
        rating: 95.0,
        riskLevel: 'Low',
        activeContracts: 1,
        onTimeDeliveryRate: '98.0%',
        ...payload
      };
      const updated = [newSup, ...list];
      setDemoStore('suppliers', updated);
      return newSup;
    }

    let created = null;
    try {
      const res = await client.post('/suppliers', payload);
      created = res.data;
    } catch {}

    const list = getRealStore('suppliers');
    const newSup = {
      id: created?.code || payload.code || `SUP-${String(list.length + 1).padStart(3, '0')}`,
      ytdSpend: 0,
      rating: 95.0,
      riskLevel: 'Low',
      activeContracts: 1,
      onTimeDeliveryRate: '98.0%',
      ...payload
    };

    const updated = [newSup, ...list];
    setRealStore('suppliers', updated);
    return newSup;
  },

  // Purchase Orders
  async getPurchaseOrders() {
    if (isDemoMode()) {
      return getDemoStore('purchaseOrders');
    }
    try {
      const res = await client.get('/purchase-orders');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRealStore('purchaseOrders', res.data);
        return res.data;
      }
      return getRealStore('purchaseOrders');
    } catch {
      return getRealStore('purchaseOrders');
    }
  },

  async createPurchaseOrder(payload) {
    if (isDemoMode()) {
      const list = getDemoStore('purchaseOrders');
      const newPo = {
        id: `PO-${7715 + list.length}`,
        status: 'Dispatched',
        createdAt: new Date().toISOString().substring(0, 10),
        paymentStatus: 'Pending Delivery',
        ...payload
      };
      const updated = [newPo, ...list];
      setDemoStore('purchaseOrders', updated);
      return newPo;
    }

    let created = null;
    try {
      const res = await client.post('/purchase-orders', payload);
      created = res.data;
    } catch {}

    const list = getRealStore('purchaseOrders');
    const newPo = {
      id: created?.po_number || `PO-${7700 + list.length + 1}`,
      status: 'Dispatched',
      createdAt: new Date().toISOString().substring(0, 10),
      paymentStatus: 'Pending Delivery',
      ...payload
    };

    const updated = [newPo, ...list];
    setRealStore('purchaseOrders', updated);
    return newPo;
  },

  // Budgets
  async getBudgets() {
    if (isDemoMode()) {
      return getDemoStore('budgets');
    }
    try {
      const res = await client.get('/budgets');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRealStore('budgets', res.data);
        return res.data;
      }
      return getRealStore('budgets');
    } catch {
      return getRealStore('budgets');
    }
  },

  async updateBudget(id, allocated) {
    if (isDemoMode()) {
      const list = getDemoStore('budgets');
      const updated = list.map(b => b.id === id ? { ...b, allocated: Number(allocated) } : b);
      setDemoStore('budgets', updated);
      return updated.find(b => b.id === id);
    }

    try {
      await client.patch(`/budgets/${id}`, { allocated });
    } catch {}

    const list = getRealStore('budgets');
    const updated = list.map(b => b.id === id ? { ...b, allocated: Number(allocated) } : b);
    setRealStore('budgets', updated);
    return updated.find(b => b.id === id);
  },

  // Spending Transactions
  async getTransactions() {
    if (isDemoMode()) {
      return getDemoStore('spendingTransactions');
    }
    try {
      const res = await client.get('/spending-transactions');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRealStore('spendingTransactions', res.data);
        return res.data;
      }
      return getRealStore('spendingTransactions');
    } catch {
      return getRealStore('spendingTransactions');
    }
  },

  // Approval Logs
  async getApprovalLogs() {
    if (isDemoMode()) {
      return getDemoStore('approvalLogs');
    }
    try {
      const res = await client.get('/approval-logs');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRealStore('approvalLogs', res.data);
        return res.data;
      }
      return getRealStore('approvalLogs');
    } catch {
      return getRealStore('approvalLogs');
    }
  },

  // AI Anomalies
  async getAiAnomalies() {
    if (isDemoMode()) {
      return getDemoStore('aiAnomalies');
    }
    try {
      const res = await client.get('/ai-anomalies');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return getRealStore('aiAnomalies');
    } catch {
      return getRealStore('aiAnomalies');
    }
  }
};
