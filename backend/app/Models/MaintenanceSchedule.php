<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceSchedule extends Model
{
    protected $fillable = [
        'equipment_id',
        'title',
        'description',
        'type',
        'frequency_value',
        'frequency_unit',
        'start_date',
        'next_due_date',
        'last_completed_at',
        'estimated_duration_minutes',
        'status',
        'default_assignee_id',
    ];

    protected $casts = [
        'start_date' => 'date',
        'next_due_date' => 'date',
        'last_completed_at' => 'datetime',
        'frequency_value' => 'integer',
        'estimated_duration_minutes' => 'integer',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function defaultAssignee()
    {
        return $this->belongsTo(User::class, 'default_assignee_id');
    }

    public function tasks()
    {
        return $this->hasMany(MaintenanceTask::class, 'schedule_id');
    }
}

