<?php

namespace App\Http\Controllers;

use App\Http\Requests\FurnitureStoreRequest;
use App\Http\Requests\FurnitureUpdateRequest;
use App\Models\Furniture;
use Illuminate\Http\Request;

class FurnitureController extends Controller
{
    public function index(Request $request) {
        $categoryId = $request['categoryId'];
        $currentPage = $request['currentPage'];
        $keyword = $request['keyword'];

       $furnitures = Furniture::where('category_id', $categoryId);

       if ($keyword) {
            $furnitures = $furnitures->where(function ($query) use ($keyword) {
                $query->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('detail', 'like', '%' . $keyword . '%');
            });
       }

       $PER_PAGE = 20;
       $furnitures = $furnitures->paginate($PER_PAGE, ['*'], 'page', $currentPage);

        return response()->json([
            'success' => true,
            'furnitures' => collect($furnitures->items())
                ->map(function ($furniture) {
                    return [
                        'id' => $furniture->id,
                        'name' => $furniture->name,
                        'imageUrl' => $furniture->image_url,
                        'detail' => $furniture->detail,
                        'price' => $furniture->price,
                        'categoryId' => $furniture->category_id,
                        'stock' => $furniture->stock,
                    ];
                })
                ->toArray(),
            'lastPage' => $furnitures->lastPage(),
        ]);
    }

    public function store(FurnitureStoreRequest $request) {
        $input = $request["furniture"];

        $imageUrl = Furniture::uploadS3($input['imageFile']);
        Furniture::create([
            'name' => $input['name'],
            'image_url' => $imageUrl,
            'detail' => $input['detail'],
            'price' => $input['price'],
            'category_id' => $input['categoryId'],
            'stock' => $input['stock'],
        ]);

        return response()->json([
            'success' => true,
            'messages' => ['商品を登録しました。'],
        ]);
    }

    public function update(FurnitureUpdateRequest $request, int $id) {
        $input = $request["furniture"];

        $furniture = Furniture::findOrFail($id);

        $fillables = $furniture->getFillable();
        foreach ($fillables as $fillable) {
            if (array_key_exists($fillable, $input)) {
                $furniture->$fillable = $input[$fillable];
            }
        }

        if (isset($input['imageFile'])) {
            $imageUrl = Furniture::uploadS3($input['imageFile']);
            $furniture->image_url = $imageUrl;
        }

        $furniture->save();

        return response()->json([
            'success' => true,
            'messages' => ['商品を更新しました。'],
        ]);
    }

    public function destroy(int $id) {
        $furniture = Furniture::findOrFail($id);
        $furniture->delete();

        return response()->json([
            'success' => true,
            'messages' => ['商品を削除しました。'],
        ]);
    }
}
