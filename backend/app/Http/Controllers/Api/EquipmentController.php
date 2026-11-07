<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipment;
use App\Models\SensorReading;
use App\Models\AuditLog;
use Carbon\Carbon;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::with(['category:id,name', 'location:id,name,facility,area', 'owner:id,name']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('asset_tag', 'like', "%{$s}%")
                  ->orWhere('serial_number', 'like', "%{$s}%")
                  ->orWhere('manufacturer', 'like', "%{$s}%");
            });
        }

        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('location_id')) $query->where('location_id', $request->location_id);
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('criticality')) $query->where('criticality', $request->criticality);

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        $perPage = min(max((int)$request->get('per_page', 15), 1), 100);
        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $equipment = Equipment::with([
            'category', 'location', 'owner:id,name', 'thresholds', 'schedules'
        ])->findOrFail($id);

        $metrics = ['temperature', 'vibration', 'pressure', 'current', 'speed', 'oil_level'];
        $latestReadings = [];
        foreach ($metrics as $m) {
            $r = SensorReading::where('equipment_id', $equipment->id)
                ->where('metric', $m)
                ->orderBy('recorded_at', 'desc')
                ->first();
            if ($r) {
                $latestReadings[] = [
                    'metric' => $r->metric,
                    'value' => $r->value,
                    'unit' => $r->unit,
                    'quality' => $r->quality,
                    'is_breach' => $r->is_breach,
                    'recorded_at' => $r->recorded_at?->toIso8601String(),
                ];
            }
        }

        $data = $equipment->toArray();
        $data['latest_readings'] = $latestReadings;

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_tag' => 'required|string|max:64|unique:equipment',
            'name' => 'required|string|max:160',
            'category_id' => 'required|exists:equipment_categories,id',
            'location_id' => 'required|exists:locations,id',
            'manufacturer' => 'nullable|string|max:120',
            'model' => 'nullable|string|max:120',
            'serial_number' => 'nullable|string|max:120',
            'criticality' => 'required|in:low,medium,high,critical',
            'status' => 'required|in:operational,degraded,under_maintenance,offline,decommissioned',
            'commissioned_at' => 'nullable|date',
            'specifications' => 'nullable|array',
            'notes' => 'nullable|string',
            'owner_id' => 'nullable|exists:users,id',
        ]);

        $equipment = Equipment::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'auditable_type' => 'Equipment',
            'auditable_id' => $equipment->id,
            'description' => "Created equipment record {$equipment->asset_tag} ({$equipment->name})",
            'new_values' => $equipment->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Equipment created successfully.',
            'data' => $equipment->load(['category', 'location']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $equipment = Equipment::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:160',
            'category_id' => 'required|exists:equipment_categories,id',
            'location_id' => 'required|exists:locations,id',
            'manufacturer' => 'nullable|string|max:120',
            'model' => 'nullable|string|max:120',
            'serial_number' => 'nullable|string|max:120',
            'criticality' => 'required|in:low,medium,high,critical',
            'commissioned_at' => 'nullable|date',
            'specifications' => 'nullable|array',
            'notes' => 'nullable|string',
            'owner_id' => 'nullable|exists:users,id',
        ]);

        $old = $equipment->toArray();
        $equipment->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'auditable_type' => 'Equipment',
            'auditable_id' => $equipment->id,
            'description' => "Updated equipment specifications for {$equipment->asset_tag}",
            'old_values' => $old,
            'new_values' => $equipment->toArray(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Equipment record updated.',
            'data' => $equipment->load(['category', 'location']),
        ]);
    }

    public function status(Request $request, $id)
    {
        $equipment = Equipment::findOrFail($id);
        $request->validate([
            'status' => 'required|in:operational,degraded,under_maintenance,offline,decommissioned',
            'reason' => 'required|string|max:500',
        ]);

        if ($equipment->status === $request->status) {
            return response()->json([
                'success' => false,
                'message' => 'Equipment is already in this status state.',
            ], 409);
        }

        $oldStatus = $equipment->status;
        $equipment->update(['status' => $request->status]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'status_transition',
            'auditable_type' => 'Equipment',
            'auditable_id' => $equipment->id,
            'description' => "Status transitioned from {$oldStatus} to {$request->status}. Reason: {$request->reason}",
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $request->status, 'reason' => $request->reason],
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Equipment status updated.',
            'data' => $equipment,
        ]);
    }

    public function readings(Request $request, $id)
    {
        $equipment = Equipment::findOrFail($id);
        $metric = $request->validate(['metric' => 'required|string'])['metric'];

        $from = $request->get('from', Carbon::now()->subDays(30)->toDateString());
        $to = $request->get('to', Carbon::now()->toDateString());

        $readings = SensorReading::where('equipment_id', $equipment->id)
            ->where('metric', $metric)
            ->whereBetween('recorded_at', ["{$from} 00:00:00", "{$to} 23:59:59"])
            ->orderBy('recorded_at', 'asc')
            ->limit(1000)
            ->get(['id', 'value', 'quality', 'is_breach', 'recorded_at']);

        $thresholds = $equipment->thresholds()->where('metric', $metric)->where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'data' => $readings,
            'meta' => [
                'metric' => $metric,
                'unit' => $readings->first()?->unit ?? '',
                'thresholds' => $thresholds,
            ],
        ]);
    }

    public function history($id)
    {
        $equipment = Equipment::findOrFail($id);
        $logs = AuditLog::with('user:id,name')
            ->where('auditable_type', 'Equipment')
            ->where('auditable_id', $equipment->id)
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $equipment = Equipment::findOrFail($id);
        $equipment->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'auditable_type' => 'Equipment',
            'auditable_id' => $equipment->id,
            'description' => "Soft-deleted equipment {$equipment->asset_tag}",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Equipment removed from active inventory.',
        ]);
    }
}

