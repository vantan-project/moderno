<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CardController extends Controller
{
  public function index()
  {
    $authUser = request()->user();

    return response()->json([
      'success' => true,
      'cards' => $authUser->cards
        ->mapWithKeys(function ($card) {
          return [
            $card->id => [
              'id' => $card->id,
              'last4' => $card->last4,
              'expYear' => $card->exp_year,
              'expMonth' => $card->exp_month,
              'holderFirstName' => $card->holder_first_name,
              'holderLastName' => $card->holder_last_name,
            ],
          ];
        }),
    ]);
  }

  public function store(Request $request)
  {
    $card = $request->card;
    $authUser = request()->user();
    $authUser->cards()->create([
      'number' => $card['number'],
      'last4' => substr($card['number'], -4),
      'exp_year' => $card['expYear'],
      'exp_month' => $card['expMonth'],
      'holder_first_name' => $card['holderFirstName'],
      'holder_last_name' => $card['holderLastName'],
    ]);

    return response()->json([
      'success' => true,
      'messages' => ['カードを追加しました。'],
    ]);
  }

  public function destroy($id)
  {
    $authUser = request()->user();
    $authUser->cards()->where('id', $id)->delete();

    return response()->json([
      'success' => true,
      'messages' => ['カードを削除しました。'],
    ]);
  }
}
