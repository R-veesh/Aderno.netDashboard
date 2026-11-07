<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorReading extends Model
{
    protected $fillable = [
        'equipment_id',
        'metric',
        'value',
        'unit',
        'quality',
        'is_breach',
        'source',
        'notes',
        'recorded_at',
        'recorded_by',
        'alert_id',
    ];

    protected $casts = [
        'value' => 'float',
        'is_breach' => 'boolean',
        'recorded_at' => 'datetime',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function alert()
    {
        return $this->belongsTo(Alert::class);
    }
}

