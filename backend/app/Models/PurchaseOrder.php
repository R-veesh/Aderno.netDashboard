<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_number',
        'procurement_request_id',
        'supplier_id',
        'title',
        'total_amount',
        'delivery_date',
        'status',
        'payment_status',
        'items_count'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_date' => 'date'
    ];

    public function procurementRequest()
    {
        return $this->belongsTo(ProcurementRequest::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function transactions()
    {
        return $this->hasMany(SpendingTransaction::class);
    }
}
