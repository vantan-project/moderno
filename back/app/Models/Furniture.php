<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Furniture extends Model
{
    protected $fillable = ['name','image_url','detail','price','category_id','stock'];
}
