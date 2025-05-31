"use client";

import {
  FurnitureIndex,
  FurnitureIndexRequest,
  FurnitureIndexResponse,
} from "@/api/furniture-index";
import { ButtonWithLabel } from "@/components/button-with-label";
import { CartIcon } from "@/components/icons/cart-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { Search } from "@/components/search";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();

  const categoryId = params?.categoryId;
  const [search, SetSearch] = useState<FurnitureIndexRequest["search"]>({
    categoryId: Number(categoryId),
    currentPage: 1,
    keyword: "",
  });
  const [furnitures, setFurnitures] = useState<
    FurnitureIndexResponse["furnitures"]
  >([]);

  useEffect(() => {
    const indexApi = async () => {
      const indexResponse = await FurnitureIndex({ search });
      setFurnitures(indexResponse.furnitures);
    };

    indexApi();
  }, [search]);

  return (
    <div>
      <Search
        value={search.keyword}
        onChange={(e) => SetSearch({ ...search, keyword: e.target.value })}
      />

      <div className="grid grid-cols-3 gap-[2vw] p-[2vw] pt-32">
        {furnitures.map((furniture) => (
          <div
            className="rounded-2xl p-[2vw] outline-void hover:outline"
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
              <p className="text-2xl font-bold">￥{furniture.price}</p>
            </Link>

            <div className="flex gap-12">
              <ButtonWithLabel onClick={() => {}} label="お気に入り">
                <HeartIcon className="w-10 h-10" />
              </ButtonWithLabel>
              <ButtonWithLabel onClick={() => {}} label="カート">
                <CartIcon className="w-10 h-10" />
              </ButtonWithLabel>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
