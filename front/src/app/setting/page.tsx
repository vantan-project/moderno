"use client";

import Image from "next/image";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { MantinePasswordInput } from "@/components/shared/mantine/mantine-password-input";
import { MailIcon } from "@/components/shared/icons/mail-icon";
import { LockIcon } from "@/components/shared/icons/lock-icon";
import { useState } from "react";
import clsx from "clsx";
import { authLogout } from "@/api/auth-logout";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authDestroy } from "@/api/auth-destroy";
import { useGlobalContext } from "@/hooks/use-global-state";
import { set } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const { setIsLoggedIn } = useGlobalContext();
  const [postalCode, setPostalCode] = useState("");

  const logoutApi = async () => {
    const res = await authLogout();
    showToast(res.success, res.messages);

    if (res.success) {
      setIsLoggedIn(false);
      Cookies.remove("authToken");
      router.push("/");
    }
  };

  const destroyApi = async () => {
    const res = await authDestroy();
    showToast(res.success, res.messages);

    if (res.success) {
      setIsLoggedIn(false);
      Cookies.remove("authToken");
      router.push("/");
    }
  };

  const titleClassName = "text-lg pb-4";
  const contentClassName = "flex flex-col gap-6";
  const blurClassName =
    "bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] rounded-xl";
  const buttonClassName = "rounded-lg py-2 w-48";
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-192px)] gap-8 px-40">
      <Image
        className="fixed top-0 left-0 w-full h-full"
        src="/setting.png"
        alt="setting"
        width={1000}
        height={1000}
      />

      <div className={clsx(blurClassName, "grid grid-cols-2 p-4 pb-10 w-full")}>
        <div className="pr-10 border-r border-gray-300">
          <p className={titleClassName}>ユーザー情報</p>

          <div className={contentClassName}>
            <MantineTextInput
              label="ユーザー名"
              value=""
              leftSection={<UserIcon className="w-5 h-5" />}
              onChange={() => {}}
            />
            <MantineTextInput
              classNames={{
                input: "!py-5 !border-none !rounded-full",
                section: "px-2",
              }}
              label="メールアドレス"
              value=""
              leftSection={<MailIcon className="w-5 h-5" />}
              onChange={() => {}}
            />
            <MantinePasswordInput
              label="パスワード（変更）"
              value=""
              leftSection={<LockIcon className="w-5 h-5" />}
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="pl-10">
          <p className={titleClassName}>住所</p>

          <div className={contentClassName}>
            <MantineTextInput
              label="郵便番号"
              value={postalCode}
              maxLength={8}
              placeholder="郵便番号"
              onChange={(e) => {
                const value = e.target.value;

                if (!/^[0-9-]*$/.test(value)) return;
                if (value.length === 3 && postalCode.at(-1) !== "-") {
                  setPostalCode(value + "-");
                  return;
                }
                if (value.length >= 4 && value[3] !== "-") {
                  setPostalCode(value.slice(0, 3) + "-" + value.slice(3, 7));
                  return;
                }

                setPostalCode(e.target.value);
              }}
            />
            <MantineTextInput
              label="都道府県"
              placeholder="都道府県"
              value=""
              onChange={() => {}}
            />
            <MantineTextInput
              label="市区町村"
              placeholder="市区町村"
              value=""
              onChange={() => {}}
            />
            <MantineTextInput
              label="町名・番地"
              placeholder="町名・番地"
              value=""
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      <div className={clsx(blurClassName, "flex gap-4 p-2 mr-0 ml-auto")}>
        <button
          className={clsx(
            buttonClassName,
            "bg-white border border-error text-error"
          )}
          onClick={logoutApi}
        >
          ログアウト
        </button>
        <button
          className={clsx(buttonClassName, "bg-error text-white")}
          onClick={destroyApi}
        >
          アカウントを削除
        </button>
      </div>
    </div>
  );
}
