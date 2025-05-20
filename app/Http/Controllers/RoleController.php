<?php

namespace App\Http\Controllers;

use App\Jobs\ExportRolesJob;
use App\Jobs\ImportRolesJob;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Role::query();

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
        $roles = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'status' => $item->status,
                'created_at' => $item->created_at->format('d-m-Y H:i:s'),
                'detail' => $item->detail,
            ];
        });

        return Inertia::render('Roles/Index', [
            'title' => 'Daftar Role',
            'roles' => $roles,
            'filters' => $request->only(['name', 'sort', 'direction'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $audits = Audit::where('auditable_type', Role::class)
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

        return Inertia::render('Roles/Form', [
            'title' => 'Tambah Role',
            'role' => null,
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
           "description" => "Adminroles",
           "permission" => ["add", "edit", "delete"]
        ];

        Role::create($validated);

        return redirect('/roles');
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
    public function edit(Role $role)
    {
        $audits = Audit::where('auditable_type', Role::class)
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

        return Inertia::render('Roles/Form', [
            'title' => 'Edit Role',
            'role' => $role,
            'isEdit' => true,
            'audits' => $audits,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            // 'status' => 'boolean',
        ]);

        $role->update($validated);

        return redirect('/roles');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect('/roles')->with('success', 'Role deleted successfully.');
    }

    public function export(Request $request)
    {
        $fields = $request->get('fields', ['id', 'name', 'status', 'detail', 'created_at']);

        $fileName = 'roles_' . now()->format('Y_m_d_His') . '.xlsx';

        // Panggil job queue
        ExportRolesJob::dispatch($fields, $fileName);

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

        ImportRolesJob::dispatch($filePath);

        return response()->json(['message' => 'Import sedang diproses di background', 'path' => $filePath]);
    }
}
