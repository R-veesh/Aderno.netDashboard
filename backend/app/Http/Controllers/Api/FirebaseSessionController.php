<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FirebaseSessionController extends Controller
{
    public function store(Request $request)
    {
        $input = $request->validate(['id_token' => 'required|string|max:8192', 'invite_code' => 'nullable|string|max:64']);
        abort_unless(config('firebase.api_key'), 503, 'Firebase API key is not configured on the server.');
        try {
            $response = Http::timeout(12)->post('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='.urlencode(config('firebase.api_key')), ['idToken' => $input['id_token']]);
        } catch (ConnectionException $exception) {
            abort(503, 'Unable to verify your sign-in. Please retry.');
        }
        abort_unless($response->successful(), 401, 'Firebase session is invalid. Please sign in again.');
        $identity = $response->json('users.0');
        abort_unless($identity && ! ($identity['disabled'] ?? false) && ! empty($identity['email']), 401, 'This identity cannot access the workspace.');
        $email = strtolower($identity['email']);

        $user = DB::transaction(function () use ($identity, $email, $input) {
            $invite = null;
            if (! empty($input['invite_code'])) {
                $invite = DB::table('invitations')->where('invite_code', $input['invite_code'])->where('email', $email)->first();
                abort_unless($invite && ($invite->status === 'accepted' || ($invite->status === 'pending' && now()->lt($invite->expires_at))), 403, 'This invitation is invalid, expired, revoked, or belongs to another email.');
                abort_unless($identity['emailVerified'] ?? false, 403, 'Verify your email before accepting an invitation.');
            }
            $user = User::where('firebase_uid', $identity['localId'])->first();
            if (! $user) {
                // Do not silently link an existing SQL account by an unverified email.
                $existing = User::where('email', $email)->first();
                abort_if($existing && (! ($identity['emailVerified'] ?? false) || $existing->firebase_uid), 403, 'Account linking requires a verified email.');
                $user = $existing ?? new User(['email' => $email, 'password' => Str::random(64), 'is_active' => true, 'role_id' => Role::where('slug', $invite?->role ?? 'super_admin')->firstOrFail()->id]);
                $user->firebase_uid = $identity['localId'];
                $user->name = $identity['displayName'] ?? explode('@', $email)[0];
                $user->save();
            }
            if ($invite && $invite->status === 'pending') {
                    abort_if($user->role?->slug === 'super_admin' && $invite->role !== 'super_admin', 409, 'A super administrator cannot change their own role through an invitation.');
                    abort_unless($identity['emailVerified'] ?? false, 403, 'Verify your email before accepting an invitation.');
                    $user->update(['role_id' => Role::where('slug', $invite->role)->firstOrFail()->id, 'is_active' => true]);
                    DB::table('invitations')->where('id', $invite->id)->update(['status' => 'accepted', 'updated_at' => now()]);
            }

            return $user;
        });
        abort_unless($user->is_active, 403, 'Your account is awaiting administrator approval or has been disabled.');
        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('firebase-workspace', ['*'], now()->addHour())->plainTextToken;

        return response()->json(['data' => ['token' => $token, 'user' => WorkspaceController::profile($user)]]);
    }
}
