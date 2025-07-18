import Image from "next/image";
import Link from "next/link";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { EditIcon } from "@/components/shared/icons/edit-icon";
import { likeStore } from "@/api/like-store";
import { showToast } from "@/utils/show-toast";
import clsx from "clsx";
import { likeDestroy } from "@/api/like-destroy";
import { token } from "@/api/token";
import { use } from "react";
import { useRouter } from "next/navigation";

type Props = {
  furnitures: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }>;
  isAdmin: boolean;
  likeIds: number[];
  setLikeIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export function GalleryLayout({
  furnitures,
  isAdmin,
  likeIds,
  setLikeIds,
}: Props) {
  const router = useRouter();

  const likeStoreApi = async (furnitureId: number) => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    const res = await likeStore({ furnitureId });
    showToast(res.success, res.messages);

    if (res.success) {
      setLikeIds((prev) => [...prev, furnitureId]);
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
      setLikeIds((prev) => prev.filter((id) => id !== furnitureId));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-[2vw] p-[2vw]">
      {furnitures.map((furniture) => (
        <div
          className={clsx(
            likeIds.includes(furniture.id) ? "outline-error" : "outline-void",
            "rounded-2xl p-[2vw] hover:outline"
          )}
          key={furniture.id}
        >
          <Link
            className="flex flex-col gap-2 pb-4"
            href={`/furniture/${furniture.id}`}
          >
            <div className="aspect-square relative">
              <Image
                className="object-cover rounded-2xl"
                src={furniture.imageUrl}
                alt={furniture.name}
                fill
              />
            </div>
            <p>{furniture.name}</p>
            <p className="text-2xl font-bold">
              {furniture.price.toLocaleString("ja-JP", {
                style: "currency",
                currency: "JPY",
              })}
            </p>
          </Link>

          <div className="flex gap-8">
            <ButtonWithLabel
              onClick={() => {
                if (likeIds.includes(furniture.id)) {
                  likeDestroyApi(furniture.id);
                } else {
                  likeStoreApi(furniture.id);
                }
              }}
              label="お気に入り"
            >
              <HeartIcon
                className={clsx(
                  likeIds.includes(furniture.id) && "text-error",
                  "w-8 h-8 hover:opacity-30"
                )}
              />
            </ButtonWithLabel>
            <ButtonWithLabel onClick={() => {}} label="カート">
              <CartIcon className="w-8 h-8 hover:opacity-30" />
            </ButtonWithLabel>
            {isAdmin && (
              <ButtonWithLabel onClick={() => {}} label="編集する">
                <EditIcon className="w-8 h-8 hover:opacity-30" />
              </ButtonWithLabel>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
