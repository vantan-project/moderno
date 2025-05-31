"use client";

import { FurnitureShow, FurnitureShowResponse } from "@/api/furniture-show";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderCounter } from "./order-counter";
import { ButtonWithIcon } from "@/components/button-with-icon";
import { CartIcon } from "@/components/icons/cart-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { BagIcon } from "@/components/icons/bag-icon";

export type Order = {
  furnitureId: number;
  count: number;
};

export default function Page() {
  const params = useParams();

  const furnitureId = Number(params?.furnitureId);
  const [furniture, setFurniture] =
    useState<FurnitureShowResponse["furniture"]>();
  const [order, setOrder] = useState<Order>({
    furnitureId: furnitureId,
    count: 1,
  });

  useEffect(() => {
    const showApi = async () => {
      const showResponse = await FurnitureShow({ furnitureId });
      setFurniture(showResponse.furniture);
    };

    showApi();
  }, [furnitureId]);

  if (!furniture) return;

  return (
    <section className="grid grid-cols-2 p-16 pt-28 gap-12 text-void border-void">
      <figure>
        <Image
          className="w-full h-auto rounded-2xl"
          src={furniture.imageUrl}
          alt={furniture.name}
          width={500}
          height={500}
        />
        <figcaption className="sr-only">{furniture.name}の画像</figcaption>
      </figure>

      <article className="h-full [&>*:not(:last-child)]:border-b [&>*]:py-4 [&>*]:px-2">
        <header className="font-bold">{furniture.name}</header>
        <section className="h-64 max-h-64 overflow-y-auto py-2">
          {furniture.detail}
        </section>

        <footer>
          <h3 className="text-2xl pb-8">
            {furniture.price.toLocaleString("ja-JP", {
              style: "currency",
              currency: "JPY",
            })}
            <span className="text-xs">（税込）</span>
          </h3>
          <div className="grid grid-cols-[35%_65%] grid-rows-[42px_42px] gap-5">
            <OrderCounter order={order} setOrder={setOrder} />
            <ButtonWithIcon icon={<CartIcon />}>カートに入れる</ButtonWithIcon>
            <ButtonWithIcon icon={<HeartIcon />}>お気に入り</ButtonWithIcon>
            <ButtonWithIcon icon={<BagIcon />}>今すぐ購入する</ButtonWithIcon>
          </div>
        </footer>
      </article>
    </section>
  );
}
