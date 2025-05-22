<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class FurnitureUpdateRequest extends FormRequest
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
            'furniture.name' => 'sometimes|string|max:255',
            'furniture.imageFile' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'furniture.detail' => 'sometimes|string|max:65535',
            'furniture.price' => 'sometimes|integer|min:0',
            'furniture.categoryId' => 'sometimes|integer|exists:categories,id',
            'furniture.stock' => 'sometimes|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'furniture.name.string' => '商品名は文字列で入力してください。',
            'furniture.name.max' => '商品名は255文字以内で入力してください。',

            'furniture.imageFile.image' => '有効な画像ファイルをアップロードしてください。',
            'furniture.imageFile.mimes' => '画像ファイルの形式は jpeg, png, jpg, gif, webp のいずれかでなければなりません。',
            'furniture.imageFile.max' => '画像ファイルのサイズは5MB以内でなければなりません。',

            'furniture.detail.string' => '商品詳細は文字列で入力してください。',
            'furniture.detail.max' => '商品詳細は65535文字以内で入力してください。',

            'furniture.price.integer' => '価格は整数で入力してください。',
            'furniture.price.min' => '価格は0以上で入力してください。',

            'furniture.categoryId.integer' => 'カテゴリIDは整数で入力してください。',
            'furniture.categoryId.exists' => '選択されたカテゴリIDは存在しません。',

            'furniture.stock.integer' => '在庫数は整数で入力してください。',
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
