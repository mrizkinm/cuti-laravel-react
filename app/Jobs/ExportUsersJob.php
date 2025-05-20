<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportUsersJob implements ShouldQueue
{
    use Queueable;

    protected $fields;
    protected $fileName;

    /**
     * Create a new job instance.
     */
    public function __construct(array $fields, string $fileName)
    {
        $this->fileName = $fileName;
        $this->fields = $fields;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Simpan file ke storage
        Excel::store(new UsersExport($this->fields), $this->fileName, 'public');
    }
}
