<?php

namespace App\Http\Controllers;

use App\Jobs\ExportCutiRequestsJob;
use App\Jobs\ImportCutiRequestsJob;
use App\Models\CutiRequest;
use App\Models\CutiType;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;

class CutiRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CutiRequest::with(['employee', 'cutiType']);

        if ($request->filled('employee')) {
            $query->whereHas('employee', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->employee . '%');
            });
        }
        if ($request->filled('approved') && $request->approved !== 'all') {
            $query->where('approved', filter_var($request->approved, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('sort')) {
            $direction = in_array($request->direction, ['asc', 'desc']) ? $request->direction : 'asc';
            $query->orderBy($request->sort, $direction);
        }

        $query->orderBy('created_at', 'asc');

        $cutiRequests = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'employee_name' => $item->employee?->name,
                'cuti_type_name' => $item->cutiType?->name,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'approved' => $item->approved,
                'reason' => $item->reason,
                'document' => $item->document ? Storage::url($item->document) : null,
                'created_at' => $item->created_at->format('d-m-Y H:i:s'),
                'detail' => $item->detail,
            ];
        });

        return Inertia::render('CutiRequests/Index', [
            'title' => 'Daftar Pengajuan Cuti',
            'cutiRequests' => $cutiRequests,
            'filters' => $request->only(['employee', 'approved', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $audits = Audit::where('auditable_type', CutiRequest::class)
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
        
        return Inertia::render('CutiRequests/Form', [
            'title' => 'Tambah Pengajuan Cuti',
            'cutiTypes' => CutiType::where('status', true)->get(),
            'employees' => Employee::where('status', true)->get(),
            'isEdit' => false,
            'cutiRequest' => null,
            'audits' => $audits,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'cuti_type_id' => 'required|exists:cuti_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
            'document' => 'nullable|file|mimes:pdf|max:500|min:100', // in KB
        ]);

        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('', 'public');
            $validated['document'] = $path;
        }

        $validated['detail'] = [
            "approver_comments" => "OK"
        ];

        CutiRequest::create($validated);

        return redirect('/cuti-requests');
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
    public function edit(CutiRequest $cutiRequest)
    {
        $audits = Audit::where('auditable_type', CutiRequest::class)
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

        return Inertia::render('CutiRequests/Form', [
            'title' => 'Edit Pengajuan Cuti',
            'cutiRequest' => $cutiRequest,
            'cutiTypes' => CutiType::where('status', true)->get(),
            'employees' => Employee::where('status', true)->get(),
            'isEdit' => true,
            'audits' => $audits,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CutiRequest $cutiRequest)
    {
        $validated = $request->validate([
            'employee_id' => 'sometimes|required|exists:employees,id',
            'cuti_type_id' => 'sometimes|required|exists:cuti_types,id',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
            'approved' => 'boolean',
            'document' => 'nullable|file|mimes:pdf|max:500|min:100', // in KB
        ]);
        $validated['approved'] = $request->boolean('approved');
        
        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('', 'public');
            $validated['document'] = $path;
        }

        $cutiRequest->update($validated);
        return redirect('/cuti-requests');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CutiRequest $cutiRequest)
    {
        if ($cutiRequest->document) {
            Storage::delete($cutiRequest->document);
        }
        $cutiRequest->delete();
        return redirect('/cuti-requests');
    }

    public function export(Request $request)
    {
        $fields = $request->get('fields', ['id', 'employee_id', 'cuti_type_id', 'start_date', 'end_date', 'reason', 'approved', 'document', 'detail','created_at']);

        $fileName = 'cuti_requests_' . now()->format('Y_m_d_His') . '.xlsx';

        // Panggil job queue
        ExportCutiRequestsJob::dispatch($fields, $fileName);

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

        ImportCutiRequestsJob::dispatch($filePath);

        return response()->json(['message' => 'Import sedang diproses di background', 'path' => $filePath]);
    }
}
