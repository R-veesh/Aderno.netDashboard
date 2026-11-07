<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $query = Alert::with(['equipment:id,asset_tag,name,location_id', 'equipment.location:id,facility,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('equipment_id')) {
            $query->where('equipment_id', $request->equipment_id);
        }

        $query->orderBy('last_triggered_at', 'desc');
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

    public function acknowledge(Request $request, $id)
    {
        $alert = Alert::findOrFail($id);
        if ($alert->status !== 'open') {
            return response()->json(['success' => false, 'message' => 'Alert is not in open status.'], 409);
        }

        $alert->update([
            'status' => 'acknowledged',
            'acknowledged_by' => $request->user()->id,
            'acknowledged_at' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alert marked as acknowledged.',
            'data' => $alert,
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $alert = Alert::findOrFail($id);
        abort_unless(in_array($alert->status, ['open', 'acknowledged']), 409, 'This alert is already finished.');
        $request->validate(['resolution_notes' => 'required|string']);

        $alert->update([
            'status' => 'resolved',
            'resolved_by' => $request->user()->id,
            'resolved_at' => Carbon::now(),
            'resolution_notes' => $request->resolution_notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alert marked as resolved.',
            'data' => $alert,
        ]);
    }

    public function dismiss(Request $request, $id)
    {
        $alert = Alert::findOrFail($id);
        abort_unless(in_array($alert->status, ['open', 'acknowledged']), 409, 'This alert is already finished.');
        $request->validate(['resolution_notes' => 'required|string']);

        $alert->update([
            'status' => 'dismissed',
            'resolved_by' => $request->user()->id,
            'resolved_at' => Carbon::now(),
            'resolution_notes' => 'Dismissed: '.$request->resolution_notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alert dismissed.',
            'data' => $alert,
        ]);
    }
}
