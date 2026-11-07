<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairRecord extends Model
{
    protected $fillable = [
        'fault_report_id',
        'equipment_id',
        'maintenance_task_id',
        'performed_by',
        'started_at',
        'completed_at',
        'action_taken',
        'parts_replaced',
        'labor_hours',
        'cost',
        'outcome',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'labor_hours' => 'float',
        'cost' => 'float',
    ];

    public function fault()
    {
        return $this->belongsTo(FaultReport::class, 'fault_report_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function task()
    {
        return $this->belongsTo(MaintenanceTask::class, 'maintenance_task_id');
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}

