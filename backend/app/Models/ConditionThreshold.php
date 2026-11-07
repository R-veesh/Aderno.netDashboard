<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConditionThreshold extends Model
{
    protected $fillable = [
        'equipment_id',
        'metric',
        'min_value',
        'max_value',
        'severity',
        'is_active',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'min_value' => 'float',
        'max_value' => 'float',
        'is_active' => 'boolean',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

