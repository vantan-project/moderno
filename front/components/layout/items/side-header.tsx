import { categoryIndex, CategoryIndexResponse } from "@/api/category-index";
import { AddIcon } from "@/components/shared/icons/add-icon";
import { EditIcon } from "@/components/shared/icons/edit-icon";
import { LogoIcon } from "@/components/shared/icons/logo-icon";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SideHeader() {
  const [categories, setCategories] = useState<
    CategoryIndexResponse["categories"]
  >([]);
  // TODO: 管理者かどうかを判別する
  const isAdmin = true;

  useEffect(() => {
    const indexApi = async () => {
      const indexResponse = await categoryIndex();
      setCategories(indexResponse.categories);
    };

    indexApi();
  }, []);

  return (
    <header className="flex flex-col items-center w-64 h-screen p-4 gap-8 bg-void rounded-tr-4xl">
      <Link href="/">
        <LogoIcon className="text-core" />
      </Link>

      <nav className="flex flex-col w-full gap-4 font-bold relative">
        <div className="absolute -top-10 right-0 text-void flex gap-1">
          <Link href="/category/edit" className="bg-core p-1 rounded-lg">
            <EditIcon className="w-6 h-6 hover:opacity-30" />
          </Link>
          <button className="bg-core p-1 rounded-lg">
            <AddIcon className="w-6 h-6 hover:opacity-30" />
          </button>
        </div>

        {categories.map((category) => (
          <Link
            className="flex items-center h-12 min-w-full w-fit pr-2 gap-3 rounded-full outline-void outline-4 text-void bg-core group"
            key={category.id}
            href={`/${category.id}`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full outline-void outline-4 bg-core">
              <Image src="vercel.svg" alt="logo" width={20} height={20} />
            </div>

            <span className="pr-1 max-w-[150px] truncate whitespace-nowrap group-hover:max-w-full transition-all duration-300 ease-in-out">
              {category.name}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
