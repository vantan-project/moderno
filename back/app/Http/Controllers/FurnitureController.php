<?php

namespace App\Http\Controllers;

use App\Http\Requests\FurnitureStoreRequest;
use App\Http\Requests\FurnitureUpdateRequest;
use App\Models\Furniture;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FurnitureController extends Controller
{
    public function index(Request $request) {
        $categoryId = $request['search.categoryId'];
        $currentPage = $request['search.currentPage'];
        $keyword = $request['search.keyword'];

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

    public function show($id) {
        $furniture = Furniture::findOrFail($id);

        return response()->json([
            'success' => true,
            'furniture' => [
                'name' => $furniture->name,
                'imageUrl' => $furniture->image_url,
                'detail' => $furniture->detail,
                'price' => $furniture->price,
                'categoryName' => $furniture->category->name,
                'stock' => $furniture->stock,
            ]
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

    public function weeklyRanking() {
        $oneWeekAgo = Carbon::now()->subWeek();

        $furnitures = Furniture::whereHas('orders', function ($query) use ($oneWeekAgo) {
            $query->whereBetween('created_at', [$oneWeekAgo, Carbon::now()]);
        })
            ->withSum(['orders as recent_order_count_sum' => function ($query) use ($oneWeekAgo) {
                $query->where('created_at', '>=', $oneWeekAgo);
            }], 'count')
            ->orderByDesc('recent_order_count_sum')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'furnitures' => $furnitures->map(function ($furniture) {
                return [
                    'id' => $furniture->id,
                    'name' => $furniture->name,
                    'imageUrl' => $furniture->image_url,
                ];
            })
        ]);
    }

    public function newArrival() {
        $furnitures = Furniture::orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'furnitures' => $furnitures->map(function ($furniture) {
                return [
                    'id' => $furniture->id,
                    'name' => $furniture->name,
                    'imageUrl' => $furniture->image_url,
                ];
            })
        ]);
    }

    public function recommendation($id) {
        $RECOMMENDATION_LIMIT = 10;
        $furniture = Furniture::find($id);

        $topFurnitures = $furniture->transitionsFrom()
            ->with('toFurniture')
            ->orderByDesc('count')
            ->limit($RECOMMENDATION_LIMIT)
            ->get()
            ->map(fn ($transition) => [
                'id' => $transition->toFurniture->id,
                'name' => $transition->toFurniture->name,
                'imageUrl' => $transition->toFurniture->image_url,
                'price' => $transition->toFurniture->price,
            ]);

        $needed = $RECOMMENDATION_LIMIT - $topFurnitures->count();

        $addFurnitures = collect();
        if ($needed > 0) {
            $excludedIds = $topFurnitures->pluck('id')->toArray();

            $addFurnitures = Furniture::where('category_id', $furniture->category_id)
                ->where('id', '<>', $furniture->id)
                ->whereNotIn('id', $excludedIds)
                ->orderBy('created_at')
                ->limit($needed)
                ->get()
                ->map(fn($furniture) => [
                    'id' => $furniture->id,
                    'name' => $furniture->name,
                    'imageUrl' => $furniture->image_url,
                    'price' => $furniture->price,
                ]);
        }

        return response()->json([
            'success' => true,
            'furnitures' => $topFurnitures->concat($addFurnitures)->values(),
        ]);
    }
}
