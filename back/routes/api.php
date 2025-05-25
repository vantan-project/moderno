<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FurnitureController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('/sign-up', [AuthController::class, 'signUp']);
});

Route::prefix('furniture')->group(function () {
    Route::get('/', [FurnitureController::class, 'index']);
    Route::get('/{id}', [FurnitureController::class, 'show']);
});

Route::prefix('category')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('furniture')->group(function () {
        Route::post('/', [FurnitureController::class, 'store']);
        Route::patch('/{id}', [FurnitureController::class, 'update']);
        Route::delete('/{id}', [FurnitureController::class, 'destroy']);
    });
});
