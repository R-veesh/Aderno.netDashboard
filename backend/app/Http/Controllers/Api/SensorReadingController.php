<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\ConditionThreshold;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SensorReadingController extends Controller
{
    public function index(Request $request)
    {
        $query = SensorReading::with(['equipment:id,asset_tag,name', 'recorder:id,name']);

        if ($request->filled('equipment_id')) {
            $query->where('equipment_id', $request->equipment_id);
        }
        if ($request->filled('metric')) {
            $query->where('metric', $request->metric);
        }
        if ($request->filled('quality')) {
            $query->where('quality', $request->quality);
        }
        if ($request->filled('breach')) {
            $query->where('is_breach', (bool) $request->breach);
        }

        $sort = $request->get('sort', 'recorded_at');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        $paginated = $query->paginate($request->get('per_page', 20));

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'metric' => 'required|string',
            'value' => 'nullable|numeric',
            'unit' => 'required|string',
            'quality' => 'nullable|in:valid,missing,invalid,incomplete',
            'notes' => 'nullable|string',
            'recorded_at' => 'required|date',
        ]);

        $quality = $validated['quality'] ?? 'valid';
        if (is_null(($validated['value'] ?? null))) {
            $quality = 'missing';
        }

        $isBreach = false;
        $alertCreated = false;

        if ($quality === 'valid' && ! is_null(($validated['value'] ?? null))) {
            $threshold = ConditionThreshold::where('equipment_id', $validated['equipment_id'])
                ->where('metric', $validated['metric'])
                ->where('is_active', true)
                ->where(function ($query) use ($validated) {
                    $query->where('min_value', '>', $validated['value'])->orWhere('max_value', '<', $validated['value']);
                })
                ->orderByRaw("CASE WHEN severity = 'critical' THEN 0 ELSE 1 END")
                ->first();

            if ($threshold) {
                if (($threshold->max_value !== null && ($validated['value'] ?? null) > $threshold->max_value) ||
                    ($threshold->min_value !== null && ($validated['value'] ?? null) < $threshold->min_value)) {
                    $isBreach = true;

                    // Open alert check
                    $existingAlert = Alert::where('equipment_id', $validated['equipment_id'])
                        ->where('status', 'open')
                        ->where('metric', $validated['metric'])
                        ->first();

                    if ($existingAlert) {
                        $existingAlert->increment('occurrences');
                        $existingAlert->update([
                            'reading_value' => ($validated['value'] ?? null),
                            'last_triggered_at' => Carbon::now(),
                        ]);
                    } else {
                        Alert::create([
                            'equipment_id' => $validated['equipment_id'],
                            'type' => 'threshold_breach',
                            'severity' => $threshold->severity,
                            'status' => 'open',
                            'title' => "Threshold Breach: {$validated['metric']} on Equipment #{$validated['equipment_id']}",
                            'message' => "Value {$validated['value']} {$validated['unit']} breached configured limit.",
                            'metric' => $validated['metric'],
                            'reading_value' => ($validated['value'] ?? null),
                            'threshold_id' => $threshold->id,
                            'first_triggered_at' => Carbon::now(),
                            'last_triggered_at' => Carbon::now(),
                        ]);
                        $alertCreated = true;
                    }
                }
            }
        }

        $reading = SensorReading::create([
            'equipment_id' => $validated['equipment_id'],
            'metric' => $validated['metric'],
            'value' => ($validated['value'] ?? null),
            'unit' => $validated['unit'],
            'quality' => $quality,
            'is_breach' => $isBreach,
            'source' => 'manual',
            'notes' => $validated['notes'] ?? null,
            'recorded_at' => $validated['recorded_at'],
            'recorded_by' => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sensor reading recorded.',
            'data' => $reading->load('equipment:id,asset_tag,name'),
            'meta' => [
                'alert_created' => $alertCreated,
            ],
        ], 201);
    }
}
