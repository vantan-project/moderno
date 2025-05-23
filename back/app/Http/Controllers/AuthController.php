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
        $email = $request["auth"]['email'];
        $password = $request["auth"]['password'];

        if (Auth::attempt(['email' => $email, 'password' => $password])) {
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
        $name = $request["auth"]['name'];
        $email = $request["auth"]['email'];
        $password = $request["auth"]['password'];

        $user = User::create([
            'name'     => $name,
            'email'    => $email,
            'password' => Hash::make($password),
        ]);

        return response()->json([
            'success' => true,
            'messages' => ['ユーザー登録が完了しました。'],
            'authToken' => $user->createToken('authToken')->plainTextToken,
        ], 201);
    }
}
