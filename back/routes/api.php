<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FurnitureController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransitionControler;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('/sign-up', [AuthController::class, 'signUp']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/destroy', [AuthController::class, 'destroy']);
});

Route::prefix('furniture')->group(function () {
    Route::get('/', [FurnitureController::class, 'index']);
    Route::get('/weekly-ranking', [FurnitureController::class, 'weeklyRanking']);
    Route::get('/recommendation/{id}', [FurnitureController::class, 'recommendation']);
    Route::get('/{id}', [FurnitureController::class, 'show']);
});

Route::prefix('category')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
});

Route::prefix('transition')->group(function () {
    Route::patch('/', [TransitionControler::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/token', function() {
        return response()->json([
            'success' => true,
        ]);
    });

    Route::prefix('furniture')->group(function () {
        Route::post('/', [FurnitureController::class, 'store']);
        Route::patch('/{id}', [FurnitureController::class, 'update']);
        Route::delete('/{id}', [FurnitureController::class, 'destroy']);
    });

    Route::prefix('order')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/history', [OrderController::class, 'history']);
        Route::post('/', [OrderController::class, 'store']);
        Route::delete('/{id}', [OrderController::class, 'destroy']);
    });
});
