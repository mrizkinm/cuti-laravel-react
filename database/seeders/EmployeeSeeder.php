<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Employee::create([
            'name' => 'Junaidi',
            'email' => 'admin@example.com',
            'nip' => '1234567890', // NIP untuk admin
            'phone' => '08123456789',
            'date_of_birth' => '1990-01-02',
            'detail' => json_encode([
                'alamat' => 'Jl. Kebenaran No. 1',
                'jenis_kelamin' => 'L',
            ]),
        ]);

        Employee::create([
            'name' => 'Susilowati',
            'email' => 'user@example.com',
            'nip' => '0987654321', // NIP untuk karyawan
            'phone' => '08123456789',
            'date_of_birth' => '1990-01-01',
            'detail' => json_encode([
                'alamat' => 'Jl. Kebenaran No. 2',
                'jenis_kelamin' => 'P',
            ]),
        ]);
    }
}
