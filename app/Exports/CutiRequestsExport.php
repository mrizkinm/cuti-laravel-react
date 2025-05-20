<?php

namespace App\Exports;

use App\Models\CutiRequest;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CutiRequestsExport implements FromCollection, WithHeadings
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
        return CutiRequest::select($this->fields)->get();
    }

    public function headings(): array
    {
        return $this->fields;
    }
}
