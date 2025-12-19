"use client";

import { token } from "@/api/token";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HistoryIcon } from "@/components/shared/icons/history-icon";
import { LoginIcon } from "@/components/shared/icons/login-icon";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { useGlobalContext } from "@/hooks/use-global-state";
import { useRouter } from "next/navigation";
import { Indicator } from "@mantine/core";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserRoundIcon } from "@/components/shared/icons/user-round-icon";
import { BoxIcon } from "@/components/shared/icons/box-icon";
import { SquarePenIcon } from "@/components/shared/icons/square-pen-icon";

export function UserControls() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoggedIn, cartCounts } = useGlobalContext();
  const router = useRouter();
  const totalCount = Object.values(cartCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const iconClassName = "w-8 h-8 hover:opacity-30";
  const handleLike = async () => {
    const tokenRes = await token();
    if (!tokenRes.success) {
      router.push("/login");
      return;
    }

    router.push("/like");
  };
  const handleCart = async () => {
    router.push("/cart");
  };
  const handleHistory = async () => {
    const tokenRes = await token();
    if (!tokenRes.success) {
      router.push("/login");
      return;
    }
    router.push("/history");
  };
  const handleUser = async () => {
    const tokenRes = await token();
    if (!tokenRes.success) {
      router.push("/login");
      return;
    }
    router.push("/admin/user");
  };
  const handleOrder = async () => {
    const tokenRes = await token();
    if (!tokenRes.success) {
      router.push("/login");
      return;
    }
    router.push("/admin/order");
  };
  const handleAdd = async () => {
    const tokenRes = await token();
    if (!tokenRes.success) {
      router.push("/login");
      return;
    }
    router.push("/admin");
  };

  useEffect(() => {
    setIsAdmin(!!Number(Cookies.get("isAdmin")));
  }, [isAdmin]);

  return (
    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] text-void rounded-2xl py-2 px-5 [&>*]:w-16">
      {isAdmin ? (
        <>
          <ButtonWithLabel onClick={handleUser} label="ユーザー一覧">
            <UserRoundIcon className={iconClassName} />
          </ButtonWithLabel>
          <ButtonWithLabel onClick={handleOrder} label="注文一覧">
            <BoxIcon className={iconClassName} />
          </ButtonWithLabel>
          <ButtonWithLabel onClick={handleAdd} label="注文追加">
            <SquarePenIcon className={iconClassName} />
          </ButtonWithLabel>
        </>
      ) : (
        <>
          <ButtonWithLabel onClick={handleHistory} label="購入履歴">
            <HistoryIcon className={iconClassName} />
          </ButtonWithLabel>
          <ButtonWithLabel onClick={handleLike} label="お気に入り">
            <svg
              className={iconClassName}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
            </svg>
          </ButtonWithLabel>

          <ButtonWithLabel onClick={handleCart} label="カート">
            <Indicator label={totalCount} size={16} disabled={totalCount === 0}>
              <CartIcon className={iconClassName} />
            </Indicator>
          </ButtonWithLabel>

          {isLoggedIn ? (
            <ButtonWithLabel
              onClick={() => router.push("/setting")}
              label="ユーザー設定"
            >
              <UserIcon className={iconClassName} />
            </ButtonWithLabel>
          ) : (
            <ButtonWithLabel
              onClick={() => router.push("/login")}
              label="ログイン"
            >
              <LoginIcon className={iconClassName} />
            </ButtonWithLabel>
          )}
        </>
      )}
    </div>
  );
}
