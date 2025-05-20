<?php

namespace App\Jobs;

use App\Models\CutiRequest;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ImportCutiRequestsJob implements ShouldQueue
{
    use Queueable;

    protected $filePath;

    /**
     * Create a new job instance.
     */
    public function __construct($filePath)
    {
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Baca file dari storage
        $fileFullPath = storage_path('app/private/' . $this->filePath);

        if (!File::exists($fileFullPath)) {
            Log::error("File tidak ditemukan: " . $fileFullPath);
            return;
        }

        // Read the file content
        $fileContent = file_get_contents($fileFullPath);
        
        // Convert to array of lines
        $lines = explode("\n", $fileContent);
        
        // Get headers from first line
        $headers = str_getcsv(array_shift($lines), ';'); // Specify semicolon as delimiter
        $headers = array_map(function($header) {
            return preg_replace('/^\xEF\xBB\xBF/', '', $header); // Menghapus BOM
        }, $headers);

        // Process remaining lines
        foreach ($lines as $line) {
            if (empty(trim($line))) {
                continue;
            }
            
            $row = str_getcsv($line, ';'); // Specify semicolon as delimiter
            
            if (count($row) !== count($headers)) {
                Log::warning('Row skipped due to mismatched columns', ['row' => $row]);
                continue;
            }

            $data = array_combine($headers, $row);

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            CutiRequest::create($data);
        }
    }
}
