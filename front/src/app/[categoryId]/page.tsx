"use client";

import {
  furnitureIndex,
  FurnitureIndexRequest,
  FurnitureIndexResponse,
} from "@/api/furniture-index";
import { Search } from "@/components/shared/search";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GalleryLayout } from "@/components/shared/gallery-layout";

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const indexApi = async () => {
        const indexResponse = await furnitureIndex({ search });
        setFurnitures(indexResponse.furnitures);
      };

      indexApi();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setIsAdmin(!!Number(Cookies.get("isAdmin")));
  }, [isAdmin]);

  return (
    <div>
      <Search
        value={search.keyword}
        onChange={(e) => SetSearch({ ...search, keyword: e.target.value })}
      />

      <GalleryLayout furnitures={furnitures} isAdmin={isAdmin} />
    </div>
  );
}
