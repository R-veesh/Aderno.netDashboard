<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class WorkspaceAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        abort_unless($user?->is_active, 403, 'Your workspace access has been disabled.');
        $resource = $request->segment(2);
        $action = $request->route()->getActionMethod();
        $permission = match ($resource) {
            'users' => 'users.manage',
            'invitations' => 'invitations.manage',
            default => null,
        };
        if (! $request->isMethod('GET')) {
            $permission ??= match ($resource) {
                'equipment' => 'equipment.manage',
                'categories', 'locations' => 'reference.manage',
                'thresholds' => 'thresholds.manage',
                'maintenance-tasks' => in_array($action, ['start', 'complete']) ? 'tasks.work' : 'tasks.manage',
                'sensor-readings' => 'readings.create',
                'alerts' => $action === 'acknowledge' ? 'alerts.acknowledge' : 'alerts.manage',
                'faults' => $action === 'store' ? 'faults.report' : 'faults.manage',
                default => null,
            };
        }
        abort_if($permission && ! $user->hasPermission($permission), 403, 'You do not have permission to perform this action.');

        return $next($request);
    }
}
