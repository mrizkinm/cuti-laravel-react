<?php

use App\Exports\UsersExport;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CutiTypeController;
use App\Http\Controllers\CutiRequestController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Database\Seeders\CutiTypeSeeder;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    });
    Route::resource('roles', RoleController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('cuti-types', CutiTypeController::class);
    Route::resource('cuti-requests', CutiRequestController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/export-roles', [RoleController::class, 'export']);
    Route::post('/export-employees', [EmployeeController::class, 'export']);
    Route::post('/export-cuti-types', [CutiTypeController::class, 'export']);
    Route::post('/export-cuti-requests', [CutiRequestController::class, 'export']);
    Route::post('/import-roles', [RoleController::class, 'import']);
    Route::post('/import-employees', [EmployeeController::class, 'import']);
    Route::post('/import-cuti-types', [CutiTypeController::class, 'import']);
    Route::post('/import-cuti-requests', [CutiRequestController::class, 'import']);
});

Route::middleware(['auth', 'role:Administrator'])->group(function () {
    Route::resource('users', UserController::class);
    Route::post('/export-users', [UserController::class, 'export']);
    Route::post('/import-users', [UserController::class, 'import']);
});