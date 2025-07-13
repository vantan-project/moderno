"use client";

import { furnitureShow, FurnitureShowResponse } from "@/api/furniture-show";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderCounter } from "../../../components/features/furniture-[furnitureId]/order-counter";
import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { BagIcon } from "@/components/shared/icons/bag-icon";
import {
  furnitureRecommendation,
  FurnitureRecommendationResponse,
} from "@/api/furniture-recommendation";
import { transitionUpdate } from "@/api/transition-update";
import { EditIcon } from "@/components/shared/icons/edit-icon";
import Link from "next/link";
import Cookies from "js-cookie";
import { likeIndex } from "@/api/like-index";
import { likeStore } from "@/api/like-store";
import { token } from "@/api/token";
import { showToast } from "@/utils/show-toast";
import { likeDestroy } from "@/api/like-destroy";

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
    count: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLiked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const showApi = async () => {
      const showResponse = await furnitureShow({ furnitureId });
      setFurniture(showResponse.furniture);
    };

    const recommendationApi = async () => {
      const recommendationResponse = await furnitureRecommendation(furnitureId);
      setRecommendation(recommendationResponse.furnitures);
    };

    const likeIndexApi = async () => {
      const likeIndexResponse = await likeIndex();
      setLiked(likeIndexResponse.likeIds.includes(furnitureId));
    };

    showApi();
    recommendationApi();
    likeIndexApi();
  }, [furnitureId]);

  useEffect(() => {
    setIsAdmin(!!Number(Cookies.get("isAdmin")));
  }, [isAdmin]);

  const handleTransitionUpdate = async (
    toFurnitureId: number,
    fromFurnitureId: number
  ) => {
    await transitionUpdate({
      toFurnitureId,
      fromFurnitureId,
    });
  };

  const likeStoreApi = async (furnitureId: number) => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    const res = await likeStore({ furnitureId });
    showToast(res.success, res.messages);

    if (res.success) {
      setLiked(true);
    }
  };

  const likeDestroyApi = async (furnitureId: number) => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    const res = await likeDestroy({ furnitureId });
    showToast(res.success, res.messages);

    if (res.success) {
      setLiked(false);
    }
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
          <section className="h-64 max-h-64 overflow-y-auto py-2 whitespace-pre-wrap [&::-webkit-scrollbar]:hidden">
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
              <OrderCounter
                order={order}
                setOrder={setOrder}
                stock={furniture.stock}
              />
              <ButtonWithIcon icon={<CartIcon />}>
                カートに入れる
              </ButtonWithIcon>
              <ButtonWithIcon
                icon={<HeartIcon />}
                backgroundColor={isLiked ? "var(--color-error)" : ""}
                onClick={() => {
                  if (isLiked) {
                    likeDestroyApi(furnitureId);
                  } else {
                    likeStoreApi(furnitureId);
                  }
                }}
              >
                お気に入り
              </ButtonWithIcon>
              <ButtonWithIcon icon={<BagIcon />}>今すぐ購入する</ButtonWithIcon>
            </div>
          </footer>
        </article>
      </div>

      {recommendation.length > 0 && (
        <div className="pt-20">
          <h2 className="text-2xl font-bold">あなたにおすすめ</h2>
          <div className="flex gap-10 overflow-x-auto w-full py-4 [scrollbar-color:var(--color-void)_transparent]">
            {recommendation.map((furniture) => (
              <button
                onClick={() => {
                  handleTransitionUpdate(furniture.id, furnitureId);
                  router.push(`/furniture/${furniture.id}`);
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
      )}

      {isAdmin && (
        <Link
          className="fixed bottom-14 right-14 text-void border-3 border-void rounded-full py-4 px-12 bg-core flex items-center gap-4"
          href={`/furniture/${furnitureId}/edit`}
        >
          <EditIcon className="w-8 h-8" />
          <p className="text-xl">編集</p>
        </Link>
      )}
    </section>
  );
}
