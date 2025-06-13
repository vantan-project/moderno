<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert([
            [
                'name' => 'kate',
                'email' => 'kate@gmail.com',
                'password' => Hash::make('kate'),
                'is_admin' => true,
            ],
            [
                'name' => 'hina',
                'email' => 'hina@gmail.com',
                'password' => Hash::make('hina'),
                'is_admin' => true,
            ],
            [
                'name' => 'leon',
                'email' => 'leon@gmail.com',
                'password' => Hash::make('leon'),
                'is_admin' => true,
            ],
            [
                'name' => 'haru',
                'email' => 'haru@gmail.com',
                'password' => Hash::make('haru'),
                'is_admin' => true,
            ],
        ]);
    }
}
