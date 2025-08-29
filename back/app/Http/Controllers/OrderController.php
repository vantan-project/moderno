<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Models\Furniture;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request) {
        $currentPage = $request['currentPage'];
        $orders = Order::with('furniture')
            ->where('is_shipped',true);
        $PER_PAGE = 20;
        $orders = $orders->paginate($PER_PAGE, ['*'], 'page', $currentPage);

        return response()->json([
            'success' => true,
            'orders' => collect($orders->items())
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'furniture' => [
                            'id' => $order->furniture->id,
                            'name' => $order->furniture->name,
                            'imageUrl' => $order->furniture->image_url,
                        ],
                        'count' => $order->count,
                        'isShipped' => (bool) $order->is_shipped,
                        'isCompleted' => (bool) $order->is_completed,
                    ];
                }),
            'lastPage' => $orders->lastPage(),
        ]);
    }

    public function stockout(Request $request){
        $orders = Order::with('furniture')
            ->where('is_shipped',false)
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'furniture' => [
                            'id' => $order->furniture->id,
                            'name' => $order->furniture->name,
                            'imageUrl' => $order->furniture->image_url,
                        ],
                        'count' => $order->count,
                        'isShipped' => (bool) $order->is_shipped,
                        'isCompleted' => (bool) $order->is_completed,
                    ];
                }),
        ]);
    }

    public function history(Request $request) {
        $authUser = request()->user();
        $currentPage = $request['currentPage'];
        $orders = $authUser->orders()->with('furniture');
        $PER_PAGE = 20;
        $orders = $orders->paginate($PER_PAGE, ['*'], 'page', $currentPage);

        return response()->json([
            'success' => true,
            'orders' => collect($orders->items())
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'furniture' => [
                            'id' => $order->furniture->id,
                            'name' => $order->furniture->name,
                            'imageUrl' => $order->furniture->image_url,
                        ],
                        'count' => $order->count,
                        'isShipped' => (bool) $order->is_shipped,
                        'isCompleted' => (bool) $order->is_completed,
                    ];
                }),
            'lastPage' => $orders->lastPage(),
        ]);
    }

    public function store(OrderStoreRequest $request)
    {
        $authUser = request()->user();
        $orders = $request['orders'];

        $orderCounts = collect($orders)
            ->mapWithKeys(function ($order) {
                return [$order['furnitureId'] => $order['count']];
            });
        $furnitures = Furniture::whereIn('id', collect($orders)->pluck('furnitureId'))
            ->get();

        DB::transaction(function () use ($authUser, $orderCounts, $furnitures) {
            $insertRecords = [];

            foreach ($furnitures as $furniture) {
                $needed = $orderCounts[$furniture->id];

                if ($furniture->stock < $needed) {
                    $insertRecords[] = [
                        'user_id' => $authUser->id,
                        'furniture_id' => $furniture->id,
                        'count' => $needed,
                        'is_completed' => false,
                    ];
                    continue;
                }
                $furniture->decrement('stock', $needed);

                $insertRecords[] = [
                    'user_id' => $authUser->id,
                    'furniture_id' => $furniture->id,
                    'count' => $needed,
                    'is_completed' => true,
                ];
            }

            Order::insert($insertRecords);
        });

        return response()->noContent(204);
    }

    public function destroy($id)
    {
        $authUser = request()->user();
        $order = $authUser->orders()->find($id);

        if ($order->is_shopped) {
            return response()->json([
                'success' => false,
                'messages' => ['発送後のため注文をキャンセルできません。'],
            ]);
        }

        $order->furniture->increment('stock', $order->count);
        $order->delete();

        return response()->json([
            'success' => true,
            'messages' => ['注文をキャンセルしました。'],
        ]);
    }
}
