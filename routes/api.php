<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;

// health
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// AUTH public
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// AUTH protected (butuh token)
Route::middleware(['auth:sanctum'])->prefix('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// ADMIN-only (butuh token + role:admin)
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::post('/create-user', [AdminUserController::class, 'store']);
    // route admin lain...
});

// TODOS => hanya boleh diakses user yg sudah login
Route::middleware(['auth:sanctum'])->apiResource('todos', TodoController::class);
