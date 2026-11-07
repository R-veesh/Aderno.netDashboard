<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'code',
        'head_name',
        'cost_center_code'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function budget()
    {
        return $this->hasOne(Budget::class);
    }

    public function requests()
    {
        return $this->hasMany(ProcurementRequest::class);
    }
}
