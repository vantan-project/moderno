<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class CardStoreRequest extends FormRequest
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
      'card.number' => ['required', 'digits_between:13,19'],
      'card.expMonth' => ['required', 'string', 'size:2'],
      'card.expYear' => ['required', 'string', 'size:2'],
      'card.holderFirstName' => ['required', 'string', 'max:255'],
      'card.holderLastName' => ['required', 'string', 'max:255'],
    ];
  }

  public function messages(): array
  {
    return [
      'card.number.required' => 'カード番号を入力してください。',
      'card.number.digits_between' => 'カード番号は13〜19桁で入力してください。',

      'card.expMonth.required' => '有効期限（月）を入力してください。',
      'card.expMonth.string' => '有効期限（月）は文字列で入力してください。',
      'card.expMonth.size' => '有効期限（月）は2桁で入力してください。',

      'card.expYear.required' => '有効期限（年）を入力してください。',
      'card.expYear.string' => '有効期限（年）は文字列で入力してください。',
      'card.expYear.size' => '有効期限（年）は2桁で入力してください。',

      'card.holderFirstName.required' => 'カード名義（名）を入力してください。',
      'card.holderFirstName.string' => 'カード名義（名）は文字列で入力してください。',
      'card.holderFirstName.max' => 'カード名義（名）は255文字以内で入力してください。',

      'card.holderLastName.required' => 'カード名義（姓）を入力してください。',
      'card.holderLastName.string' => 'カード名義（姓）は文字列で入力してください。',
      'card.holderLastName.max' => 'カード名義（姓）は255文字以内で入力してください。',
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
