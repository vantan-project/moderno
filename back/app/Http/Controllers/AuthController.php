<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthSignUpLoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(AuthLoginRequest $request)
    {
        $auth = $request["auth"];

        if (Auth::attempt(['email' => $auth['email'], 'password' => $auth['password']])) {
            $user = Auth::user();

            return response()->json([
                'success' => true,
                'messages' => ['ログインに成功しました。'],
                'authToken' => $user->createToken('authToken')->plainTextToken,
            ]);
        }

        return response()->json([
            'success' => false,
            'messages' => ['メールアドレスかパスワードが正しくありません。'],
        ], 401);
    }

    public function signUp(AuthSignUpLoginRequest $request) {
        $auth = $request["auth"];

        $user = User::create([
            'name'     => $auth['name'],
            'email'    => $auth['email'],
            'password' => Hash::make($auth['password']),
        ]);

        return response()->json([
            'success' => true,
            'messages' => ['ユーザー登録が完了しました。'],
            'authToken' => $user->createToken('authToken')->plainTextToken,
        ], 201);
    }
}
