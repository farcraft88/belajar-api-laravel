<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TodoController;
Route::get('/health', fn() => response()->json(['status' => 'ok']));
Route::apiResource('todos', TodoController::class);