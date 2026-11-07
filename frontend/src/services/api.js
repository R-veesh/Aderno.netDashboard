import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
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

// Local storage management to persist demo changes
function getStore(key) {
  const data = localStorage.getItem(`aderno_${key}`);
  return data ? JSON.parse(data) : INITIAL_DATA[key];
}

function setStore(key, data) {
  localStorage.setItem(`aderno_${key}`, JSON.stringify(data));
}

// REST API Service
export const api = {
  // Requests
  async getRequests() {
    try {
      const res = await client.get('/procurement-requests');
      return res.data;
    } catch {
      return getStore('requests');
    }
  },

  async createRequest(payload) {
    try {
      const res = await client.post('/procurement-requests', payload);
      return res.data;
    } catch {
      const list = getStore('requests');
      const newReq = {
        id: `REQ-${1043 + list.length}`,
        ...payload,
        status: 'Pending Approval',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      const updated = [newReq, ...list];
      setStore('requests', updated);
      return newReq;
    }
  },

  async updateRequestStatus(id, status, actor, comment = '') {
    try {
      const res = await client.patch(`/procurement-requests/${id}/status`, { status, comment });
      return res.data;
    } catch {
      const list = getStore('requests');
      const updated = list.map(r => r.id === id ? { ...r, status } : r);
      setStore('requests', updated);

      // Also record approval log
      const logs = getStore('approvalLogs');
      const newLog = {
        id: `LOG-${502 + logs.length}`,
        reqId: id,
        action: status,
        actor,
        comment: comment || `Status updated to ${status}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setStore('approvalLogs', [newLog, ...logs]);

      return updated.find(r => r.id === id);
    }
  },

  // Suppliers
  async getSuppliers() {
    try {
      const res = await client.get('/suppliers');
      return res.data;
    } catch {
      return getStore('suppliers');
    }
  },

  async createSupplier(payload) {
    try {
      const res = await client.post('/suppliers', payload);
      return res.data;
    } catch {
      const list = getStore('suppliers');
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
      setStore('suppliers', updated);
      return newSup;
    }
  },

  // Purchase Orders
  async getPurchaseOrders() {
    try {
      const res = await client.get('/purchase-orders');
      return res.data;
    } catch {
      return getStore('purchaseOrders');
    }
  },

  async createPurchaseOrder(payload) {
    try {
      const res = await client.post('/purchase-orders', payload);
      return res.data;
    } catch {
      const list = getStore('purchaseOrders');
      const newPo = {
        id: `PO-${7715 + list.length}`,
        status: 'Dispatched',
        createdAt: new Date().toISOString().substring(0, 10),
        paymentStatus: 'Pending Delivery',
        ...payload
      };
      const updated = [newPo, ...list];
      setStore('purchaseOrders', updated);
      return newPo;
    }
  },

  // Budgets
  async getBudgets() {
    try {
      const res = await client.get('/budgets');
      return res.data;
    } catch {
      return getStore('budgets');
    }
  },

  async updateBudget(id, allocated) {
    try {
      const res = await client.patch(`/budgets/${id}`, { allocated });
      return res.data;
    } catch {
      const list = getStore('budgets');
      const updated = list.map(b => b.id === id ? { ...b, allocated: Number(allocated) } : b);
      setStore('budgets', updated);
      return updated.find(b => b.id === id);
    }
  },

  // Spending
  async getTransactions() {
    try {
      const res = await client.get('/spending-transactions');
      return res.data;
    } catch {
      return getStore('spendingTransactions');
    }
  },

  // Approvals & Logs
  async getApprovalLogs() {
    try {
      const res = await client.get('/approval-logs');
      return res.data;
    } catch {
      return getStore('approvalLogs');
    }
  },

  // AI Anomalies
  async getAiAnomalies() {
    try {
      const res = await client.get('/ai-anomalies');
      return res.data;
    } catch {
      return getStore('aiAnomalies');
    }
  }
};
