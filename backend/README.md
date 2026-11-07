# Bravik backend

Laravel API with SQLite persistence, Firebase sign-in verification and server-side role permissions.

## Setup

Requires PHP 8.3+ with pdo_sqlite, curl and mbstring, and Composer. On this Windows machine PHP is installed in `C:/laragon/bin/php/php-8.3.33-Win32-vs16-x64`; add that directory to your terminal PATH if needed.

From `backend`:

```sh
composer install
# Copy .env.example to .env only on a new installation.
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

Set `DB_CONNECTION=sqlite`. Without DB_DATABASE Laravel uses `database/database.sqlite`. This workspace uses `database/workspace.sqlite` through its local .env, preserving the previous database. Create the SQLite file before migrating if specifying a custom path. Do not run migrate:fresh on a database containing records you need.

Set `FIREBASE_API_KEY` to the same project API key used by the frontend. Run `php artisan config:clear` after changing settings. Every new direct Google or email signup automatically receives active super-admin access, with no configured owner email or administrator approval. This is an open-registration policy: anyone who signs up can control the workspace. Returning users retain their assigned roles and disabled accounts remain disabled.

Invitation links assign the selected role instead of the signup default. They require a matching verified email; invalid, revoked, expired or mismatched links cannot fall back to super-admin signup. Admins can create invitation links for other roles; only super admins can invite another super admin. Share links from Invitations using Copy link.

Firebase remains responsible for passwords and Google login. The server verifies the Firebase token with [Firebase accounts:lookup](https://firebase.google.com/docs/reference/rest/auth#section-get-account-info) before issuing a one-hour API session. Roles, invitations and operational records live in SQLite; browser storage never grants access. Network access to Firebase is required for login/session renewal.

## Real-data workflow

1. Add categories and locations.
2. Register equipment and set its condition thresholds.
3. Create and assign work orders; start before completing with notes, or cancel with a reason.
4. Record measurements; breached thresholds create alerts that can be acknowledged and resolved.
5. Report faults, investigate, start repair, resolve, and close.
6. Super admins approve or disable users, assign roles and create/revoke invitations. Share the copied invitation link manually; the app does not send invitation emails. Invitations expire after seven days and require the matching verified email.

Default seeding creates roles only, with no accounts, equipment or mock readings. Dashboard counts come from saved records; unavailable reliability metrics return null. Existing databases are never automatically cleared.

## Verification

```sh
php artisan test --compact
```

Tests use an isolated SQLite database in memory. Firebase responses are simulated in tests; a live login requires your configured Firebase project .
