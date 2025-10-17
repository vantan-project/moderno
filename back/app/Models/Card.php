<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
  protected $fillable = [
    'number',
    'last4',
    'exp_year',
    'exp_month',
    'holder_first_name',
    'holder_last_name',
  ];

  protected $casts = [
    'number' => 'encrypted',
  ];
}
