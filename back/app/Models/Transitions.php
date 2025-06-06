<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transitions extends Model
{
    protected $fillable = [
        'from_furniture_id',
        'to_furniture_id',
        'count',
    ];
}
