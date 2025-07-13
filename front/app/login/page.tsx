"use client";

import { authLogin, AuthLoginRequest } from "@/api/auth-login";
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

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthLoginRequest>();

  const onSubmit = async (data: AuthLoginRequest) => {
    const res = await authLogin(data);

    if (res.success) {
      Cookies.set("authToken", res.authToken);
      router.push("/");
    }

    await showToast(res.success, res.messages);
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
        className="bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] rounded-xl flex flex-col w-[600px] py-12 px-24 gap-14"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl py-1 border-b-2 border-void text-center">
          ログイン
        </h1>

        <div className="flex flex-col gap-5">
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
        </div>

        <div className="flex flex-col gap-8 w-full items-center">
          <button
            type="submit"
            className="bg-void text-white w-60 py-2 rounded-full disabled:opacity-50"
            disabled={isSubmitting}
          >
            ログイン
          </button>

          <Link href="/sign-up">
            新規登録は<span className="underline hover:opacity-50">こちら</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
