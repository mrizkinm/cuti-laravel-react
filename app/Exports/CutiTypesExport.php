<?php

namespace App\Exports;

use App\Models\CutiType;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CutiTypesExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */

    protected $fields;

    public function __construct($fields = [])
    {
        $this->fields = $fields;
    }
    
    public function collection()
    {
        return CutiType::select($this->fields)->get();
    }

    public function headings(): array
    {
        return $this->fields;
    }
}
