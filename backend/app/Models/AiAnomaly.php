<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiAnomaly extends Model
{
    protected $fillable = [
        'anomaly_code',
        'type',
        'severity',
        'confidence_score',
        'title',
        'details',
        'status'
    ];

    protected $casts = [
        'confidence_score' => 'float'
    ];
}
