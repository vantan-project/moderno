import { categoryIndex, CategoryIndexResponse } from "@/api/category-index";
import { AddIcon } from "@/components/shared/icons/add-icon";
import { LogoIcon } from "@/components/shared/icons/logo-icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BoxIcon } from "@/components/shared/icons/box-icon";
import { useDisclosure } from "@mantine/hooks";
import { Modal, TextInput } from "@mantine/core";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { categoryStore } from "@/api/category-store";
import { showToast } from "@/utils/show-toast";
import { DeleteIcon } from "@/components/shared/icons/delete";
import { categoryDestroy } from "@/api/category-destory";

export function SideHeader() {
  const [categories, setCategories] = useState<
    CategoryIndexResponse["categories"]
  >([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState("");

  const indexApi = async () => {
    const indexResponse = await categoryIndex();
    setCategories(indexResponse.categories);
  };

  const handleStoreCategory = () => {
    categoryStore({ category: { name } }).then((res) => {
      showToast(res.success, res.messages);
      if (!res.success) return;
      indexApi();
      close();
    });
  };

  const handleDestoryCategory = (id: number) => {
    categoryDestroy(id).then((res) => {
      showToast(res.success, res.messages);
      if (!res.success) return;
      indexApi();
    });
  };

  useEffect(() => {
    indexApi();
  }, []);

  useEffect(() => {
    setIsAdmin(!!Number(Cookies.get("isAdmin")));
  }, [isAdmin]);

  return (
    <>
      <header className="flex flex-col items-center w-64 h-screen p-4 gap-8 bg-void rounded-tr-4xl">
        <Link href="/">
          <LogoIcon className="text-core" />
        </Link>

        <nav className="flex flex-col w-full gap-4 font-bold relative">
          {isAdmin && (
            <div className="absolute -top-10 right-0 text-void flex gap-1">
              <button
                type="submit"
                className="bg-core p-1 rounded-lg"
                onClick={open}
              >
                <AddIcon className="w-6 h-6 hover:opacity-30" />
              </button>
            </div>
          )}

          {categories.map((category) => (
            <Link
              className="flex items-center h-12 min-w-full w-fit pr-2 gap-3 rounded-full outline-void outline-4 text-void bg-core group"
              key={category.id}
              href={`/${category.id}`}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full outline-void outline-4 bg-core"
                onClick={() => {
                  if (!isAdmin) return;
                  handleDestoryCategory(category.id);
                }}
              >
                {isAdmin ? <DeleteIcon /> : <BoxIcon />}
              </div>

              <span className="pr-1 max-w-[150px] truncate whitespace-nowrap group-hover:max-w-full transition-all duration-300 ease-in-out">
                {category.name}
              </span>
            </Link>
          ))}
        </nav>
      </header>

      <Modal opened={opened} onClose={close} title="カテゴリー追加" centered>
        <TextInput
          label="カテゴリー名"
          leftSection={<BoxIcon className="w-5 h-5" />}
          placeholder="カテゴリー名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="button"
          className="w-full bg-void py-1 rounded-md mt-4 text-white"
          onClick={handleStoreCategory}
        >
          追加
        </button>
      </Modal>
    </>
  );
}
