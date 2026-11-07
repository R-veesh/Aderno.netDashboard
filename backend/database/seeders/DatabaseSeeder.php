<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Supplier;
use App\Models\ProcurementRequest;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Budget;
use App\Models\SpendingTransaction;
use App\Models\ApprovalLog;
use App\Models\AiAnomaly;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Departments
        $eng = Department::create([
            'name' => 'Engineering & Technology',
            'code' => 'ENG-TECH',
            'head_name' => 'David Vance',
            'cost_center_code' => 'CC-4100'
        ]);

        $it = Department::create([
            'name' => 'Corporate IT & Cloud',
            'code' => 'CORP-IT',
            'head_name' => 'Marcus Sterling',
            'cost_center_code' => 'CC-4200'
        ]);

        $ops = Department::create([
            'name' => 'Operations & Fleet',
            'code' => 'OPS-FLEET',
            'head_name' => 'Elena Rostova',
            'cost_center_code' => 'CC-4300'
        ]);

        $mktg = Department::create([
            'name' => 'Global Marketing',
            'code' => 'GLB-MKTG',
            'head_name' => 'Sarah Jenkins',
            'cost_center_code' => 'CC-4400'
        ]);

        $fac = Department::create([
            'name' => 'Facilities & Logistics',
            'code' => 'FAC-LOG',
            'head_name' => 'David Chen',
            'cost_center_code' => 'CC-4500'
        ]);

        // 2. Users (Admin, Procurement Manager, Finance Officer, Department User)
        $admin = User::create([
            'name' => 'David Vance',
            'email' => 'admin@aderno.net',
            'password' => Hash::make('password123'),
            'role' => 'Administrator',
            'department_id' => $eng->id,
            'avatar' => 'DV'
        ]);

        $proc = User::create([
            'name' => 'Sarah Jenkins',
            'email' => 'sarah.j@aderno.net',
            'password' => Hash::make('password123'),
            'role' => 'Procurement Manager',
            'department_id' => $mktg->id,
            'avatar' => 'SJ'
        ]);

        $fin = User::create([
            'name' => 'Marcus Sterling',
            'email' => 'marcus.s@aderno.net',
            'password' => Hash::make('password123'),
            'role' => 'Finance Officer',
            'department_id' => $it->id,
            'avatar' => 'MS'
        ]);

        $user = User::create([
            'name' => 'Elena Rostova',
            'email' => 'elena.r@aderno.net',
            'password' => Hash::make('password123'),
            'role' => 'Department User',
            'department_id' => $ops->id,
            'avatar' => 'ER'
        ]);

        // 3. Suppliers
        $s1 = Supplier::create([
            'name' => 'Apex Tensor Systems Ltd',
            'code' => 'APEX-TENSOR',
            'category' => 'Cloud Infrastructure',
            'contact_person' => 'Rachel Miller',
            'email' => 'enterprise@apextensor.io',
            'phone' => '+1 (555) 382-9011',
            'tax_id' => 'US-94-3829101',
            'payment_terms' => 'Net 30',
            'status' => 'Preferred Tier-1',
            'rating' => 98.5,
            'ytd_spend' => 428000.00,
            'risk_level' => 'Low',
            'on_time_delivery_rate' => '99.4%'
        ]);

        $s2 = Supplier::create([
            'name' => 'OmniFreight Global Logistics',
            'code' => 'OMNI-FREIGHT',
            'category' => 'Logistics & Distribution',
            'contact_person' => 'Carlos Delgado',
            'email' => 'carlos@omnifreight.com',
            'phone' => '+1 (555) 749-2231',
            'tax_id' => 'US-12-8829104',
            'payment_terms' => 'Net 45',
            'status' => 'Active',
            'rating' => 94.2,
            'ytd_spend' => 312400.00,
            'risk_level' => 'Low',
            'on_time_delivery_rate' => '96.2%'
        ]);

        $s3 = Supplier::create([
            'name' => 'CyberShield Security Labs',
            'code' => 'CYBER-SHIELD',
            'category' => 'Software & SaaS',
            'contact_person' => 'Tariq Al-Mansoor',
            'email' => 'licensing@cybershield.net',
            'phone' => '+1 (555) 902-4411',
            'tax_id' => 'US-88-2910041',
            'payment_terms' => 'Net 15',
            'status' => 'Preferred Tier-1',
            'rating' => 99.1,
            'ytd_spend' => 189500.00,
            'risk_level' => 'Minimal',
            'on_time_delivery_rate' => '100%'
        ]);

        $s4 = Supplier::create([
            'name' => 'DirectEquip Industrial Corp',
            'code' => 'DIRECT-EQUIP',
            'category' => 'Hardware & IoT',
            'contact_person' => 'Laura Bennett',
            'email' => 'orders@directequip.com',
            'phone' => '+1 (555) 441-8902',
            'tax_id' => 'US-77-3920199',
            'payment_terms' => 'Net 30',
            'status' => 'Under Review',
            'rating' => 87.4,
            'ytd_spend' => 94200.00,
            'risk_level' => 'Moderate',
            'on_time_delivery_rate' => '88.5%'
        ]);

        $s5 = Supplier::create([
            'name' => 'GlobalMedia Creative Partners',
            'code' => 'GLOBAL-MEDIA',
            'category' => 'Professional Services',
            'contact_person' => 'Sophia Reynolds',
            'email' => 'studios@globalmedia.co',
            'phone' => '+1 (555) 621-0091',
            'tax_id' => 'US-55-9018274',
            'payment_terms' => 'Net 30',
            'status' => 'Active',
            'rating' => 93.8,
            'ytd_spend' => 62800.00,
            'risk_level' => 'Low',
            'on_time_delivery_rate' => '95.0%'
        ]);

        // 4. Budgets
        Budget::create([
            'department_id' => $eng->id,
            'fiscal_year' => '2026',
            'fiscal_quarter' => 'Q4-2026',
            'allocated_amount' => 450000.00,
            'spent_amount' => 328400.00,
            'threshold_warning_percentage' => 85,
            'status' => 'On Track'
        ]);

        Budget::create([
            'department_id' => $it->id,
            'fiscal_year' => '2026',
            'fiscal_quarter' => 'Q4-2026',
            'allocated_amount' => 280000.00,
            'spent_amount' => 246200.00,
            'threshold_warning_percentage' => 85,
            'status' => 'Near Threshold'
        ]);

        Budget::create([
            'department_id' => $ops->id,
            'fiscal_year' => '2026',
            'fiscal_quarter' => 'Q4-2026',
            'allocated_amount' => 220000.00,
            'spent_amount' => 142500.00,
            'threshold_warning_percentage' => 85,
            'status' => 'On Track'
        ]);

        Budget::create([
            'department_id' => $mktg->id,
            'fiscal_year' => '2026',
            'fiscal_quarter' => 'Q4-2026',
            'allocated_amount' => 180000.00,
            'spent_amount' => 168900.00,
            'threshold_warning_percentage' => 85,
            'status' => 'Warning Overrun'
        ]);

        Budget::create([
            'department_id' => $fac->id,
            'fiscal_year' => '2026',
            'fiscal_quarter' => 'Q4-2026',
            'allocated_amount' => 140000.00,
            'spent_amount' => 92100.00,
            'threshold_warning_percentage' => 85,
            'status' => 'On Track'
        ]);

        // 5. Procurement Requests
        $r1 = ProcurementRequest::create([
            'request_code' => 'REQ-1042',
            'department_id' => $eng->id,
            'requester_id' => $admin->id,
            'requester_name' => 'Alex Vance',
            'title' => 'GPU Cloud Cluster Allocation (4x H100 SXM5)',
            'description' => 'High-throughput tensor training cluster capacity for Q4 model fine-tuning.',
            'category' => 'Cloud Infrastructure',
            'estimated_cost' => 42500.00,
            'priority' => 'High',
            'status' => 'Pending Approval'
        ]);

        $r2 = ProcurementRequest::create([
            'request_code' => 'REQ-1041',
            'department_id' => $ops->id,
            'requester_id' => $user->id,
            'requester_name' => 'Elena Rostova',
            'title' => 'Fleet Telematics IoT Sensor Upgrades',
            'description' => 'Sensor array replacement for 32 distribution transport carriers.',
            'category' => 'Hardware & IoT',
            'estimated_cost' => 18300.00,
            'priority' => 'Normal',
            'status' => 'Approved'
        ]);

        $r3 = ProcurementRequest::create([
            'request_code' => 'REQ-1040',
            'department_id' => $it->id,
            'requester_id' => $fin->id,
            'requester_name' => 'Marcus Sterling',
            'title' => 'Enterprise Okta & Identity Governance Renewal',
            'description' => 'Annual enterprise SSO identity provider licenses for 850 corporate seats.',
            'category' => 'Software & SaaS',
            'estimated_cost' => 29400.00,
            'priority' => 'Urgent',
            'status' => 'Approved'
        ]);

        $r4 = ProcurementRequest::create([
            'request_code' => 'REQ-1039',
            'department_id' => $mktg->id,
            'requester_id' => $proc->id,
            'requester_name' => 'Sarah Jenkins',
            'title' => 'Global Brand Asset & Video Production Package',
            'description' => 'Quarterly video production for product release showcase.',
            'category' => 'Professional Services',
            'estimated_cost' => 14200.00,
            'priority' => 'Normal',
            'status' => 'Under Review'
        ]);

        $r5 = ProcurementRequest::create([
            'request_code' => 'REQ-1038',
            'department_id' => $fac->id,
            'requester_id' => $admin->id,
            'requester_name' => 'David Chen',
            'title' => 'Smart HVAC Sensor Network Replacement',
            'description' => 'HVAC controller replacement to optimize energy efficiency.',
            'category' => 'Facilities',
            'estimated_cost' => 8950.00,
            'priority' => 'Low',
            'status' => 'Rejected'
        ]);

        $r6 = ProcurementRequest::create([
            'request_code' => 'REQ-1037',
            'department_id' => $eng->id,
            'requester_id' => $admin->id,
            'requester_name' => 'Alex Vance',
            'title' => 'Workstation NVMe Storage Upgrade (20 Units)',
            'description' => 'Fast PCIe 5.0 SSD storage upgrades for machine learning workstations.',
            'category' => 'Hardware & IoT',
            'estimated_cost' => 11400.00,
            'priority' => 'Normal',
            'status' => 'Approved'
        ]);

        // 6. Purchase Orders
        $po1 = PurchaseOrder::create([
            'po_number' => 'PO-7714',
            'procurement_request_id' => $r2->id,
            'supplier_id' => $s4->id,
            'title' => 'Fleet IoT Sensor Hardware Order',
            'total_amount' => 18300.00,
            'delivery_date' => '2026-11-20',
            'status' => 'Dispatched',
            'payment_status' => 'Pending Delivery',
            'items_count' => 32
        ]);

        $po2 = PurchaseOrder::create([
            'po_number' => 'PO-7713',
            'procurement_request_id' => $r3->id,
            'supplier_id' => $s3->id,
            'title' => 'Okta Enterprise SSO Annual Licensing',
            'total_amount' => 29400.00,
            'delivery_date' => '2026-11-10',
            'status' => 'Delivered',
            'payment_status' => 'Invoiced',
            'items_count' => 850
        ]);

        $po3 = PurchaseOrder::create([
            'po_number' => 'PO-7712',
            'procurement_request_id' => $r6->id,
            'supplier_id' => $s1->id,
            'title' => 'PCIe 5.0 Workstation NVMe Storage',
            'total_amount' => 11400.00,
            'delivery_date' => '2026-11-14',
            'status' => 'Delivered',
            'payment_status' => 'Paid',
            'items_count' => 20
        ]);

        // 7. Spending Transactions
        SpendingTransaction::create([
            'transaction_code' => 'TXN-9024',
            'purchase_order_id' => $po2->id,
            'vendor_name' => 'CyberShield Security Labs',
            'department_name' => 'Corporate IT',
            'category' => 'Software & SaaS',
            'description' => 'Okta Enterprise SSO Annual Licensing',
            'amount' => 29400.00,
            'transaction_date' => '2026-11-04',
            'status' => 'Cleared'
        ]);

        SpendingTransaction::create([
            'transaction_code' => 'TXN-9023',
            'purchase_order_id' => $po3->id,
            'vendor_name' => 'Apex Tensor Systems Ltd',
            'department_name' => 'Engineering',
            'category' => 'Hardware & IoT',
            'description' => 'PCIe 5.0 Workstation NVMe Storage (20 units)',
            'amount' => 11400.00,
            'transaction_date' => '2026-11-02',
            'status' => 'Cleared'
        ]);

        // 8. Approval Logs
        ApprovalLog::create([
            'procurement_request_id' => $r2->id,
            'action' => 'Approved',
            'actor_name' => 'David Vance',
            'actor_role' => 'Administrator',
            'commentary' => 'Approved for Q4 fleet upgrades. Delivery confirmed for Nov 20.'
        ]);

        ApprovalLog::create([
            'procurement_request_id' => $r3->id,
            'action' => 'Approved',
            'actor_name' => 'Marcus Sterling',
            'actor_role' => 'Finance Officer',
            'commentary' => 'Within annual software budget allowance. Approved.'
        ]);

        ApprovalLog::create([
            'procurement_request_id' => $r5->id,
            'action' => 'Rejected',
            'actor_name' => 'Sarah Jenkins',
            'actor_role' => 'Procurement Manager',
            'commentary' => 'Requote required. Supplier DirectEquip rating currently under review.'
        ]);

        // 9. AI Anomalies
        AiAnomaly::create([
            'anomaly_code' => 'ANOM-01',
            'type' => 'DUPLICATE_INVOICE_FLAG',
            'severity' => 'High',
            'confidence_score' => 98.40,
            'title' => 'Potential Duplicate Freight Manifest Invoiced',
            'details' => 'Invoice #INV-2026-8942 ($38,450.00) from OmniFreight matches line-items previously settled on 10/18/2026 under PO-7711.',
            'status' => 'Under Review'
        ]);

        AiAnomaly::create([
            'anomaly_code' => 'ANOM-02',
            'type' => 'BUDGET_CEILING_BREACH_WARN',
            'severity' => 'Medium',
            'confidence_score' => 99.10,
            'title' => 'Global Marketing Budget Exceeding 93.8% Ceiling',
            'details' => 'Pending requisition REQ-1039 ($14,200) will cause Global Marketing Q4 allocation to breach 100% capacity.',
            'status' => 'Active'
        ]);
    }
}
