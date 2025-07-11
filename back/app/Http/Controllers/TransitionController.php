<?php

namespace App\Http\Controllers;

use App\Models\Transition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransitionController extends Controller
{
    public function update(Request $request)
    {
        $fromFurnitureId = $request['fromFurnitureId'];
        $toFurnitureId = $request['toFurnitureId'];

        $updatedRows = Transition::where('from_furniture_id', $fromFurnitureId)
            ->where('to_furniture_id', $toFurnitureId)
            ->update([
                'count' => DB::raw('count + 1'),
            ]);

        if ($updatedRows === 0) {
            Transition::create([
                'from_furniture_id' => $fromFurnitureId,
                'to_furniture_id' => $toFurnitureId,
                'count' => 1,
            ]);
        }
    }
}
