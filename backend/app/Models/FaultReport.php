<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaultReport extends Model
{
    protected $fillable = [
        'reference',
        'equipment_id',
        'title',
        'description',
        'fault_type',
        'severity',
        'status',
        'occurred_at',
        'reported_by',
        'downtime_start',
        'downtime_end',
        'downtime_minutes',
        'root_cause',
        'resolution_summary',
        'alert_id',
        'resolved_at',
        'closed_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'downtime_start' => 'datetime',
        'downtime_end' => 'datetime',
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
        'downtime_minutes' => 'integer',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function alert()
    {
        return $this->belongsTo(Alert::class);
    }

    public function repairs()
    {
        return $this->hasMany(RepairRecord::class);
    }

    public function tasks()
    {
        return $this->hasMany(MaintenanceTask::class);
    }
}

