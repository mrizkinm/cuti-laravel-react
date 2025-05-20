<?php

namespace App\Http\Controllers;

use App\Jobs\ExportEmployeesJob;
use App\Jobs\ImportEmployeesJob;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Employee::query();

        // Filter berdasarkan nama
        if ($request->filled('nip')) {
            $query->where('nip', 'like', '%' . $request->nip . '%');
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        // Sorting
        if ($request->filled('sort')) {
            $direction = in_array($request->direction, ['asc', 'desc']) ? $request->direction : 'asc';
            $query->orderBy($request->sort, $direction);
        }

        $query->orderBy('created_at', 'asc');

        $employees = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'nip' => $item->nip,
                'phone' => $item->phone,
                'date_of_birth' => $item->date_of_birth,
                'status' => $item->status,
                'created_at' => $item->created_at->format('d-m-Y H:i:s'),
                'detail' => $item->detail,
            ];
        });

        return Inertia::render('Employees/Index', [
            'title' => 'Daftar Karyawan',
            'employees' => $employees,
            'filters' => $request->only(['name', 'email', 'nip', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $audits = Audit::where('auditable_type', Employee::class)
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

        return Inertia::render('Employees/Form', [
            'title' => 'Tambah Karyawan',
            'employee' => null,
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
            'email' => 'required|email|unique:employees,email',
            'nip' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'status' => 'required|boolean',
        ]);

        $validated['detail'] = [
            "alamat" => "Jl. Kebenaran No. 1",
            "jenis_kelamin" => "L"
        ];

        Employee::create($validated);
        return redirect('/employees');
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
    public function edit(Employee $employee)
    {
        $audits = Audit::where('auditable_type', Employee::class)
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

        return Inertia::render('Employees/Form', [
            'title' => 'Edit Karyawan',
            'employee' => $employee,
            'isEdit' => true,
            'audits' => $audits,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'nip' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'status' => 'boolean',
        ]);

        $employee->update($validated);
        return redirect('/employees');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect('/employees')->with('success', 'Employee deleted successfully.');
    }

    public function export(Request $request)
    {
        $fields = $request->get('fields', ['id', 'nip', 'name', 'email', 'phone', 'status', 'date_of_birth', 'detail', 'created_at']);

        $fileName = 'employees_' . now()->format('Y_m_d_His') . '.xlsx';

        // Panggil job queue
        ExportEmployeesJob::dispatch($fields, $fileName);

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

        ImportEmployeesJob::dispatch($filePath);

        return response()->json(['message' => 'Import sedang diproses di background', 'path' => $filePath]);
    }
}
