<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Role;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|string|email|max:160|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'job_title' => 'nullable|string|max:120',
            'organization' => 'nullable|string|max:160',
        ]);

        $viewerRole = Role::where('slug', 'viewer')->first();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'job_title' => $validated['job_title'] ?? null,
            'organization' => $validated['organization'] ?? null,
            'role_id' => $viewerRole?->id,
            'is_active' => false, // Requires administrator activation
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration request submitted. An administrator must activate your access.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => 'pending',
                ],
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::with('role')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is pending administrator activation or has been disabled.',
            ], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('bravik_session', ['*'], Carbon::now()->addHours(8))->plainTextToken;
        $user->update(['last_login_at' => Carbon::now()]);

        return response()->json([
            'success' => true,
            'message' => 'Authentication successful.',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_at' => Carbon::now()->addHours(8)->toIso8601String(),
                'user' => $this->formatUser($user),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('role');
        return response()->json([
            'success' => true,
            'data' => $this->formatUser($user),
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'job_title' => 'nullable|string|max:120',
            'phone' => 'nullable|string|max:32',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated.',
            'data' => $this->formatUser($user->load('role')),
        ]);
    }

    public function password(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'job_title' => $user->job_title,
            'phone' => $user->phone,
            'organization' => $user->organization,
            'is_active' => (bool)$user->is_active,
            'status' => $user->is_active ? 'active' : 'pending',
            'role' => $user->role ? [
                'id' => $user->role->id,
                'slug' => $user->role->slug,
                'name' => $user->role->name,
            ] : null,
            'permissions' => $user->role->permissions ?? [],
            'last_login_at' => $user->last_login_at?->toIso8601String(),
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }
}

