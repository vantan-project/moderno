import Image from "next/image";
import Link from "next/link";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { EditIcon } from "@/components/shared/icons/edit-icon";
import { likeStore } from "@/api/like-store";
import { showToast } from "@/utils/show-toast";
import clsx from "clsx";
import { likeDestroy } from "@/api/like-destroy";
import { token } from "@/api/token";
import { useRouter } from "next/navigation";
import { OrderCounter } from "./order-counter";
import { useGlobalContext } from "@/hooks/use-global-state";

type Props = {
  furnitures: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  }>;
  isAdmin: boolean;
};

export function GalleryLayout({ furnitures, isAdmin }: Props) {
  const router = useRouter();
  const { likeIds, setLikeIds } = useGlobalContext();

  const likeStoreApi = async (furnitureId: number) => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    const res = await likeStore({ furnitureId });
    showToast(res.success, res.messages);

    if (res.success) {
      setLikeIds([...likeIds, furnitureId]);
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
      setLikeIds(likeIds.filter((id) => id !== furnitureId));
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

          <div className="flex items-center justify-between gap-8">
            <div className="h-10 w-1/2">
              <OrderCounter
                furnitureId={furniture.id}
                stock={furniture.stock}
              />
            </div>
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
