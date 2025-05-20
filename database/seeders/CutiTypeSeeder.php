<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CutiType;

class CutiTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'Cuti Tahunan'],
            ['name' => 'Cuti Sakit'],
            ['name' => 'Cuti Melahirkan'],
        ];

        foreach ($data as $item) {
            CutiType::create($item);
        }
    }
}
