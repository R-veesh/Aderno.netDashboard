<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcurementRequest extends Model
{
    protected $fillable = [
        'request_code',
        'department_id',
        'requester_id',
        'requester_name',
        'title',
        'description',
        'category',
        'estimated_cost',
        'priority',
        'status',
        'approval_notes'
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function purchaseOrder()
    {
        return $this->hasOne(PurchaseOrder::class, 'procurement_request_id');
    }

    public function approvalLogs()
    {
        return $this->hasMany(ApprovalLog::class);
    }
}
