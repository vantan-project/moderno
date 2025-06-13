<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transition extends Model
{
    public $incrementing = false;
    protected $primaryKey = null;

    protected $fillable = [
        'from_furniture_id',
        'to_furniture_id',
        'count',
    ];

    public function toFurniture()
    {
        return $this->belongsTo(Furniture::class, 'to_furniture_id');
    }
}
