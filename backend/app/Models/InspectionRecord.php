<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InspectionRecord extends Model
{
    protected $fillable = [
        'equipment_id',
        'maintenance_task_id',
        'inspector_id',
        'inspected_at',
        'result',
        'condition_rating',
        'findings',
        'recommendations',
        'next_inspection_due',
        'fault_report_id',
    ];

    protected $casts = [
        'inspected_at' => 'datetime',
        'next_inspection_due' => 'date',
        'condition_rating' => 'integer',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function task()
    {
        return $this->belongsTo(MaintenanceTask::class, 'maintenance_task_id');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function fault()
    {
        return $this->belongsTo(FaultReport::class, 'fault_report_id');
    }
}

