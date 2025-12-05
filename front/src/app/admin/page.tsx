"use client";

import { useForm } from "react-hook-form";
import { FurnitureStoreRequest, furnitureStore } from "@/api/furniture-store";
import { useEffect, useState } from "react";
import { categoryIndex, CategoryIndexResponse } from "@/api/category-index";
import { showToast } from "@/utils/show-toast";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { FolderPlusIcon } from "@/components/shared/icons/folder-plus-icon";

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

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="h-full [&>*]:py-4 [&>*]:px-2  mx-20 my-10">
      <h2 className="flex items-center gap-2 text-xl font-bold text-void border-b border-void">
        <UserIcon />
        管理者
      </h2>
      <form
        className="flex flex-col w-full m-0 p-8 [&_input]:border [&_input]:p-2 [&_input]:mb-4 [&_input]:rounded-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-[1fr_2fr] gap-12 border-b border-void text-void py-8">
          <label className="flex flex-col items-center justify-center w-full h-full rounded-sm cursor-pointer bg-gray">
            {preview ? (
              <img
                src={preview}
                alt="プレビュー"
                className="object-cover rounded-sm h-full w-auto"
              />
            ) : (
              <>
                <FolderPlusIcon className="w-40 h-40 text-[#BABABA]" />
                <span className="text-sm mt-2">商品画像をアップロードする</span>
              </>
            )}
            <input
              type="file"
              {...register("furniture.imageFile")}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div>
            <div className="flex flex-col">
              <label>商品名</label>
              <input {...register("furniture.name")} />
            </div>
            <div className="flex flex-col">
              <label>商品詳細</label>
              <textarea
                className="border p-2  h-56 rounded-sm"
                {...register("furniture.detail")}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10 text-void border-void py-8">
          <div className="flex flex-col">
            <label>商品価格</label>
            <input type="number" {...register("furniture.price")} />
          </div>
          <div className="flex flex-col">
            <label>商品在庫</label>
            <input type="number" {...register("furniture.stock")} />
          </div>
          <div className="flex flex-col">
            <label>商品カテゴリー</label>
            <select
              className="border p-2 mb-8 rounded-sm"
              {...register("furniture.categoryId")}
            >
              <option value=""></option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="p-2 bg-gray" type="submit">
          登録
        </button>
      </form>
    </div>
  );
}
