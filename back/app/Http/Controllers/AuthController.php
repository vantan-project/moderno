<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Request;
use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthSignUpLoginRequest;
use App\Http\Requests\AuthUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(AuthLoginRequest $request)
    {
        $auth = $request["auth"];

        if (Auth::attempt(['email' => $auth['email'], 'password' => $auth['password']])) {
            $authUser = request()->user();

            return response()->json([
                'success' => true,
                'messages' => ['ログインに成功しました。'],
                'authToken' => $authUser->createToken('authToken')->plainTextToken,
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

    public function logout()
    {
        $authUser = request()->user();

        $authUser->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'messages' => ['ログアウトしました。'],
        ]);
    }

    public function update(AuthUpdateRequest $request)
    {
        $auth = $request["auth"];
        $authUser = $request->user();

        $updateData = [];

        if (isset($auth['name'])) $updateData['name'] = $auth['name'];
        if (isset($auth['email'])) $updateData['email'] = $auth['email'];
        if (!empty($auth['password'])) $updateData['password'] = Hash::make($auth['password']);
        if (isset($auth['postal_code'])) $updateData['postal_code'] = $auth['postal_code'];
        if (isset($auth['prefecture'])) $updateData['prefecture'] = $auth['prefecture'];
        if (isset($auth['city'])) $updateData['city'] = $auth['city'];
        if (isset($auth['street_address'])) $updateData['street_address'] = $auth['street_address'];

        $authUser->fill($updateData)->save();

        return response()->json([
            'success' => true,
            'messages' => ['ユーザー情報を更新しました。'],
        ]);
    }

    public function destroy()
    {
        $authUser = request()->user();

        $authUser->delete();

        return response()->json([
            'success' => true,
            'messages' => ['ユーザーアカウントを削除しました。'],
        ]);
    }
}
