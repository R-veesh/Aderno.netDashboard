<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'code',
        'category',
        'contact_person',
        'email',
        'phone',
        'tax_id',
        'payment_terms',
        'status',
        'rating',
        'ytd_spend',
        'risk_level',
        'on_time_delivery_rate'
    ];

    protected $casts = [
        'rating' => 'float',
        'ytd_spend' => 'decimal:2'
    ];

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
