<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = [
        'equipment_id',
        'type',
        'severity',
        'status',
        'title',
        'message',
        'occurrences',
        'metric',
        'reading_value',
        'threshold_id',
        'first_triggered_at',
        'last_triggered_at',
        'acknowledged_by',
        'acknowledged_at',
        'resolved_by',
        'resolved_at',
        'resolution_notes',
    ];

    protected $casts = [
        'occurrences' => 'integer',
        'reading_value' => 'float',
        'first_triggered_at' => 'datetime',
        'last_triggered_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function threshold()
    {
        return $this->belongsTo(ConditionThreshold::class);
    }

    public function acknowledgedBy()
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}

