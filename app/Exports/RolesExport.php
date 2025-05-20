<?php

namespace App\Exports;

use App\Models\Role;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class RolesExport implements FromCollection, WithHeadings
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
        return Role::select($this->fields)->get();
    }

    public function headings(): array
    {
        return $this->fields;
    }
}
