<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use App\Models\Location;
use App\Models\Role;
use App\Models\User;

class LookupController extends Controller
{
    public function lookups()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'enums' => [
                    'equipment_status' => ['operational', 'degraded', 'under_maintenance', 'offline', 'decommissioned'],
                    'criticality' => ['low', 'medium', 'high', 'critical'],
                    'reading_quality' => ['valid', 'missing', 'invalid', 'incomplete'],
                    'reading_source' => ['manual', 'batch', 'integration'],
                    'threshold_severity' => ['warning', 'critical'],
                    'alert_type' => ['threshold_breach', 'data_quality', 'maintenance_overdue'],
                    'alert_severity' => ['info', 'warning', 'critical'],
                    'alert_status' => ['open', 'acknowledged', 'resolved', 'dismissed'],
                    'schedule_type' => ['preventive', 'inspection', 'calibration', 'lubrication'],
                    'task_type' => ['preventive', 'inspection', 'calibration', 'lubrication', 'corrective', 'repair'],
                    'frequency_unit' => ['days', 'weeks', 'months'],
                    'schedule_status' => ['active', 'paused'],
                    'task_priority' => ['low', 'medium', 'high', 'urgent'],
                    'task_status' => ['open', 'in_progress', 'on_hold', 'completed', 'cancelled'],
                    'inspection_result' => ['pass', 'pass_with_observations', 'fail'],
                    'fault_type' => ['mechanical', 'electrical', 'hydraulic', 'pneumatic', 'instrumentation', 'software', 'other'],
                    'fault_severity' => ['minor', 'major', 'critical'],
                    'fault_status' => ['reported', 'investigating', 'in_repair', 'resolved', 'closed'],
                    'repair_outcome' => ['fixed', 'temporary_fix', 'not_fixed'],
                    'inquiry_status' => ['new', 'in_progress', 'closed'],
                    'inquiry_interest' => ['demo', 'pricing', 'implementation', 'support', 'other'],
                    'roles' => ['super_admin', 'admin', 'manager', 'technician', 'viewer'],
                ],
                'roles' => Role::all(['id', 'slug', 'name']),
                'equipment' => Equipment::orderBy('asset_tag')->get(['id', 'asset_tag', 'name']),
                'categories' => EquipmentCategory::all(['id', 'name']),
                'locations' => Location::all(['id', 'name', 'facility', 'area']),
                'users' => User::where('is_active', true)->with('role:id,name,slug')->get(['id', 'name', 'role_id']),
                'metrics' => [
                    ['key' => 'temperature', 'label' => 'Bearing/Surface Temperature', 'unit' => '°C', 'min' => -20, 'max' => 200],
                    ['key' => 'vibration', 'label' => 'Overall Vibration Velocity', 'unit' => 'mm/s', 'min' => 0, 'max' => 50],
                    ['key' => 'pressure', 'label' => 'Discharge/System Pressure', 'unit' => 'bar', 'min' => 0, 'max' => 300],
                    ['key' => 'current', 'label' => 'Motor Operating Current', 'unit' => 'A', 'min' => 0, 'max' => 1000],
                    ['key' => 'speed', 'label' => 'Shaft Rotational Speed', 'unit' => 'rpm', 'min' => 0, 'max' => 12000],
                    ['key' => 'oil_level', 'label' => 'Lube Reservoir Level', 'unit' => '%', 'min' => 0, 'max' => 100],
                    ['key' => 'humidity', 'label' => 'Ambient Cabinet Humidity', 'unit' => '%', 'min' => 0, 'max' => 100],
                ],
            ],
        ]);
    }
}
