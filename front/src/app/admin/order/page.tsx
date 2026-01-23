"use client";

import {
  orderIndex,
  OrderIndexRequest,
  OrderIndexResponse,
} from "@/api/order-index";
import { token } from "@/api/token";
import { BoxIcon } from "@/components/shared/icons/box-icon";
import { OrderIcon } from "@/components/shared/icons/order-icon";
import { SearchIcon } from "@/components/shared/icons/search-icon";
import { UserRoundIcon } from "@/components/shared/icons/user-round-icon";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderUnship } from "@/api/order-unship";
import { orderShip } from "@/api/order-ship";
import { showToast } from "@/utils/show-toast";

export default function () {
  const router = useRouter();
  const [search, setSearch] = useState<OrderIndexRequest["search"]>({
    keyword: "",
    userId: null,
  });
  const [orders, setOrders] = useState<OrderIndexResponse["orders"]>([]);

  const indexApi = async () => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
      return;
    }
    try {
      const orderRes = await orderIndex({ search });
      if (orderRes.success) {
        setOrders(orderRes.orders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";
    const userId = Number(params.get("userId")) || null;

    setSearch({ keyword, userId });
    indexApi();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search.keyword) params.set("keyword", search.keyword);
    if (search.userId !== null) params.set("userId", String(search.userId));

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);

    indexApi();
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      indexApi();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="m-10">
      <div className="h-full [&>*]:border-b [&>*]:border-void text-void">
        <div className="grid items-center grid-cols-[3fr_3fr_5fr_3fr] gap-10  [&>*]:py-2 [&>*]:px-2">
          <div className="flex items-center justify-start gap-2">
            <UserRoundIcon />
            <p>ユーザー名</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <BoxIcon />
            <p>商品名</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <OrderIcon />
            <p>注文詳細</p>
          </div>

          <div className="flex gap-2 m-2">
            <input
              type="text"
              placeholder="ユーザーID"
              className="rounded px-2 py-2 text-sm bg-gray-100 w-28 placeholder-void"
              value={search.userId || ""}
              onChange={(e) =>
                setSearch({ ...search, userId: Number(e.target.value) })
              }
            ></input>
            <div className="relative w-72">
              <input
                type="text"
                placeholder="検索する"
                className="rounded px-2 py-2 text-sm bg-gray-100 w-70 placeholder-void"
                value={search.keyword}
                onChange={(e) =>
                  setSearch({ ...search, keyword: e.target.value })
                }
              ></input>
              <SearchIcon className="absolute right-2  top-4 bg-gray-100" />
            </div>
          </div>
        </div>
        {orders.map((order) => (
          <div key={order.id} className="[&>*]:py-4 [&>*]:px-2">
            <div className="grid items-center grid-cols-[2fr_3fr_6fr_2fr] gap-10">
              <p>{order.user.name}</p>
              <Link
                className="inline-block w-fit border-b hover:opacity-50 h-[1lh] mb-0"
                href={`/furniture/${order.furniture.id}`}
              >
                {order.furniture.name}
              </Link>
              <div className="flex flex-col gap-4">
                <div className="flex">
                  <div className="w-24">注文日：</div>
                  {order.createdAt}
                </div>
                <div className="flex">
                  <div className="w-24">金額：</div>
                  {(order.furniture.price * order.count).toLocaleString(
                    "ja-JP",
                    {
                      style: "currency",
                      currency: "JPY",
                    },
                  )}
                </div>
                <div className="flex">
                  <div className="w-24">個数：</div>
                  {order.count}
                </div>
                <div className="flex">
                  <div className="w-24">お届け先：</div>
                  {order.user.postalCode &&
                  order.user.prefecture &&
                  order.user.city &&
                  order.user.streetAddress ? (
                    <>
                      〒{order.user.postalCode} / {order.user.prefecture} /{" "}
                      {order.user.city} / {order.user.streetAddress}
                    </>
                  ) : (
                    "未設定"
                  )}
                </div>
              </div>
              <button
                className={clsx(
                  "bg-white border rounded-lg py-2 w-50 cursor-pointer",
                  order.isShipped
                    ? "text-error border-error"
                    : "text-sccess border-sccess",
                )}
                onClick={async () => {
                  let res;

                  if (order.isShipped) {
                    res = await orderUnship(order.id);
                  } else {
                    res = await orderShip(order.id);
                  }

                  if (res.messages?.length) {
                  }

                  if (res.success) {
                    await indexApi();
                  }
                  await showToast(res.success, res.messages);
                }}
              >
                {order.isShipped ? "発送キャンセル" : "発送完了"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
