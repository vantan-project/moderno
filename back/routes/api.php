<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('/sign-up', [AuthController::class, 'signUp']);
});

Route::middleware('auth:sanctum')->group(function () {
    // 認証後のAPIルーティングをかく
});
