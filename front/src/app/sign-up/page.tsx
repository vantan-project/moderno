"use client";

import { LockIcon } from "@/components/shared/icons/lock-icon";
import { MailIcon } from "@/components/shared/icons/mail-icon";
import { MantinePasswordInput } from "@/components/shared/mantine/mantine-password-input";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { showToast } from "@/utils/show-toast";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authSignUp, AuthSignUpRequest } from "@/api/auth-sign-up";
import { useGlobalContext } from "@/hooks/use-global-state";

type FormInput = AuthSignUpRequest & {
  confirmPassword?: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useGlobalContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>();
  const password = watch("auth.password");

  const onSubmit = async (data: AuthSignUpRequest) => {
    const res = await authSignUp(data);

    if (res.success) {
      Cookies.set("authToken", res.authToken);
      router.push("/");
    }

    await showToast(res.success, res.messages);
    setIsLoggedIn(res.success);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-192px)]">
      <Image
        className="fixed top-0 left-0 w-full h-full"
        src="/login.png"
        alt="login"
        width={1000}
        height={1000}
      />

      <form
        className="bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] rounded-xl flex flex-col w-[600px] py-8 px-24 gap-14"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl py-1 border-b-2 border-void text-center">
          新規登録
        </h1>

        <div className="flex flex-col gap-5">
          <MantineTextInput
            label="ユーザー名"
            placeholder="ユーザー名"
            leftSection={<MailIcon className="w-5 h-5" />}
            error={errors.auth?.email?.message}
            {...register("auth.name", {
              required: "メールアドレスは必須です",
            })}
          />
          <MantineTextInput
            label="メールアドレス"
            placeholder="メールアドレス"
            leftSection={<MailIcon className="w-5 h-5" />}
            error={errors.auth?.email?.message}
            {...register("auth.email", {
              required: "メールアドレスは必須です",
            })}
          />
          <MantinePasswordInput
            label="パスワード"
            placeholder="パスワード"
            leftSection={<LockIcon className="w-5 h-5" />}
            error={errors.auth?.email?.message}
            {...register("auth.password", {
              required: "パスワードは必須です",
            })}
          />
          <MantinePasswordInput
            label="パスワード（確認）"
            placeholder="パスワード（確認）"
            leftSection={<LockIcon className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              validate: (value) =>
                value === password || "パスワードが一致しません",
            })}
          />
        </div>

        <div className="flex flex-col gap-5 w-full items-center">
          <button
            type="submit"
            className="bg-void text-white w-60 py-2 rounded-full disabled:opacity-50"
            disabled={isSubmitting}
          >
            新規登録
          </button>

          <Link href="/login">
            ログインは<span className="underline hover:opacity-50">こちら</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
