<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;

class CategoryController extends Controller
{
    public function index(){
        $categories = Category::all();

        return response()->json([
            'success' => true,
            'categories' => $categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
            })
        ]);
    }

    public function store(CategoryStoreRequest $request){
        $input = $request["category"];

        Category::create([
            'name' => $input['name'],
        ]);

        return response()->json([
            'success' => true,
            'messages' => ['カテゴリーを登録しました。'],
        ]);
    }

    public function update(CategoryUpdateRequest $request, int $id){
        $input = $request["category"];

        $category = Category::findOrFail($id);

        if(isset($input['name'])){
            $category->name = $input['name'];
        }
        $category->save();

        return response()->json([
            'success' => true,
            'messages' => ['カテゴリーを更新しました。'],
        ]);
    }

    public function destroy(int $id){
        Category::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'messages' => ['カテゴリーを削除しました。'],
        ]);
    }
}
