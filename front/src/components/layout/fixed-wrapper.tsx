"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { token } from "@/api/token";
import { SideHeader } from "./items/side-header";
import { UserControls } from "./items/user-controls";
import { GlobalContext } from "@/hooks/use-global-state";
import { CartCounts } from "@/type/cart-counts";
import Cookies from "js-cookie";
import { likeIndex } from "@/api/like-index";

type Props = {
  children: React.ReactNode;
};

export function FixedWrapper({ children }: Props) {
  const pathname = usePathname();
  const showUserControls = [
    !pathname.startsWith("/login"),
    !pathname.startsWith("/sign-up"),
  ].every((condition) => condition === true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCounts, setCartCounts] = useState<CartCounts>({});
  const [likeIds, setLikeIds] = useState<number[]>([]);
  const cartIds = Object.keys(cartCounts).map(Number);

  useEffect(() => {
    const tokenApi = async () => {
      const res = await token();
      setIsLoggedIn(res.success);
    };

    tokenApi();
  }, []);

  useEffect(() => {
    const cartCountsToken = Cookies.get("cartCounts");
    if (cartCountsToken) {
      setCartCounts(JSON.parse(cartCountsToken));
    }
  }, []);

  useEffect(() => {
    if (!cartCounts) return;

    const cleanedCounts: CartCounts = {};

    for (const key in cartCounts) {
      const id = Number(key);
      if (!Number.isNaN(id) && cartCounts[key] > 0) {
        cleanedCounts[id] = cartCounts[key];
      }
    }

    Cookies.set("cartCounts", JSON.stringify(cleanedCounts));
  }, [cartCounts]);

  useEffect(() => {
    const likeIndexApi = async () => {
      const likeIndexResponse = await likeIndex();
      setLikeIds(likeIndexResponse.likeIds);
    };

    likeIndexApi();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        cartCounts,
        setCartCounts,
        cartIds,
        likeIds,
        setLikeIds,
      }}
    >
      <div className="fixed top-0 left-0 z-20">
        <SideHeader />
      </div>

      {showUserControls && (
        <div className="fixed top-8 right-8 z-10">
          <UserControls />
        </div>
      )}

      <div className="pl-64 py-24">{children}</div>
    </GlobalContext.Provider>
  );
}
