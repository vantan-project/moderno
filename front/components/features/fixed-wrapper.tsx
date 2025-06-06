"use client";

import { categoryIndex, CategoryIndexResponse } from "@/api/category-index";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { UserIcon } from "@/components/shared/icons/user-icon";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoIcon } from "@/components/shared/icons/logo-icon";
import { Token } from "@/api/token";
import { LoginIcon } from "../shared/icons/login-icon";

type Props = {
  children: React.ReactNode;
};

export function FixedWrapper({ children }: Props) {
  const pathname = usePathname();
  const conditions: boolean[] = [
    !pathname.startsWith("/admin"),
    !pathname.startsWith("/login"),
    !pathname.startsWith("/sign-up"),
  ];
  const allTrue = conditions.every((condition) => condition === true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tokenApi = async () => {
      const res = await Token();
      setIsLoggedIn(res.success);
    };

    tokenApi();
  }, []);

  return (
    <>
      {allTrue && (
        <>
          <SideHeader />
          <UserControls isLoggedIn={isLoggedIn} />
        </>
      )}
      <div className={allTrue ? "pl-64 py-28" : ""}>{children}</div>
    </>
  );
}

const SideHeader = () => {
  const [categories, setCategories] = useState<
    CategoryIndexResponse["categories"]
  >([]);

  useEffect(() => {
    const indexApi = async () => {
      const indexResponse = await categoryIndex();
      setCategories(indexResponse.categories);
    };

    indexApi();
  }, []);

  return (
    <header className="fixed top-0 left-0 z-20">
      <div className="flex flex-col items-center w-64 h-screen p-4 gap-8 bg-void rounded-tr-4xl">
        <Link href="/">
          <LogoIcon className="text-core" />
        </Link>

        <nav className="flex flex-col w-full gap-4 font-bold">
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
      </div>
    </header>
  );
};

const UserControls = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="fixed top-8 right-8 z-10">
      <div className="flex items-center gap-8">
        <ButtonWithLabel onClick={() => {}} label="お気に入り">
          <HeartIcon className="w-10 h-10" />
        </ButtonWithLabel>
        <ButtonWithLabel onClick={() => {}} label="カート">
          <CartIcon className="w-10 h-10" />
        </ButtonWithLabel>

        {isLoggedIn ? (
          <button>
            <UserIcon className="w-12 h-12" />
          </button>
        ) : (
          <Link href="/login">
            <LoginIcon className="w-12 h-12" />
          </Link>
        )}
      </div>
    </div>
  );
};
