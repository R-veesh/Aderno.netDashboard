<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactInquiry;

class PublicContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:160',
            'company' => 'nullable|string|max:160',
            'role' => 'nullable|string|max:120',
            'interest' => 'required|in:demo,pricing,implementation,support,other',
            'message' => 'required|string|min:10|max:2000',
            'consent' => 'required|boolean|accepted',
        ]);

        $inquiry = ContactInquiry::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting Bravik. Our reliability engineering team will review your inquiry.',
            'data' => [
                'id' => $inquiry->id,
                'created_at' => $inquiry->created_at->toIso8601String(),
            ],
        ], 201);
    }
}

