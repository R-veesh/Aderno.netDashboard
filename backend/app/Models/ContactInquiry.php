<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    protected $fillable = [
        'name',
        'email',
        'company',
        'role',
        'interest',
        'message',
        'consent',
        'status',
    ];

    protected $casts = [
        'consent' => 'boolean',
    ];
}

