<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use OwenIt\Auditing\Models\Audit;
use App\Jobs\ExportUsersJob;
use App\Jobs\ImportUsersJob;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with(['role']);

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role_id', $request->role);
        }

        if ($request->filled('sort')) {
            $direction = in_array($request->direction, ['asc', 'desc']) ? $request->direction : 'asc';
            $query->orderBy($request->sort, $direction);
        }

        $query->orderBy('created_at', 'asc');

        $users = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'role' => $item->role->name,
                'status' => $item->status,
                'created_at' => $item->created_at->format('d-m-Y H:i:s'),
                'detail' => $item->detail,
            ];
        });

        return Inertia::render('Users/Index', [
            'title' => 'Daftar User',
            'roles' => Role::all(),
            'users' => $users,
            'filters' => $request->only(['name', 'email', 'role', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $audits = Audit::where('auditable_type', User::class)
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
        
        return Inertia::render('Users/Form', [
            'title' => 'Tambah User',
            'roles' => Role::where('status', true)->get(),
            'user' => null,
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
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|string|max:36',
            'password' => 'required|string|min:6',
            'status' => 'required|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['detail'] = [
            "alamat" => "Jl. Kebenaran No. 1",
            "jenis_kelamin" => "L"
        ];

        User::create($validated);
        return redirect('/users');
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
    public function edit(User $user)
    {
        $audits = Audit::where('auditable_type', User::class)
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

        return Inertia::render('Users/Form', [
            'title' => 'Edit User',
            'user' => $user,
            'roles' => Role::where('status', true)->get(),
            'isEdit' => true,
            'audits' => $audits,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role_id' => 'required|string|max:36',
            'status' => 'boolean',
        ]);

        $user->update($validated);
        return redirect('/users');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect('/users');
    }

    public function export(Request $request)
    {
        $fields = $request->get('fields', ['id', 'name', 'email', 'role_id', 'status', 'detail', 'created_at']);

        $fileName = 'users_' . now()->format('Y_m_d_His') . '.xlsx';

        // Panggil job queue
        ExportUsersJob::dispatch($fields, $fileName);

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

        ImportUsersJob::dispatch($filePath);

        return response()->json(['message' => 'Import sedang diproses di background', 'path' => $filePath]);
    }
}
