"use client";

import { FurnitureShow, FurnitureShowResponse } from "@/api/furniture-show";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderCounter } from "../../../components/features/furniture-[furnitureId]/order-counter";
import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { BagIcon } from "@/components/shared/icons/bag-icon";
import {
  FurnitureRecommendation,
  FurnitureRecommendationResponse,
} from "@/api/furniture-recommendation";
import { TransitionUpdate } from "@/api/transition-update";

export type Order = {
  furnitureId: number;
  count: number;
};

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const furnitureId = Number(params?.furnitureId);
  const [furniture, setFurniture] =
    useState<FurnitureShowResponse["furniture"]>();
  const [recommendation, setRecommendation] = useState<
    FurnitureRecommendationResponse["furnitures"]
  >([]);
  const [order, setOrder] = useState<Order>({
    furnitureId: furnitureId,
    count: 1,
  });

  useEffect(() => {
    const showApi = async () => {
      const showResponse = await FurnitureShow({ furnitureId });
      setFurniture(showResponse.furniture);
    };

    const recommendationApi = async () => {
      const recommendationResponse = await FurnitureRecommendation(furnitureId);
      setRecommendation(recommendationResponse.furnitures);
    };

    showApi();
    recommendationApi();
  }, [furnitureId]);

  const handleTransitionUpdate = async (
    toFurnitureId: number,
    fromFurnitureId: number
  ) => {
    await TransitionUpdate({
      toFurnitureId,
      fromFurnitureId
    });
  };

  if (!furniture) return;

  return (
    <section className="px-12 text-void border-void">
      <div className="grid grid-cols-2 gap-12">
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
              <OrderCounter order={order} setOrder={setOrder} stock={furniture.stock} />
              <ButtonWithIcon icon={<CartIcon />}>
                カートに入れる
              </ButtonWithIcon>
              <ButtonWithIcon icon={<HeartIcon />}>お気に入り</ButtonWithIcon>
              <ButtonWithIcon icon={<BagIcon />}>今すぐ購入する</ButtonWithIcon>
            </div>
          </footer>
        </article>
      </div>

      <div className="pt-20">
        <h2 className="text-2xl font-bold">あなたにおすすめ</h2>
        <div className="flex gap-10 overflow-x-auto w-full py-4 [scrollbar-color:var(--color-void)_transparent]">
          {recommendation.map((furniture) => (
            <button
              onClick={() => {
                handleTransitionUpdate(furniture.id, furnitureId);
                router.push(`/furniture/${furniture.id}`)
              }}
              key={furniture.id}
              className="flex flex-col flex-shrink-0 gap-1"
            >
              <Image
                className="w-52 h-52 rounded-2xl hover:brightness-75 transition-all ease-out duration-700"
                src={furniture.imageUrl}
                alt={furniture.name}
                width={200}
                height={200}
              />
              <p className="text-left truncate max-w-52">{furniture.name}</p>
              <p className="text-left truncate max-w-52">
                {furniture.price.toLocaleString("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                })}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
