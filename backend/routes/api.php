<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\ProcurementRequest;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\Budget;
use App\Models\SpendingTransaction;
use App\Models\ApprovalLog;
use App\Models\AiAnomaly;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'Aderno Procurement Intelligence REST API',
        'version' => '1.6.0',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Authentication
Route::post('/auth/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    $token = $user->createToken('aderno_access_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar
        ]
    ]);
});

// Procurement Requests
Route::get('/procurement-requests', function () {
    return response()->json(ProcurementRequest::with('department')->latest()->get()->map(function ($r) {
        return [
            'id' => $r->request_code,
            'department' => $r->department ? $r->department->name : 'General',
            'title' => $r->title,
            'description' => $r->description,
            'category' => $r->category,
            'estimatedCost' => (float)$r->estimated_cost,
            'priority' => $r->priority,
            'status' => $r->status,
            'requester' => $r->requester_name,
            'createdAt' => $r->created_at->format('Y-m-d H:i')
        ];
    }));
});

Route::post('/procurement-requests', function (Request $request) {
    $data = $request->validate([
        'title' => 'required|string',
        'department' => 'nullable|string',
        'category' => 'required|string',
        'estimatedCost' => 'required|numeric',
        'priority' => 'required|string',
        'description' => 'nullable|string',
        'requester' => 'required|string',
        'requesterEmail' => 'nullable|email'
    ]);

    $code = 'REQ-' . (1000 + ProcurementRequest::count() + 1);

    $req = ProcurementRequest::create([
        'request_code' => $code,
        'title' => $data['title'],
        'category' => $data['category'],
        'estimated_cost' => $data['estimatedCost'],
        'priority' => $data['priority'],
        'description' => $data['description'] ?? null,
        'requester_name' => $data['requester'],
        'status' => 'Pending Approval'
    ]);

    return response()->json($req, 201);
});

Route::patch('/procurement-requests/{id}/status', function (Request $request, $id) {
    $request->validate([
        'status' => 'required|string',
        'comment' => 'nullable|string'
    ]);

    $req = ProcurementRequest::where('request_code', $id)->firstOrFail();
    $req->update([
        'status' => $request->status,
        'approval_notes' => $request->comment
    ]);

    ApprovalLog::create([
        'procurement_request_id' => $req->id,
        'action' => $request->status,
        'actor_name' => auth()->user()?->name ?? 'Authorizer',
        'actor_role' => auth()->user()?->role ?? 'Manager',
        'commentary' => $request->comment ?? 'Status updated'
    ]);

    return response()->json($req);
});

// Suppliers
Route::get('/suppliers', function () {
    return response()->json(Supplier::all()->map(function ($s) {
        return [
            'id' => $s->code,
            'name' => $s->name,
            'code' => $s->code,
            'category' => $s->category,
            'contactPerson' => $s->contact_person,
            'email' => $s->email,
            'phone' => $s->phone,
            'taxId' => $s->tax_id,
            'paymentTerms' => $s->payment_terms,
            'status' => $s->status,
            'rating' => (float)$s->rating,
            'ytdSpend' => (float)$s->ytd_spend,
            'riskLevel' => $s->risk_level,
            'onTimeDeliveryRate' => $s->on_time_delivery_rate
        ];
    }));
});

Route::post('/suppliers', function (Request $request) {
    $data = $request->validate([
        'name' => 'required|string',
        'code' => 'required|string|unique:suppliers,code',
        'category' => 'required|string',
        'contactPerson' => 'nullable|string',
        'email' => 'nullable|email',
        'phone' => 'nullable|string',
        'paymentTerms' => 'nullable|string'
    ]);

    $sup = Supplier::create([
        'name' => $data['name'],
        'code' => strtoupper($data['code']),
        'category' => $data['category'],
        'contact_person' => $data['contactPerson'] ?? null,
        'email' => $data['email'] ?? null,
        'phone' => $data['phone'] ?? null,
        'payment_terms' => $data['paymentTerms'] ?? 'Net 30',
        'status' => 'Active',
        'rating' => 95.0,
        'ytd_spend' => 0.00,
        'risk_level' => 'Low'
    ]);

    return response()->json($sup, 201);
});

// Purchase Orders
Route::get('/purchase-orders', function () {
    return response()->json(PurchaseOrder::with(['supplier', 'procurementRequest'])->latest()->get()->map(function ($p) {
        return [
            'id' => $p->po_number,
            'reqId' => $p->procurementRequest?->request_code ?? 'DIRECT',
            'supplierName' => $p->supplier?->name ?? 'Vendor',
            'title' => $p->title,
            'totalAmount' => (float)$p->total_amount,
            'deliveryDate' => $p->delivery_date?->format('Y-m-d'),
            'status' => $p->status,
            'paymentStatus' => $p->payment_status,
            'itemsCount' => $p->items_count
        ];
    }));
});

Route::post('/purchase-orders', function (Request $request) {
    $data = $request->validate([
        'title' => 'required|string',
        'supplierName' => 'required|string',
        'totalAmount' => 'required|numeric',
        'reqId' => 'nullable|string',
        'deliveryDate' => 'nullable|date'
    ]);

    $supplier = Supplier::where('name', $data['supplierName'])->first() ?? Supplier::first();
    $poNumber = 'PO-' . (7700 + PurchaseOrder::count() + 1);

    $po = PurchaseOrder::create([
        'po_number' => $poNumber,
        'supplier_id' => $supplier->id,
        'title' => $data['title'],
        'total_amount' => $data['totalAmount'],
        'delivery_date' => $data['deliveryDate'] ?? now()->addDays(14),
        'status' => 'Dispatched',
        'payment_status' => 'Pending Delivery',
        'items_count' => 1
    ]);

    return response()->json($po, 201);
});

// Budgets
Route::get('/budgets', function () {
    return response()->json(Budget::with('department')->get()->map(function ($b) {
        return [
            'id' => 'BDG-0' . $b->id,
            'department' => $b->department?->name ?? 'Department',
            'allocated' => (float)$b->allocated_amount,
            'spent' => (float)$b->spent_amount,
            'fiscalQuarter' => $b->fiscal_quarter,
            'manager' => $b->department?->head_name ?? 'Manager',
            'status' => $b->status
        ];
    }));
});

Route::patch('/budgets/{id}', function (Request $request, $id) {
    $request->validate(['allocated' => 'required|numeric']);
    $numericId = (int)str_replace('BDG-0', '', $id);
    $budget = Budget::findOrFail($numericId);
    $budget->update(['allocated_amount' => $request->allocated]);
    return response()->json($budget);
});

// Transactions
Route::get('/spending-transactions', function () {
    return response()->json(SpendingTransaction::with('purchaseOrder')->latest()->get()->map(function ($t) {
        return [
            'id' => $t->transaction_code,
            'poId' => $t->purchaseOrder?->po_number ?? 'PO-DIRECT',
            'vendor' => $t->vendor_name,
            'description' => $t->description,
            'amount' => (float)$t->amount,
            'category' => $t->category,
            'department' => $t->department_name,
            'date' => $t->transaction_date->format('Y-m-d'),
            'status' => $t->status
        ];
    }));
});

// Approval Logs
Route::get('/approval-logs', function () {
    return response()->json(ApprovalLog::with('procurementRequest')->latest()->get()->map(function ($l) {
        return [
            'id' => 'LOG-' . $l->id,
            'reqId' => $l->procurementRequest?->request_code ?? 'REQ-GEN',
            'action' => $l->action,
            'actor' => $l->actor_name . ' (' . $l->actor_role . ')',
            'comment' => $l->commentary,
            'timestamp' => $l->created_at->format('Y-m-d H:i')
        ];
    }));
});

// AI Spend Anomalies
Route::get('/ai-anomalies', function () {
    return response()->json(AiAnomaly::latest()->get()->map(function ($a) {
        return [
            'id' => $a->anomaly_code,
            'type' => $a->type,
            'severity' => $a->severity,
            'confidence' => $a->confidence_score . '%',
            'title' => $a->title,
            'details' => $a->details,
            'status' => $a->status,
            'timestamp' => $a->created_at->diffForHumans()
        ];
    }));
});
