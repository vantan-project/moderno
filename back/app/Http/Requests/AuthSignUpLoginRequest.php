<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AuthSignUpLoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'auth.name'     => 'required|string|max:50',
            'auth.email'    => 'required|email|max:255|unique:users,email',
            'auth.password' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => '名前は必須です。',
            'name.string'       => '名前は文字列で入力してください。',
            'name.max'          => '名前は50文字以内で入力してください。',

            'email.required'    => 'メールアドレスは必須です。',
            'email.email'       => '正しいメールアドレスの形式で入力してください。',
            'email.max'         => 'メールアドレスは255文字以内で入力してください。',
            'email.unique'      => 'このメールアドレスは既に登録されています。',

            'password.required' => 'パスワードは必須です。',
            'password.string'   => 'パスワードは文字列で入力してください。',
            'password.max'      => 'パスワードは100文字以内で入力してください。',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'messages' => collect($validator->errors()->messages())
                    ->flatten()
                    ->toArray()
            ], 422)
        );
    }
}
