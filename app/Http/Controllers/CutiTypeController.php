<?php

namespace App\Http\Controllers;

use App\Jobs\ExportCutiTypesJob;
use App\Jobs\ImportCutiTypesJob;
use App\Models\CutiType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;

class CutiTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CutiType::query();

        // Filter berdasarkan nama
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Sorting
        if ($request->filled('sort')) {
            $direction = in_array($request->direction, ['asc', 'desc']) ? $request->direction : 'asc';
            $query->orderBy($request->sort, $direction);
        }

        $query->orderBy('created_at', 'asc');

        // Ambil data
        $cutiTypes = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'status' => $item->status,
                'created_at' => $item->created_at->format('d-m-Y H:i:s'),
                'detail' => $item->detail,
            ];
        });

        return Inertia::render('CutiTypes/Index', [
            'title' => 'Daftar Tipe Cuti',
            'cutiTypes' => $cutiTypes,
            'filters' => $request->only(['name', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $audits = Audit::where('auditable_type', CutiType::class)
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($audit) {

            $audit->created_at_formatted = Carbon::parse($audit->created_at)->format('Y-m-d H:i:s');

            // Note berdasarkan event
            $event = $audit->event;
            $oldValues = $audit->old_values;
            $newValues = $audit->new_values;
            $keys = is_array($newValues) ? implode(', ', array_keys($newValues)) : '';

            $audit->note = match ($event) {
                'created' => $keys ? "created with $keys" : "created",
                'updated' => $keys ? "update $keys" : "updated",
                'deleted' => "deleted ".$oldValues['name'],
                default => "unknown",
            };
            return $audit;
        });

        return Inertia::render('CutiTypes/Form', [
            'title' => 'Tambah Tipe Cuti',
            'cutiType' => null,
            'isEdit' => false,
            'audits' => $audits,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // 'status' => 'required|boolean',
        ]);

        $validated['detail'] = [
            "description" => "Cutitypes",
            "max_days" => 7
        ];

        CutiType::create($validated);

        return redirect('/cuti-types');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CutiType $cutiType)
    {
        $audits = Audit::where('auditable_type', CutiType::class)
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($audit) {

            $audit->created_at_formatted = Carbon::parse($audit->created_at)->format('Y-m-d H:i:s');

            // Note berdasarkan event
            $event = $audit->event;
            $oldValues = $audit->old_values;
            $newValues = $audit->new_values;
            $keys = is_array($newValues) ? implode(', ', array_keys($newValues)) : '';

            $audit->note = match ($event) {
                'created' => $keys ? "created with $keys" : "created",
                'updated' => $keys ? "update $keys" : "updated",
                'deleted' => "deleted ".$oldValues['name'],
                default => "unknown",
            };
            return $audit;
        });

        return Inertia::render('CutiTypes/Form', [
            'title' => 'Edit Tipe Cuti',
            'cutiType' => $cutiType,
            'isEdit' => true,
            'audits' => $audits,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CutiType $cutiType)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            // 'status' => 'boolean',
        ]);

        $cutiType->update($validated);

        return redirect('/cuti-types');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CutiType $cutiType)
    {
        $cutiType->delete();
        return redirect('/cuti-types')->with('success', 'Cuti Type deleted successfully.');
    }

    public function export(Request $request)
    {
        $fields = $request->get('fields', ['id', 'name', 'status', 'detail', 'created_at']);

        $fileName = 'cuti_types_' . now()->format('Y_m_d_His') . '.xlsx';

        // Panggil job queue
        ExportCutiTypesJob::dispatch($fields, $fileName);

        return response()->json([
            'message' => 'The export process has started. You will be notified when it is complete.',
            'file' => $fileName,
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,xls,csv,txt',
        ]);

        $filePath = $request->file('excel')->store('', 'local');

        ImportCutiTypesJob::dispatch($filePath);

        return response()->json(['message' => 'Import sedang diproses di background', 'path' => $filePath]);
    }
}
