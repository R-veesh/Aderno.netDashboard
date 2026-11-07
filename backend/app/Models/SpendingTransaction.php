<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpendingTransaction extends Model
{
    protected $fillable = [
        'transaction_code',
        'purchase_order_id',
        'vendor_name',
        'department_name',
        'category',
        'description',
        'amount',
        'transaction_date',
        'status'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
