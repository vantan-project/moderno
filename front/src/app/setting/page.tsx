"use client";

import Image from "next/image";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { MailIcon } from "@/components/shared/icons/mail-icon";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { authLogout } from "@/api/auth-logout";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authDestroy } from "@/api/auth-destroy";
import { useGlobalContext } from "@/hooks/use-global-state";
import { set, useForm } from "react-hook-form";
import { authIndex, AuthIndexResponse } from "@/api/auth-index";
import { ConfirmButton } from "@/components/features/setting/confirm-button";
import { PasswordUpdateButton } from "@/components/features/setting/password-update-button";
import { isEqual } from "lodash";
import { authUpdate } from "@/api/auth-update";

export default function Page() {
  const router = useRouter();
  const { setIsLoggedIn } = useGlobalContext();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<AuthIndexResponse["auth"]>();
  const initialValuesRef = useRef<AuthIndexResponse["auth"] | null>(null);
  const [hasChanged, setHasChanged] = useState(false);

  const indexApi = async () => {
    const res = await authIndex();

    initialValuesRef.current = res.auth;
    reset(res.auth);
  };

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

  useEffect(() => {
    indexApi();
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (initialValuesRef.current) {
        console.log(value, initialValuesRef.current);
        setHasChanged(!isEqual(value, initialValuesRef.current));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (formData: AuthIndexResponse["auth"]) => {
    if (!initialValuesRef.current) return;

    const initialValues = initialValuesRef.current;
    const diffData = Object.keys(formData).reduce((acc, key) => {
      const typedKey = key as keyof AuthIndexResponse["auth"];
      if (!isEqual(formData[typedKey], initialValues[typedKey])) {
        acc[typedKey] = formData[typedKey];
      }
      return acc;
    }, {} as Partial<AuthIndexResponse["auth"]>);

    const updateApi = async () => {
      const res = await authUpdate({
        auth: diffData,
      });
      showToast(res.success, res.messages);

      if (res) indexApi();
    };

    updateApi();
  };

  const titleClassName = "text-lg pb-4 font-bold";
  const contentClassName = "flex flex-col gap-6";
  const blurClassName =
    "bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] rounded-xl";
  const buttonClassName = "rounded-lg py-2 w-48 cursor-pointer";
  return (
    <>
      <div className="flex flex-col justify-center items-center h-[calc(100vh-192px)] gap-8 px-40">
        <Image
          className="fixed top-0 left-0 w-full h-full"
          src="/setting.png"
          alt="setting"
          width={1000}
          height={1000}
        />

        <div
          className={clsx(blurClassName, "grid grid-cols-2 p-4 pb-10 w-full")}
        >
          <div className="pr-10 border-r border-gray-300">
            <p className={titleClassName}>ユーザー情報</p>

            <div className={contentClassName}>
              <MantineTextInput
                label="ユーザー名"
                leftSection={<UserIcon className="w-5 h-5" />}
                {...register("name")}
              />
              <MantineTextInput
                classNames={{
                  input: "!py-5 !border-none !rounded-full",
                  section: "px-2",
                }}
                label="メールアドレス"
                leftSection={<MailIcon className="w-5 h-5" />}
                {...register("email")}
              />
              <PasswordUpdateButton className="rounded-lg py-2 text-void border border-void bg-core cursor-pointer" />
            </div>
          </div>

          <div className="pl-10">
            <p className={titleClassName}>住所</p>

            <div className={contentClassName}>
              <MantineTextInput
                label="郵便番号"
                maxLength={8}
                placeholder="郵便番号"
                {...register("postalCode")}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!/^[0-9-]*$/.test(value)) return;
                  if (value.length >= 4 && value[3] !== "-") {
                    setValue(
                      "postalCode",
                      value.slice(0, 3) + "-" + value.slice(3, 7)
                    );
                    return;
                  }

                  setValue("postalCode", e.target.value);
                }}
              />
              <MantineTextInput
                label="都道府県"
                placeholder="都道府県"
                {...register("prefecture")}
              />
              <MantineTextInput
                label="市区町村"
                placeholder="市区町村"
                {...register("city")}
              />
              <MantineTextInput
                label="町名・番地"
                placeholder="町名・番地"
                {...register("streetAddress")}
              />
            </div>
          </div>
        </div>

        <div className={clsx(blurClassName, "flex gap-4 p-2 mr-0 ml-auto")}>
          <ConfirmButton
            className={clsx(
              buttonClassName,
              "bg-white border border-error text-error"
            )}
            onClick={logoutApi}
            title="本当にログアウトしますか？"
          >
            ログアウト
          </ConfirmButton>
          <ConfirmButton
            className={clsx(buttonClassName, "bg-error text-white")}
            onClick={destroyApi}
            title="本当にアカウントを削除しますか？"
          >
            アカウントを削除
          </ConfirmButton>
        </div>
      </div>

      {hasChanged && (
        <div className="fixed bottom-10 right-0 w-[calc(100vw-256px)] px-20">
          <div
            className={clsx(
              blurClassName,
              "w-full flex justify-between items-center p-2"
            )}
          >
            <p>変更を保存してください</p>

            <div className="flex gap-4">
              <button
                className={clsx(buttonClassName, "border bg-core")}
                onClick={() => {
                  if (initialValuesRef.current) reset(initialValuesRef.current);
                }}
              >
                キャンセル
              </button>
              <button
                className={clsx(buttonClassName, "bg-sccess text-core")}
                onClick={handleSubmit(onSubmit)}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
