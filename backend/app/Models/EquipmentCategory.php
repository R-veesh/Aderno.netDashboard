<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'category_id');
    }
}

