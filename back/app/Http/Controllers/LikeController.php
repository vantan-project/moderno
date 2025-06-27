<?php

namespace App\Http\Controllers;
use App\Models\Like;

use Illuminate\Http\Request;


class LikeController extends Controller
{
    public function store(Request $request){
        $authUser = request()->user();

        Like::create([
            'user_id'=> $authUser->id,
            'furniture_id' => $request['furnitureId'],
        ]);

        return response()->json([
            'success' => true,
            'messages' => ['お気に入りに登録しました。'],
        ]);
    }

    public function destroy($furnitureId){
        $authUser = request()->user();

        $like = Like::where('user_id', $authUser->id)
                    ->where('furniture_id', $furnitureId)
                    ->delete();

        return response()->json([
            'success' => true,
            'messages' => ['お気に入りから削除しました。'],
        ]);
    }

}
