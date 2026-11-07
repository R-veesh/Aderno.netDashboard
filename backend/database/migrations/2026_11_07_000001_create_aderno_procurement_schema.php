<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Departments Table
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('head_name')->nullable();
            $table->string('cost_center_code')->nullable();
            $table->timestamps();
        });

        // 2. Add department and role to users if not present
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('Department User');
                $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
                $table->string('avatar')->nullable();
            });
        }

        // 3. Suppliers Table
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('category');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('payment_terms')->default('Net 30');
            $table->string('status')->default('Active');
            $table->decimal('rating', 4, 1)->default(95.0);
            $table->decimal('ytd_spend', 15, 2)->default(0.00);
            $table->string('risk_level')->default('Low');
            $table->string('on_time_delivery_rate')->default('98.0%');
            $table->timestamps();
        });

        // 4. Procurement Requests Table
        Schema::create('procurement_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_code')->unique();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('requester_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('requester_name');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category');
            $table->decimal('estimated_cost', 15, 2);
            $table->string('priority')->default('Normal'); // Low, Normal, High, Urgent
            $table->string('status')->default('Pending Approval'); // Draft, Pending Approval, Approved, Rejected, Fulfilled
            $table->text('approval_notes')->nullable();
            $table->timestamps();
        });

        // 5. Purchase Orders Table
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('procurement_request_id')->nullable()->constrained('procurement_requests')->nullOnDelete();
            $table->foreignId('supplier_id')->constrained('suppliers')->cascadeOnDelete();
            $table->string('title');
            $table->decimal('total_amount', 15, 2);
            $table->date('delivery_date')->nullable();
            $table->string('status')->default('Dispatched'); // Draft, Dispatched, Delivered, Cancelled
            $table->string('payment_status')->default('Pending Delivery'); // Pending Delivery, Invoiced, Paid
            $table->integer('items_count')->default(1);
            $table->timestamps();
        });

        // 6. Purchase Order Items Table
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->cascadeOnDelete();
            $table->string('item_description');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });

        // 7. Budgets Table
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->string('fiscal_year')->default('2026');
            $table->string('fiscal_quarter')->default('Q4-2026');
            $table->decimal('allocated_amount', 15, 2);
            $table->decimal('spent_amount', 15, 2)->default(0.00);
            $table->integer('threshold_warning_percentage')->default(85);
            $table->string('status')->default('On Track'); // On Track, Near Threshold, Warning Overrun
            $table->timestamps();
        });

        // 8. Spending Transactions Table
        Schema::create('spending_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_code')->unique();
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->nullOnDelete();
            $table->string('vendor_name');
            $table->string('department_name');
            $table->string('category');
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->date('transaction_date');
            $table->string('status')->default('Cleared');
            $table->timestamps();
        });

        // 9. Approval Logs Table
        Schema::create('approval_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('procurement_request_id')->constrained('procurement_requests')->cascadeOnDelete();
            $table->string('action'); // Approved, Rejected, Forwarded
            $table->string('actor_name');
            $table->string('actor_role');
            $table->text('commentary')->nullable();
            $table->timestamps();
        });

        // 10. AI Spend Anomalies Table
        Schema::create('ai_anomalies', function (Blueprint $table) {
            $table->id();
            $table->string('anomaly_code')->unique();
            $table->string('type');
            $table->string('severity')->default('Medium'); // Low, Medium, High
            $table->decimal('confidence_score', 5, 2)->default(95.00);
            $table->string('title');
            $table->text('details');
            $table->string('status')->default('Active'); // Active, Under Review, Dismissed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_anomalies');
        Schema::dropIfExists('approval_logs');
        Schema::dropIfExists('spending_transactions');
        Schema::dropIfExists('budgets');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('procurement_requests');
        Schema::dropIfExists('suppliers');
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['department_id']);
                $table->dropColumn(['role', 'department_id', 'avatar']);
            });
        }
        Schema::dropIfExists('departments');
    }
};
