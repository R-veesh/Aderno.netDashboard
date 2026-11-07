<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ConditionThreshold;
use App\Models\EquipmentCategory;
use App\Models\Location;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class WorkspaceController extends Controller
{
    public static function profile(User $user): array
    {
        $user->load('role');

        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role?->slug, 'permissions' => $user->role?->permissions ?? [], 'is_active' => $user->is_active];
    }

    public function index(Request $request)
    {
        $resource = $request->segment(2);
        $query = match ($resource) {
            'users' => User::with('role'),
            'invitations' => DB::table('invitations'),
            'categories' => EquipmentCategory::query(),
            'locations' => Location::query(),
            'thresholds' => ConditionThreshold::with('equipment:id,asset_tag'),
        };
        $page = $query->orderByDesc('id')->paginate(20);
        $data = $resource === 'users' ? collect($page->items())->map(fn ($user) => self::profile($user)) : $page->items();

        return response()->json(['data' => $data, 'meta' => ['current_page' => $page->currentPage(), 'last_page' => $page->lastPage(), 'total' => $page->total()]]);
    }

    public function save(Request $request, $id = null)
    {
        $resource = $request->segment(2);
        $result = DB::transaction(function () use ($request, $resource, $id) {
            if ($resource === 'users') {
                $data = $request->validate(['role' => ['required', Rule::exists('roles', 'slug')], 'is_active' => 'required|boolean']);
                $user = User::findOrFail($id);
                abort_if($user->id === $request->user()->id, 422, 'You cannot change your own access.');
                abort_if($user->role?->slug === 'super_admin' && (! $data['is_active'] || $data['role'] !== 'super_admin') && User::where('is_active', true)->whereHas('role', fn ($q) => $q->where('slug', 'super_admin'))->count() <= 1, 422, 'Keep at least one active super administrator.');
                $user->update(['role_id' => Role::where('slug', $data['role'])->firstOrFail()->id, 'is_active' => $data['is_active']]);
                if (! $data['is_active']) {
                    $user->tokens()->delete();
                }

                return self::profile($user);
            }
            if ($resource === 'invitations') {
                $data = $request->validate(['email' => 'required|email|max:160', 'role' => ['required', Rule::exists('roles', 'slug')], 'notes' => 'nullable|string|max:2000']);
                abort_if($data['role'] === 'super_admin' && ! $request->user()->hasPermission('users.manage'), 403, 'Only super admins can invite another super admin.');
                $data['email'] = strtolower($data['email']);
                DB::table('invitations')->where('email', $data['email'])->where('status', 'pending')->update(['status' => 'revoked', 'updated_at' => now()]);
                $data += ['invite_code' => Str::random(48), 'status' => 'pending', 'invited_by' => $request->user()->id, 'expires_at' => now()->addDays(7), 'created_at' => now(), 'updated_at' => now()];
                $data['id'] = DB::table('invitations')->insertGetId($data);

                return $data;
            }
            $model = match ($resource) {
                'categories' => EquipmentCategory::class, 'locations' => Location::class, 'thresholds' => ConditionThreshold::class
            };
            $rules = match ($resource) {
                'categories' => ['name' => ['required', 'string', 'max:120', Rule::unique('equipment_categories')->ignore($id)], 'description' => 'nullable|string|max:2000'],
                'locations' => ['name' => ['required', 'string', 'max:120', Rule::unique('locations')->where('facility', $request->facility)->ignore($id)], 'facility' => 'required|string|max:120', 'area' => 'nullable|string|max:120'],
                'thresholds' => ['equipment_id' => 'required|exists:equipment,id', 'metric' => ['required', 'string', 'max:64', Rule::unique('condition_thresholds')->where('equipment_id', $request->equipment_id)->where('severity', $request->severity)->ignore($id)], 'min_value' => 'nullable|numeric|required_without:max_value', 'max_value' => 'nullable|numeric|required_without:min_value', 'severity' => 'required|in:warning,critical'],
            };
            $data = $request->validate($rules);
            if ($resource === 'categories') {
                $data['slug'] = Str::slug($data['name']).'-'.substr(hash('sha256', $data['name']), 0, 8);
            }
            if ($resource === 'thresholds') {
                abort_if(isset($data['min_value'], $data['max_value']) && $data['min_value'] > $data['max_value'], 422, 'Minimum must not exceed maximum.');
                $data['is_active'] = true;
                $data['created_by'] = $request->user()->id;
            }
            $record = $id ? $model::findOrFail($id) : new $model;
            $record->fill($data)->save();

            return $record;
        });
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $id ? 'updated' : 'created', 'auditable_type' => $resource, 'auditable_id' => $result['id'], 'description' => ($id ? 'Updated ' : 'Created ').$resource.' record #'.$result['id'], 'ip_address' => $request->ip()]);

        return response()->json(['data' => $result, 'message' => 'Record saved.'], $id ? 200 : 201);
    }

    public function destroy(Request $request, $id)
    {
        $resource = $request->segment(2);
        if ($resource === 'invitations') {
            abort_unless(DB::table('invitations')->where('id', $id)->where('status', 'pending')->update(['status' => 'revoked', 'updated_at' => now()]), 409, 'Invitation is no longer pending.');
        } else {
            $model = match ($resource) {
                'categories' => EquipmentCategory::class, 'locations' => Location::class, 'thresholds' => ConditionThreshold::class
            };
            $record = $model::findOrFail($id);
            if ($resource !== 'thresholds') {
                abort_if($record->equipment()->withTrashed()->exists(), 409, 'This record is used by equipment and cannot be deleted.');
            }
            $record->delete();
        }

        return response()->json(['message' => $resource === 'invitations' ? 'Invitation revoked.' : 'Record deleted.']);
    }
}
