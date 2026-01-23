<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\FurnitureController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TransitionController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/token', function () {
    return response()->json([
      'success' => true,
      'isAdmin' =>  !!request()->user()->is_admin,
    ]);
  });

  Route::prefix('furniture')->group(function () {
    Route::post('/', [FurnitureController::class, 'store']);
    Route::get('/like', [FurnitureController::class, 'like']);
    Route::post('/{id}', [FurnitureController::class, 'update']);
    Route::delete('/{id}', [FurnitureController::class, 'destroy']);
  });

  Route::prefix('order')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/stockout', [OrderController::class, 'stockout']);
    Route::get('/history', [OrderController::class, 'history']);
    Route::post('/', [OrderController::class, 'store']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
    Route::patch('/{id}/ship', [OrderController::class, 'ship']);
    Route::patch('/{id}/unship', [OrderController::class, 'unship']);
  });

  Route::prefix('like')->group(function () {
    Route::get('/', [LikeController::class, 'index']);
    Route::post('/', [LikeController::class, 'store']);
    Route::delete('/{furnitureId}', [LikeController::class, 'destroy']);
  });

  Route::prefix('auth')->group(function () {
    Route::get('/', [AuthController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/', [AuthController::class, 'update']);
    Route::delete('/', [AuthController::class, 'destroy']);
  });

  Route::prefix('/card')->group(function () {
    Route::get('/', [CardController::class, 'index']);
    Route::post('/', [CardController::class, 'store']);
    Route::delete('/{id}', [CardController::class, 'destroy']);
  });

  Route::prefix('/user')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/select', [UserController::class, 'select']);
  });
});

Route::prefix('furniture')->group(function () {
  Route::get('/', [FurnitureController::class, 'index']);
  Route::get('/weekly-ranking', [FurnitureController::class, 'weeklyRanking']);
  Route::get('/new-arrival', [FurnitureController::class, 'newArrival']);
  Route::get('/cart', [FurnitureController::class, 'cart']);
  Route::get('/recommendation/{id}', [FurnitureController::class, 'recommendation']);
  Route::get('/{id}', [FurnitureController::class, 'show']);
});

Route::prefix('category')->group(function () {
  Route::get('/', [CategoryController::class, 'index']);
  Route::post('/', [CategoryController::class, 'store']);
  Route::patch('/{id}', [CategoryController::class, 'update']);
  Route::delete('/{id}', [CategoryController::class, 'destroy']);
});

Route::prefix('transition')->group(function () {
  Route::patch('/', [TransitionController::class, 'update']);
});

Route::prefix('auth')->group(function () {
  Route::post('login', [AuthController::class, 'login']);
  Route::post('/sign-up', [AuthController::class, 'signUp']);
});
