<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function index()
  {
    return response()->json([
      'success' => true,
      'users' => User::all()->map(function ($user) {
        return [
          'id' => $user->id,
          'name' => $user->name,
          'email' => $user->email,
          'postalCode' => $user->postal_code,
          'prefecture' => $user->prefecture,
          'city' => $user->city,
          'streetAddress' => $user->street_address,
        ];
      })
    ]);
  }
}
