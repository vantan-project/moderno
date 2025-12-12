"use client";

import { furnitureShow, FurnitureShowResponse } from "@/api/furniture-show";
import FurnitureForm from "@/components/features/edit/furniture-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const furnitureId = Number(params?.furnitureId);
  const [furniture, setFurniture] =
    useState<FurnitureShowResponse["furniture"]>();

  useEffect(() => {
    const showApi = async () => {
      const showResponse = await furnitureShow({ furnitureId });

      setFurniture(showResponse.furniture);
    };

    showApi();
  }, [furnitureId]);

  return (
    <div>
      <FurnitureForm furniture={furniture} />
    </div>
  );
}
