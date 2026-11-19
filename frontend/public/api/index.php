<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . '/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Initialize SQLite Schema
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'Super Administrator',
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS procurement_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_code TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            department TEXT DEFAULT 'General',
            category TEXT NOT NULL,
            estimated_cost REAL NOT NULL,
            priority TEXT DEFAULT 'Normal',
            description TEXT,
            requester_name TEXT,
            requester_email TEXT,
            status TEXT DEFAULT 'Pending Approval',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            contact_person TEXT,
            email TEXT,
            phone TEXT,
            tax_id TEXT,
            payment_terms TEXT DEFAULT 'Net 30',
            status TEXT DEFAULT 'Active',
            rating REAL DEFAULT 95.0,
            ytd_spend REAL DEFAULT 0.00,
            risk_level TEXT DEFAULT 'Low',
            on_time_delivery_rate TEXT DEFAULT '98.0%',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS purchase_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            po_number TEXT UNIQUE NOT NULL,
            req_id TEXT,
            supplier_name TEXT,
            title TEXT NOT NULL,
            total_amount REAL NOT NULL,
            delivery_date TEXT,
            status TEXT DEFAULT 'Dispatched',
            payment_status TEXT DEFAULT 'Pending Delivery',
            items_count INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            budget_code TEXT UNIQUE,
            department TEXT NOT NULL,
            allocated_amount REAL NOT NULL,
            spent_amount REAL DEFAULT 0.00,
            fiscal_quarter TEXT DEFAULT 'Q4-2026',
            manager TEXT,
            status TEXT DEFAULT 'Optimal'
        );

        CREATE TABLE IF NOT EXISTS spending_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_code TEXT UNIQUE NOT NULL,
            po_id TEXT,
            vendor TEXT NOT NULL,
            description TEXT,
            amount REAL NOT NULL,
            category TEXT,
            department TEXT,
            transaction_date TEXT,
            status TEXT DEFAULT 'Settled'
        );

        CREATE TABLE IF NOT EXISTS approval_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            req_id TEXT NOT NULL,
            action TEXT NOT NULL,
            actor TEXT NOT NULL,
            comment TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Initialize Default Budgets if empty
    $budgetCount = $db->query("SELECT count(*) as count FROM budgets")->fetch()['count'];
    if ($budgetCount == 0) {
        $db->exec("
            INSERT INTO budgets (budget_code, department, allocated_amount, spent_amount, fiscal_quarter, manager, status) VALUES
            ('BDG-01', 'Engineering & Technology', 250000, 0, 'Q4-2026', 'Department Lead', 'Optimal'),
            ('BDG-02', 'Operations & Fleet', 150000, 0, 'Q4-2026', 'Operations Lead', 'Optimal'),
            ('BDG-03', 'Corporate IT & Cloud', 200000, 0, 'Q4-2026', 'IT Director', 'Optimal'),
            ('BDG-04', 'Global Marketing', 100000, 0, 'Q4-2026', 'Marketing Lead', 'Optimal'),
            ('BDG-05', 'Facilities & Logistics', 80000, 0, 'Q4-2026', 'Facilities Head', 'Optimal');
        ");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "details" => $e->getMessage()]);
    exit;
}

// Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Normalize path relative to /api/
$path = preg_replace('#^.*?/api/?#', '', $uri);
$path = trim($path, '/');
$segments = explode('/', $path);
$resource = $segments[0] ?? '';
$param = $segments[1] ?? '';
$subaction = $segments[2] ?? '';

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Health check
if ($resource === '' || $resource === 'health') {
    echo json_encode([
        "status" => "healthy",
        "service" => "Aderno Procurement Intelligence REST API (SQLite Live)",
        "version" => "1.6.0",
        "timestamp" => date('c')
    ]);
    exit;
}

// 1. Sync User / Auth
if ($resource === 'auth' && $param === 'sync-user') {
    $name = $input['name'] ?? 'User';
    $email = $input['email'] ?? '';
    $role = $input['role'] ?? 'Super Administrator';
    $avatar = $input['avatar'] ?? strtoupper(substr($name, 0, 2));

    if (!$email) {
        http_response_code(422);
        echo json_encode(["message" => "Email required"]);
        exit;
    }

    $stmt = $db->prepare("
        INSERT INTO users (name, email, role, avatar) 
        VALUES (:name, :email, :role, :avatar)
        ON CONFLICT(email) DO UPDATE SET 
            name=excluded.name, 
            role=excluded.role, 
            avatar=excluded.avatar
    ");
    $stmt->execute([':name' => $name, ':email' => $email, ':role' => $role, ':avatar' => $avatar]);
    echo json_encode(["status" => "ok", "user" => ["name" => $name, "email" => $email, "role" => $role, "avatar" => $avatar]]);
    exit;
}

// 2. Procurement Requests
if ($resource === 'procurement-requests') {
    if ($method === 'GET') {
        $rows = $db->query("SELECT * FROM procurement_requests ORDER BY id DESC")->fetchAll();
        $formatted = array_map(function($r) {
            return [
                'id' => $r['request_code'],
                'title' => $r['title'],
                'department' => $r['department'],
                'category' => $r['category'],
                'estimatedCost' => (float)$r['estimated_cost'],
                'priority' => $r['priority'],
                'description' => $r['description'],
                'requester' => $r['requester_name'],
                'requesterEmail' => $r['requester_email'],
                'status' => $r['status'],
                'createdAt' => substr($r['created_at'], 0, 16)
            ];
        }, $rows);
        echo json_encode($formatted);
        exit;
    }

    if ($method === 'POST') {
        $count = $db->query("SELECT count(*) as c FROM procurement_requests")->fetch()['c'];
        $code = 'REQ-' . (1042 + $count + 1);
        $stmt = $db->prepare("
            INSERT INTO procurement_requests (request_code, title, department, category, estimated_cost, priority, description, requester_name, requester_email, status)
            VALUES (:code, :title, :dept, :cat, :cost, :prio, :desc, :req, :email, 'Pending Approval')
        ");
        $stmt->execute([
            ':code' => $code,
            ':title' => $input['title'] ?? 'Procurement Request',
            ':dept' => $input['department'] ?? 'General',
            ':cat' => $input['category'] ?? 'General',
            ':cost' => (float)($input['estimatedCost'] ?? 0),
            ':prio' => $input['priority'] ?? 'Normal',
            ':desc' => $input['description'] ?? '',
            ':req' => $input['requester'] ?? 'User',
            ':email' => $input['requesterEmail'] ?? '',
        ]);
        http_response_code(201);
        echo json_encode([
            'id' => $code,
            'title' => $input['title'] ?? '',
            'department' => $input['department'] ?? 'General',
            'category' => $input['category'] ?? 'General',
            'estimatedCost' => (float)($input['estimatedCost'] ?? 0),
            'priority' => $input['priority'] ?? 'Normal',
            'description' => $input['description'] ?? '',
            'requester' => $input['requester'] ?? 'User',
            'requesterEmail' => $input['requesterEmail'] ?? '',
            'status' => 'Pending Approval',
            'createdAt' => date('Y-m-d H:i')
        ]);
        exit;
    }

    if ($method === 'PATCH' && $subaction === 'status') {
        $code = $param;
        $status = $input['status'] ?? 'Approved';
        $comment = $input['comment'] ?? 'Status updated';
        $stmt = $db->prepare("UPDATE procurement_requests SET status = :status WHERE request_code = :code");
        $stmt->execute([':status' => $status, ':code' => $code]);

        $logStmt = $db->prepare("INSERT INTO approval_logs (req_id, action, actor, comment) VALUES (:req, :act, :actor, :comm)");
        $logStmt->execute([':req' => $code, ':act' => $status, ':actor' => 'System Reviewer', ':comm' => $comment]);

        echo json_encode(["status" => "ok", "code" => $code, "newStatus" => $status]);
        exit;
    }
}

// 3. Suppliers
if ($resource === 'suppliers') {
    if ($method === 'GET') {
        $rows = $db->query("SELECT * FROM suppliers ORDER BY id DESC")->fetchAll();
        $formatted = array_map(function($s) {
            return [
                'id' => $s['code'],
                'code' => $s['code'],
                'name' => $s['name'],
                'category' => $s['category'],
                'contactPerson' => $s['contact_person'],
                'email' => $s['email'],
                'phone' => $s['phone'],
                'taxId' => $s['tax_id'],
                'paymentTerms' => $s['payment_terms'],
                'status' => $s['status'],
                'rating' => (float)$s['rating'],
                'ytdSpend' => (float)$s['ytd_spend'],
                'riskLevel' => $s['risk_level'],
                'onTimeDeliveryRate' => $s['on_time_delivery_rate']
            ];
        }, $rows);
        echo json_encode($formatted);
        exit;
    }

    if ($method === 'POST') {
        $count = $db->query("SELECT count(*) as c FROM suppliers")->fetch()['c'];
        $code = !empty($input['code']) ? strtoupper($input['code']) : ('SUP-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT));
        $stmt = $db->prepare("
            INSERT INTO suppliers (code, name, category, contact_person, email, phone, tax_id, payment_terms, status, rating, ytd_spend, risk_level, on_time_delivery_rate)
            VALUES (:code, :name, :cat, :contact, :email, :phone, :tax, :terms, 'Active', 95.0, 0.00, 'Low', '98.0%')
        ");
        $stmt->execute([
            ':code' => $code,
            ':name' => $input['name'] ?? 'New Supplier',
            ':cat' => $input['category'] ?? 'General',
            ':contact' => $input['contactPerson'] ?? '',
            ':email' => $input['email'] ?? '',
            ':phone' => $input['phone'] ?? '',
            ':tax' => $input['taxId'] ?? '',
            ':terms' => $input['paymentTerms'] ?? 'Net 30'
        ]);
        http_response_code(201);
        echo json_encode([
            'id' => $code,
            'code' => $code,
            'name' => $input['name'] ?? '',
            'category' => $input['category'] ?? '',
            'contactPerson' => $input['contactPerson'] ?? '',
            'email' => $input['email'] ?? '',
            'phone' => $input['phone'] ?? '',
            'status' => 'Active',
            'rating' => 95.0,
            'ytdSpend' => 0.0,
            'riskLevel' => 'Low'
        ]);
        exit;
    }
}

// 4. Purchase Orders
if ($resource === 'purchase-orders') {
    if ($method === 'GET') {
        $rows = $db->query("SELECT * FROM purchase_orders ORDER BY id DESC")->fetchAll();
        $formatted = array_map(function($p) {
            return [
                'id' => $p['po_number'],
                'reqId' => $p['req_id'] ?? 'DIRECT',
                'supplierName' => $p['supplier_name'] ?? 'Vendor',
                'title' => $p['title'],
                'totalAmount' => (float)$p['total_amount'],
                'deliveryDate' => $p['delivery_date'],
                'status' => $p['status'],
                'paymentStatus' => $p['payment_status'],
                'itemsCount' => (int)$p['items_count']
            ];
        }, $rows);
        echo json_encode($formatted);
        exit;
    }

    if ($method === 'POST') {
        $count = $db->query("SELECT count(*) as c FROM purchase_orders")->fetch()['c'];
        $poNumber = 'PO-' . (7714 + $count + 1);
        $stmt = $db->prepare("
            INSERT INTO purchase_orders (po_number, req_id, supplier_name, title, total_amount, delivery_date, status, payment_status, items_count)
            VALUES (:po, :req, :sup, :title, :amount, :date, 'Dispatched', 'Pending Delivery', :count)
        ");
        $stmt->execute([
            ':po' => $poNumber,
            ':req' => $input['reqId'] ?? 'DIRECT',
            ':sup' => $input['supplierName'] ?? 'Vendor',
            ':title' => $input['title'] ?? 'Procurement Order',
            ':amount' => (float)($input['totalAmount'] ?? 0),
            ':date' => $input['deliveryDate'] ?? date('Y-m-d', strtotime('+14 days')),
            ':count' => (int)($input['itemsCount'] ?? 1)
        ]);
        http_response_code(201);
        echo json_encode([
            'id' => $poNumber,
            'reqId' => $input['reqId'] ?? 'DIRECT',
            'supplierName' => $input['supplierName'] ?? 'Vendor',
            'title' => $input['title'] ?? '',
            'totalAmount' => (float)($input['totalAmount'] ?? 0),
            'status' => 'Dispatched',
            'paymentStatus' => 'Pending Delivery',
            'itemsCount' => (int)($input['itemsCount'] ?? 1)
        ]);
        exit;
    }
}

// 5. Budgets
if ($resource === 'budgets') {
    if ($method === 'GET') {
        $rows = $db->query("SELECT * FROM budgets ORDER BY id ASC")->fetchAll();
        $formatted = array_map(function($b) {
            return [
                'id' => $b['budget_code'] ?? ('BDG-0' . $b['id']),
                'department' => $b['department'],
                'allocated' => (float)$b['allocated_amount'],
                'spent' => (float)$b['spent_amount'],
                'fiscalQuarter' => $b['fiscal_quarter'],
                'manager' => $b['manager'],
                'status' => $b['status']
            ];
        }, $rows);
        echo json_encode($formatted);
        exit;
    }

    if ($method === 'PATCH') {
        $allocated = (float)($input['allocated'] ?? 0);
        $code = $param;
        $stmt = $db->prepare("UPDATE budgets SET allocated_amount = :alloc WHERE budget_code = :code OR id = :id");
        $stmt->execute([':alloc' => $allocated, ':code' => $code, ':id' => (int)str_replace('BDG-0', '', $code)]);
        echo json_encode(["status" => "ok"]);
        exit;
    }
}

// 6. Transactions
if ($resource === 'spending-transactions') {
    $rows = $db->query("SELECT * FROM spending_transactions ORDER BY id DESC")->fetchAll();
    echo json_encode($rows);
    exit;
}

// 7. Approval Logs
if ($resource === 'approval-logs') {
    $rows = $db->query("SELECT * FROM approval_logs ORDER BY id DESC")->fetchAll();
    $formatted = array_map(function($l) {
        return [
            'id' => 'LOG-' . $l['id'],
            'reqId' => $l['req_id'],
            'action' => $l['action'],
            'actor' => $l['actor'],
            'comment' => $l['comment'],
            'timestamp' => substr($l['timestamp'], 0, 16)
        ];
    }, $rows);
    echo json_encode($formatted);
    exit;
}

// 8. AI Anomalies
if ($resource === 'ai-anomalies') {
    // Real clean accounts start with 0 anomalies
    echo json_encode([]);
    exit;
}

// Default 404 for unknown endpoints
http_response_code(404);
echo json_encode(["message" => "Endpoint not found: " . $resource]);
