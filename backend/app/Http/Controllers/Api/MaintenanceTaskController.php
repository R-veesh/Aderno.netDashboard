<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceTask;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MaintenanceTaskController extends Controller
{
    public function index(Request $request)
    {
        $query = MaintenanceTask::with([
            'equipment:id,asset_tag,name',
            'assignee:id,name',
            'schedule:id,title',
            'fault:id,reference',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('equipment_id')) {
            $query->where('equipment_id', $request->equipment_id);
        }
        if ($request->get('assigned_to') === 'me') {
            $query->where('assigned_to', $request->user()->id);
        }

        $query->orderBy('due_date', 'asc');
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
        $task = MaintenanceTask::with([
            'equipment', 'assignee', 'completedBy', 'creator', 'schedule', 'fault', 'inspections', 'repairs',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $task,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'title' => 'required|string|max:180',
            'description' => 'nullable|string',
            'type' => 'required|in:preventive,inspection,calibration,lubrication,corrective,repair',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'required|date',
            'assigned_to' => 'nullable|exists:users,id',
            'schedule_id' => 'nullable|exists:maintenance_schedules,id',
            'fault_report_id' => 'nullable|exists:fault_reports,id',
        ]);

        $ref = 'MT-'.Str::ulid();
        $validated['reference'] = $ref;
        $validated['status'] = 'open';
        $validated['created_by'] = $request->user()->id;

        $task = MaintenanceTask::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance task created.',
            'data' => $task->load(['equipment', 'assignee']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $task = MaintenanceTask::findOrFail($id);
        abort_unless(in_array($task->status, ['open', 'in_progress', 'on_hold']), 409, 'Finished work orders cannot be edited.');
        $data = $request->validate([
            'title' => 'required|string|max:180',
            'description' => 'nullable|string',
            'type' => 'required|in:preventive,inspection,calibration,lubrication,corrective,repair',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'required|date',
            'assigned_to' => ['nullable', Rule::exists('users', 'id')->where('is_active', true)],
        ]);
        $task->update($data);

        return response()->json(['message' => 'Work order updated.', 'data' => $task->load(['equipment', 'assignee'])]);
    }

    public function start(Request $request, $id)
    {
        $task = MaintenanceTask::findOrFail($id);
        if ($task->status !== 'open' && $task->status !== 'on_hold') {
            return response()->json(['success' => false, 'message' => 'Task cannot be started from current status.'], 409);
        }

        $task->update([
            'status' => 'in_progress',
            'started_at' => $task->started_at ?? Carbon::now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Task started.', 'data' => $task]);
    }

    public function complete(Request $request, $id)
    {
        $task = MaintenanceTask::findOrFail($id);
        abort_unless($task->status === 'in_progress', 409, 'Start the task before completing it.');
        $request->validate([
            'completion_notes' => 'required|string',
            'downtime_minutes' => 'nullable|integer|min:0',
        ]);

        $task->update([
            'status' => 'completed',
            'completed_at' => Carbon::now(),
            'completed_by' => $request->user()->id,
            'completion_notes' => $request->completion_notes,
            'downtime_minutes' => $request->downtime_minutes ?? 0,
        ]);

        return response()->json(['success' => true, 'message' => 'Task completed successfully.', 'data' => $task]);
    }

    public function cancel(Request $request, $id)
    {
        $task = MaintenanceTask::findOrFail($id);
        abort_unless(in_array($task->status, ['open', 'in_progress', 'on_hold']), 409, 'This task is already finished.');
        $request->validate(['reason' => 'required|string']);

        $task->update([
            'status' => 'cancelled',
            'cancel_reason' => $request->reason,
        ]);

        return response()->json(['success' => true, 'message' => 'Task cancelled.', 'data' => $task]);
    }
}
