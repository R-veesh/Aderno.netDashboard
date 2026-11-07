<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'department_id',
        'fiscal_year',
        'fiscal_quarter',
        'allocated_amount',
        'spent_amount',
        'threshold_warning_percentage',
        'status'
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:2',
        'spent_amount' => 'decimal:2',
        'threshold_warning_percentage' => 'integer'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
