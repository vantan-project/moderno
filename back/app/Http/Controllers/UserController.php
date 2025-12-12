<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
  public function index(Request $request)
  {
    $keyword = $request->input('search.keyword');

    $users = User::query()
      ->when($keyword, function ($query, $keyword) {
        $query->where('name', 'like', "%{$keyword}%")
          ->orWhere('email', 'like', "%{$keyword}%")
          ->orWhere('postal_code', 'like', "%{$keyword}%")
          ->orWhere('prefecture', 'like', "%{$keyword}%")
          ->orWhere('city', 'like', "%{$keyword}%")
          ->orWhere('street_address', 'like', "%{$keyword}%");
      })
      ->get();

    return response()->json([
      'success' => true,
      'users' => $users->map(function ($user) {
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
