<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use App\Http\Requests\LikeStoreRequest;

class LikeController extends Controller
{
    public function index(){
        $authUser = request()->user();

        $likeIds = $authUser
            ->likes()
            ->pluck('furniture_id')
            ->toArray();

        return response()->json([
            'success' => true,
            'likeIds' => $likeIds,
        ]);
    }

    public function store(LikeStoreRequest $request){
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

        Like::where('user_id', $authUser->id)
            ->where('furniture_id', $furnitureId)
            ->delete();

        return response()->json([
            'success' => true,
            'messages' => ['お気に入りから削除しました。'],
        ]);
    }

}
