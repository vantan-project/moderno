<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::insert([
            ['name' => 'デスク'],
            ['name' => 'チェア'],
            ['name' => 'ソファ'],
            ['name' => '収納'],
            ['name' => '照明'],
            ['name' => 'インテリア'],
        ]);
    }
}
