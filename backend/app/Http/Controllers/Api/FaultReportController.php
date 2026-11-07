<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FaultReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FaultReportController extends Controller
{
    public function index(Request $request)
    {
        $query = FaultReport::with(['equipment:id,asset_tag,name', 'reporter:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }
        if ($request->filled('fault_type')) {
            $query->where('fault_type', $request->fault_type);
        }
        if ($request->filled('equipment_id')) {
            $query->where('equipment_id', $request->equipment_id);
        }

        $query->orderBy('occurred_at', 'desc');
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

    public function show($id)
    {
        $fault = FaultReport::with([
            'equipment', 'reporter', 'repairs.performer:id,name', 'tasks',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $fault,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'title' => 'required|string|max:180',
            'description' => 'required|string',
            'fault_type' => 'required|in:mechanical,electrical,hydraulic,pneumatic,instrumentation,software,other',
            'severity' => 'required|in:minor,major,critical',
            'occurred_at' => 'required|date',
            'downtime_start' => 'nullable|date',
        ]);

        $ref = 'FLT-'.Str::ulid();
        $validated['reference'] = $ref;
        $validated['status'] = 'reported';
        $validated['reported_by'] = $request->user()->id;

        $fault = FaultReport::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Fault report logged.',
            'data' => $fault->load('equipment'),
        ], 201);
    }

    public function investigate(Request $request, $id)
    {
        $fault = FaultReport::findOrFail($id);
        abort_unless($fault->status === 'reported', 409, 'Invalid fault status transition.');
        $fault->update(['status' => 'investigating']);

        return response()->json(['success' => true, 'message' => 'Status transitioned to investigating.', 'data' => $fault]);
    }

    public function startRepair(Request $request, $id)
    {
        $fault = FaultReport::findOrFail($id);
        abort_unless($fault->status === 'investigating', 409, 'Invalid fault status transition.');
        $fault->update(['status' => 'in_repair']);

        return response()->json(['success' => true, 'message' => 'Status transitioned to in repair.', 'data' => $fault]);
    }

    public function resolve(Request $request, $id)
    {
        $fault = FaultReport::findOrFail($id);
        abort_unless($fault->status === 'in_repair', 409, 'Invalid fault status transition.');
        $request->validate([
            'resolution_summary' => 'required|string',
            'root_cause' => 'nullable|string',
            'downtime_minutes' => 'nullable|integer|min:0',
        ]);

        $fault->update([
            'status' => 'resolved',
            'resolved_at' => Carbon::now(),
            'resolution_summary' => $request->resolution_summary,
            'root_cause' => $request->root_cause ?? $fault->root_cause,
            'downtime_minutes' => $request->downtime_minutes ?? $fault->downtime_minutes,
        ]);

        return response()->json(['success' => true, 'message' => 'Fault marked as resolved.', 'data' => $fault]);
    }

    public function close(Request $request, $id)
    {
        $fault = FaultReport::findOrFail($id);
        abort_unless($fault->status === 'resolved', 409, 'Invalid fault status transition.');
        $fault->update([
            'status' => 'closed',
            'closed_at' => Carbon::now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Fault record closed.', 'data' => $fault]);
    }
}
