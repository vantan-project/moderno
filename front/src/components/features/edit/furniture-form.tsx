import { useEffect, useState } from "react";
import { categoryIndex, CategoryIndexResponse } from "@/api/category-index";
import {
  FurnitureUpdateRequest,
  furnitureUpdate,
} from "@/api/furniture-update";
import { useForm } from "react-hook-form";
import { showToast } from "@/utils/show-toast";
import { FolderPlusIcon } from "@/components/shared/icons/folder-plus-icon";
import { FurnitureShowResponse } from "@/api/furniture-show";
import { useRouter } from "next/navigation";

type Props = {
  furniture?: FurnitureShowResponse["furniture"];
};

export default function FurnitureForm({ furniture }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<
    CategoryIndexResponse["categories"]
  >([]);
  const { register, handleSubmit, reset, setValue } =
    useForm<FurnitureUpdateRequest>();

  const [furnitureId, setFurnitureId] = useState<number | null>(null);

  const onSubmit = async (data: FurnitureUpdateRequest) => {
    if (furnitureId === null) return;
    const res = await furnitureUpdate(furnitureId, data);
    if (res.success) {
      reset();
      router.push(`/${data.furniture.categoryId}`);
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

  useEffect(() => {
    if (furniture) {
      setFurnitureId(furniture.id);
      setValue("furniture.name", furniture.name);
      setValue("furniture.detail", furniture.detail);
      setValue("furniture.price", furniture.price);
      setValue("furniture.stock", furniture.stock);
      setPreview(furniture.imageUrl);
    }
  }, [furniture]);

  useEffect(() => {
    if (furniture && categories.length > 0) {
      setValue("furniture.categoryId", furniture.categoryId);
    }
  }, [furniture, categories]);

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setValue("furniture.imageFile", file);
    }
  };

  return (
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
          <input type="file" className="hidden" onChange={handleFileChange} />
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
  );
}
