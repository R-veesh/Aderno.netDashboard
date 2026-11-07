<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use SoftDeletes;

    protected $table = 'equipment';

    protected $fillable = [
        'asset_tag',
        'name',
        'category_id',
        'location_id',
        'manufacturer',
        'model',
        'serial_number',
        'criticality',
        'status',
        'commissioned_at',
        'specifications',
        'notes',
        'owner_id',
        'last_reading_at',
    ];

    protected $casts = [
        'commissioned_at' => 'date',
        'last_reading_at' => 'datetime',
        'specifications' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(EquipmentCategory::class, 'category_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function thresholds()
    {
        return $this->hasMany(ConditionThreshold::class);
    }

    public function readings()
    {
        return $this->hasMany(SensorReading::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    public function schedules()
    {
        return $this->hasMany(MaintenanceSchedule::class);
    }

    public function tasks()
    {
        return $this->hasMany(MaintenanceTask::class);
    }

    public function inspections()
    {
        return $this->hasMany(InspectionRecord::class);
    }

    public function faults()
    {
        return $this->hasMany(FaultReport::class);
    }
}

