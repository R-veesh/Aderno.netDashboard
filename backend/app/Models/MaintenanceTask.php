<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceTask extends Model
{
    protected $fillable = [
        'reference',
        'equipment_id',
        'schedule_id',
        'fault_report_id',
        'title',
        'description',
        'type',
        'priority',
        'status',
        'assigned_to',
        'due_date',
        'started_at',
        'completed_at',
        'completed_by',
        'completion_notes',
        'downtime_minutes',
        'hold_reason',
        'cancel_reason',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'downtime_minutes' => 'integer',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function schedule()
    {
        return $this->belongsTo(MaintenanceSchedule::class, 'schedule_id');
    }

    public function fault()
    {
        return $this->belongsTo(FaultReport::class, 'fault_report_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function inspections()
    {
        return $this->hasMany(InspectionRecord::class);
    }

    public function repairs()
    {
        return $this->hasMany(RepairRecord::class);
    }
}

