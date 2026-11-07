<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\AuditLog;
use App\Models\Equipment;
use App\Models\FaultReport;
use App\Models\MaintenanceTask;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $equipmentTotal = Equipment::count();
        $equipmentOperational = Equipment::where('status', 'operational')->count();
        $equipmentAttention = Equipment::whereIn('status', ['degraded', 'offline'])->count();
        $equipmentUnderMaint = Equipment::where('status', 'under_maintenance')->count();

        $openAlerts = Alert::where('status', 'open')->count();
        $criticalAlerts = Alert::where('status', 'open')->where('severity', 'critical')->count();
        $openFaults = FaultReport::whereIn('status', ['reported', 'investigating', 'in_repair'])->count();

        $now = Carbon::now();
        $overdueTasks = MaintenanceTask::whereIn('status', ['open', 'in_progress'])
            ->where('due_date', '<', $now->toDateString())
            ->count();

        $tasksDue7d = MaintenanceTask::whereIn('status', ['open', 'in_progress'])
            ->whereDate('due_date', '>=', $now->toDateString())->whereDate('due_date', '<=', $now->copy()->addDays(7)->toDateString())
            ->count();

        $downtime30d = (int) FaultReport::where('occurred_at', '>=', $now->copy()->subDays(30))
            ->sum('downtime_minutes');

        // Status counts
        $byStatus = Equipment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Alerts trend (last 14 days)
        $alertsTrend = [];
        for ($i = 13; $i >= 0; $i--) {
            $day = $now->copy()->subDays($i)->toDateString();
            $alertsTrend[] = [
                'date' => $day,
                'warning' => Alert::whereDate('first_triggered_at', $day)->where('severity', 'warning')->count(),
                'critical' => Alert::whereDate('first_triggered_at', $day)->where('severity', 'critical')->count(),
            ];
        }

        // Faults by type
        $faultsByType = FaultReport::select('fault_type', DB::raw('count(*) as count'))
            ->where('occurred_at', '>=', $now->copy()->subDays(90))
            ->groupBy('fault_type')
            ->get();

        // Attention Required equipment
        $attentionList = Equipment::with(['location:id,name,facility'])
            ->where(function ($q) {
                $q->whereIn('status', ['degraded', 'offline'])
                    ->orWhereHas('alerts', function ($aq) {
                        $aq->where('status', 'open');
                    });
            })
            ->take(5)
            ->get()
            ->map(function ($eq) {
                $reasons = [];
                if ($eq->status === 'degraded') {
                    $reasons[] = 'Operating under degraded performance baseline';
                }
                if ($eq->status === 'offline') {
                    $reasons[] = 'Unit is currently offline';
                }
                $openCount = $eq->alerts()->where('status', 'open')->count();
                if ($openCount > 0) {
                    $reasons[] = "{$openCount} active threshold alert(s)";
                }

                return [
                    'equipment' => [
                        'id' => $eq->id,
                        'asset_tag' => $eq->asset_tag,
                        'name' => $eq->name,
                        'status' => $eq->status,
                        'criticality' => $eq->criticality,
                        'location' => $eq->location,
                    ],
                    'reasons' => $reasons,
                ];
            });

        // Upcoming tasks
        $upcomingTasks = MaintenanceTask::with(['equipment:id,asset_tag,name', 'assignee:id,name'])
            ->whereIn('status', ['open', 'in_progress'])
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get();

        // Recent alerts
        $recentAlerts = Alert::with(['equipment:id,asset_tag,name'])
            ->where('status', 'open')
            ->orderBy('last_triggered_at', 'desc')
            ->take(5)
            ->get();

        // Recent activity
        $recentActivity = AuditLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'kpis' => [
                    'equipment_total' => $equipmentTotal,
                    'equipment_operational' => $equipmentOperational,
                    'equipment_attention' => $equipmentAttention,
                    'equipment_under_maintenance' => $equipmentUnderMaint,
                    'open_alerts' => $openAlerts,
                    'critical_alerts' => $criticalAlerts,
                    'open_faults' => $openFaults,
                    'overdue_tasks' => $overdueTasks,
                    'tasks_due_7d' => $tasksDue7d,
                    'downtime_minutes_30d' => $downtime30d,
                    'mttr_hours' => null,
                    'mtbf_hours' => null,
                    'completion_rate_30d' => ($total = MaintenanceTask::whereDate('due_date', '>=', $now->copy()->subDays(30)->toDateString())->whereDate('due_date', '<=', $now->toDateString())->where('status', '!=', 'cancelled')->count()) ? round(100 * MaintenanceTask::whereDate('due_date', '>=', $now->copy()->subDays(30)->toDateString())->whereDate('due_date', '<=', $now->toDateString())->where('status', 'completed')->count() / $total, 1) : null,
                ],
                'equipment_by_status' => $byStatus,
                'alerts_trend' => $alertsTrend,
                'faults_by_type' => $faultsByType,
                'attention_required' => $attentionList,
                'upcoming_tasks' => $upcomingTasks,
                'recent_alerts' => $recentAlerts,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
