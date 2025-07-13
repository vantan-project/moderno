"use client";

import { Search } from "@/components/shared/search";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GalleryLayout } from "@/components/shared/gallery-layout";
import { likeIndex } from "@/api/like-index";
import { furnitureLike, FurnitureLikeRequest, FurnitureLikeResponse } from "@/api/furniture-like";

export default function Page() {
  const [search, SetSearch] = useState<FurnitureLikeRequest["search"]>({
    currentPage: 1,
    keyword: "",
  });
  const [furnitures, setFurnitures] = useState<
    FurnitureLikeResponse["furnitures"]
  >([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [likeIds, setLikeIds] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const indexApi = async () => {
        const indexResponse = await furnitureLike({ search });
        setFurnitures(indexResponse.furnitures);
      };

      indexApi();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setIsAdmin(!!Number(Cookies.get("isAdmin")));
  }, [isAdmin]);

  useEffect(() => {
    const likeIndexApi = async () => {
      const likeIndexResponse = await likeIndex();
      setLikeIds(likeIndexResponse.likeIds);
    };

    likeIndexApi();
  }, []);

  return (
    <div>
      <Search
        value={search.keyword}
        onChange={(e) => SetSearch({ ...search, keyword: e.target.value })}
      />

      <GalleryLayout
        furnitures={furnitures}
        isAdmin={isAdmin}
        likeIds={likeIds}
        setLikeIds={setLikeIds}
      />
    </div>
  );
}
