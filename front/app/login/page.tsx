"use client";

import { authLogin, AuthLoginRequest } from "@/api/auth-login";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { showToast } from "@/utils/show-toast";

export default function Page() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<AuthLoginRequest>();

  const onSubmit = async (data: AuthLoginRequest) => {
    const loginResponse = await authLogin(data);

    if (loginResponse.success) {
      Cookies.set("authToken", loginResponse.authToken, { expires: 7 });
      router.push("/admin");
    }

    await showToast(loginResponse.success, loginResponse.messages);
  };

  return (
    <form
      className="flex flex-col w-[1000px] my-0 mx-auto p-8 [&_input]:border [&_input]:p-2 [&_input]:mb-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Email:</label>
      <input {...register("auth.email")} type="email" />

      <label>Password:</label>
      <input {...register("auth.password")} type="password" />

      <button className="bg-gray p-2" type="submit">
        Login
      </button>
    </form>
  );
}
