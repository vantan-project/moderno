<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class OrderStoreRequest extends FormRequest
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
            'orders' => 'required|array',
            'orders.*.furnitureId' => 'required|integer|exists:furnitures,id',
            'orders.*.count' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'orders.required' => '注文データが必要です。',
            'orders.*.furnitureId.required' => '家具IDは必須です。',
            'orders.*.furnitureId.integer' => '家具IDは整数でなければなりません。',
            'orders.*.furnitureId.exists' => '指定された家具が存在しません。',
            'orders.*.count.required' => '数量は必須です。',
            'orders.*.count.integer' => '数量は整数でなければなりません。',
            'orders.*.count.min' => '数量は1以上でなければなりません。',
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
