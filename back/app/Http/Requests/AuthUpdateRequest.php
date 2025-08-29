<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AuthUpdateRequest extends FormRequest
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
            'auth.name' => 'sometimes|required|string|max:50',
            'auth.email'=> 'sometimes|required|email|max:255|unique:users,email,' . $this->user()->id,
            'auth.password' => 'sometimes|required|string|max:100',
            'auth.postalCode' => 'sometimes|required|string|max:10',
            'auth.prefecture' => 'sometimes|required|string|max:50',
            'auth.city' => 'sometimes|required|string|max:100',
            'auth.streetAddress' => 'sometimes|required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'auth.name.required'     => '名前は必須です。',
            'auth.name.string'       => '名前は文字列で入力してください。',
            'auth.name.max'          => '名前は50文字以内で入力してください。',

            'auth.email.required'    => 'メールアドレスは必須です。',
            'auth.email.email'       => '正しいメールアドレスの形式で入力してください。',
            'auth.email.max'         => 'メールアドレスは255文字以内で入力してください。',
            'auth.email.unique'      => 'このメールアドレスは既に登録されています。',

            'auth.password.required' => 'パスワードは必須です。',
            'auth.password.string'   => 'パスワードは文字列で入力してください。',
            'auth.password.max'      => 'パスワードは100文字以内で入力してください。',

            'auth.postalCode.required' => '郵便番号は必須です。',
            'auth.postalCode.string'   => '郵便番号は文字列で入力してください。',
            'auth.postalCode.max'      => '郵便番号は10文字以内で入力してください。',

            'auth.prefecture.required' => '都道府県は必須です。',
            'auth.prefecture.string'   => '都道府県は文字列で入力してください。',
            'auth.prefecture.max'      => '都道府県は50文字以内で入力してください。',

            'auth.city.required' => '市区町村は必須です。',
            'auth.city.string'   => '市区町村は文字列で入力してください。',
            'auth.city.max'      => '市区町村は100文字以内で入力してください。',

            'auth.streetAddress.required' => '番地・建物名は必須です。',
            'auth.streetAddress.string'   => '番地・建物名は文字列で入力してください。',
            'auth.streetAddress.max'      => '番地・建物名は255文字以内で入力してください。',
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
