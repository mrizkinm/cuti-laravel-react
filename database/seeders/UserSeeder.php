<?php

namespace Database\Seeders;

use App\Models\Role;
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
        $role = Role::first();

        if (!$role) {
            dump('Seeder membutuhkan minimal 1 role');
            return;
        }

        User::create([
            'name' => 'Hadi',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Jangan pakai plaintext
            'role_id' => $role->id,
        ]);

        User::create([
            'name' => 'Jeno',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role_id' => $role->id,
        ]);
    }
}
