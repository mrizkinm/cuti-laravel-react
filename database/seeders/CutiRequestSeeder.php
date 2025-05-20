<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CutiRequest;
use App\Models\CutiType;
use App\Models\Employee;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class CutiRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employee = Employee::first();
        $cutiType = CutiType::first();

        if (!$employee || !$cutiType) {
            dump('Seeder membutuhkan minimal 1 user dan 1 cuti type');
            return;
        }

        CutiRequest::create([
            'id' => (string) Str::uuid(),
            'employee_id' => $employee->id,
            'cuti_type_id' => $cutiType->id,
            'start_date' => Carbon::now()->addDays(2),
            'end_date' => Carbon::now()->addDays(4),
            'reason' => 'Liburan keluarga',
            'approved' => false,
            'document' => 'cuti-liburan.pdf',
        ]);
    }
}
