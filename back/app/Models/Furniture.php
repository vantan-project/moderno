<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Furniture extends Model
{
    protected $fillable = ['name','image_url','detail','price','category_id','stock'];

    function category() {
        return $this->belongsTo(Category::class);
    }

    function orders() {
        return $this->hasMany(Order::class);
    }

    public static function uploadS3($imageFile) {
        $path = Storage::disk('s3')->putFile('furniture', $imageFile);
        return config('filesystems.disks.s3.url') . '/' . $path;
    }

    protected static function booted()
    {
        static::deleting(function ($furniture) {
            $s3BaseUrl = config('filesystems.disks.s3.url') . '/';
            $filePath = str_replace($s3BaseUrl, '', $furniture->image_url);

            $disk = Storage::disk('s3');

            if ($filePath && $disk->exists($filePath)) {
                return $disk->delete($filePath);
            }

            return true;
        });

        static::updating(function ($furniture) {
           if (! $furniture->isDirty('image_url')) {
                return;
            }

            $originalImageUrl = $furniture->getOriginal('image_url');
            $s3BaseUrl = config('filesystems.disks.s3.url') . '/';
            $filePath = str_replace($s3BaseUrl, '', $originalImageUrl);

            $disk = Storage::disk('s3');

            if ($filePath && $disk->exists($filePath)) {
                $disk->delete($filePath);
            }
        });
    }
}
