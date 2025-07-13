import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { LoginIcon } from "@/components/shared/icons/login-icon";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { useRouter } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
};

export function UserControls({ isLoggedIn }: Props) {
  const router = useRouter();
  const iconClassName = "w-8 h-8 hover:opacity-30";

  return (
    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] text-void rounded-2xl py-2 px-5 [&>*]:w-16">
      <ButtonWithLabel onClick={() => router.push("/like")} label="お気に入り">
        <HeartIcon className={iconClassName} />
      </ButtonWithLabel>
      <ButtonWithLabel onClick={() => {}} label="カート">
        <CartIcon className={iconClassName} />
      </ButtonWithLabel>

      {isLoggedIn ? (
        <ButtonWithLabel
          onClick={() => router.push("/setting")}
          label="ユーザー設定"
        >
          <UserIcon className={iconClassName} />
        </ButtonWithLabel>
      ) : (
        <ButtonWithLabel onClick={() => router.push("/login")} label="ログイン">
          <LoginIcon className={iconClassName} />
        </ButtonWithLabel>
      )}
    </div>
  );
}
