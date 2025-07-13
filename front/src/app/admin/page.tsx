"use client";

import { useForm } from "react-hook-form";
import {
  FurnitureStoreRequest,
  furnitureStore,
} from "@/api/furniture-store";
import { useEffect, useState } from "react";
import { categoryIndex, CategoryIndexResponse } from "@/api/category-index";
import { showToast } from "@/utils/show-toast";

export default function FurnitureForm() {
  const [categories, setCategories] = useState<
    CategoryIndexResponse["categories"]
  >([]);
  const { register, handleSubmit, reset } = useForm<FurnitureStoreRequest>();

  const onSubmit = async (data: FurnitureStoreRequest) => {
    const res = await furnitureStore(data);
    if (res.success) {
      reset();
    }

    await showToast(res.success, res.messages);
  };

  useEffect(() => {
    const categoryIndexApi = async () => {
      const res = await categoryIndex();
      setCategories(res.categories);
    };

    categoryIndexApi();
  }, []);

  return (
    <form
      className="flex flex-col w-[1000px] my-0 mx-auto p-8 [&_input]:border [&_input]:p-2 [&_input]:mb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>商品名</label>
      <input
        {...register("furniture.name")}
      />

      <label>画像</label>
      <input type="file" {...register("furniture.imageFile")} />

      <label>詳細</label>
      <textarea
        className="border p-2 mb-8 h-96"
        {...register("furniture.detail")}
      />

      <label>価格</label>
      <input type="number" {...register("furniture.price")} />

      <label>カテゴリ</label>
      <select className="border p-2 mb-8" {...register("furniture.categoryId")}>
        <option value="">選択してください</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <label>在庫数</label>
      <input type="number" {...register("furniture.stock")} />

      <button className="p-2 bg-gray" type="submit">
        登録
      </button>
    </form>
  );
}
