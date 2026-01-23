"use client";

import Image from "next/image";
import { orderHistory, OrderHistoryResponse } from "@/api/order-history";
import { orderStockout, OrderStockoutResponse } from "@/api/order-stockout";
import { useState, useEffect } from "react";
import { AlertIcon } from "@/components/shared/icons/alert-icon";
import { PackageIcon } from "@/components/shared/icons/package-icon";
import { CheckIcon } from "@/components/shared/icons/check-icon";
import { token } from "@/api/token";
import { useParams, useRouter } from "next/navigation";
import { orderDestroy } from "@/api/order-destroy";
import { showToast } from "@/utils/show-toast";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [history, setHistory] = useState<OrderHistoryResponse["orders"]>([]);
  const [historyStockout, setHistoryStockout] = useState<
    OrderStockoutResponse["orders"]
  >([]);

  const historyApi = async () => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }
    try {
      const historyRes = await orderHistory({ currentPage: 1 });
      setHistory(historyRes.orders);

      const stockoutRes = await orderStockout();
      setHistoryStockout(stockoutRes.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const destroyApi = async (orderId: number) => {
    const res = await orderDestroy(orderId);
    showToast(res.success, res.messages);

    if (res.success) {
      historyApi();
    }
  };

  useEffect(() => {
    historyApi();
  }, []);

  const buttonClassName = "rounded-lg py-2 w-48 cursor-pointer";

  return (
    <section className="m-10">
      {historyStockout.length > 0 && (
        <div className="h-full [&>*]:border-b [&>*]:border-void [&>*]:py-4 [&>*]:px-2 pb-10">
          <h2 className="flex items-center font-bold gap-2 text-void">
            <AlertIcon />
            注文が失敗した商品
          </h2>
          {historyStockout.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <figure>
                <Image
                  className="w-full h-auto rounded-sm"
                  src={order.furniture.imageUrl}
                  alt={order.furniture.name}
                  width={35}
                  height={35}
                />
              </figure>
              <div className="grid grid-cols-5 items-center gap-10">
                <p>{order.furniture.name}</p>
                <p>注文日：{order.createdAt}</p>
                <p>金額：&nbsp;{order.furniture.price * order.count}</p>
                <p>個数：&nbsp;{order.count}</p>
                <button
                  className="bg-white border border-error text-error rounded-lg py-2 w-40 cursor-pointer"
                  onClick={() => {
                    router.push(`/furniture/${order.furniture.id}`);
                  }}
                >
                  再注文
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="h-full [&>*]:border-b [&>*]:py-4 [&>*]:px-2">
        <h2 className="flex items-center font-bold gap-2 text-void">
          <PackageIcon />
          発送履歴
        </h2>
        {history.map((order) => (
          <div key={order.id} className="flex items-center justify-between">
            <figure>
              <Image
                className="w-full h-auto rounded-sm"
                src={order.furniture.imageUrl}
                alt={order.furniture.name}
                width={35}
                height={35}
              />
            </figure>
            <div className="grid grid-cols-5 items-center gap-10">
              <p>{order.furniture.name}</p>
              <p>注文日：{order.createdAt}</p>
              <p>金額：&nbsp;{order.furniture.price * order.count}</p>
              <p>個数：&nbsp;{order.count}</p>
              <p>
                {order.isShipped ? (
                  <CheckIcon className="w-40 text-sccess" />
                ) : (
                  <button
                    className="bg-white border border-error text-error rounded-lg py-2 w-40 cursor-pointer"
                    onClick={() => destroyApi(order.id)}
                    title="本当に商品をキャンセルしますか？"
                  >
                    注文キャンセル
                  </button>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
