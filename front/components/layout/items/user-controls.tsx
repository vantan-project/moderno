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
  const iconClassName = "w-10 h-10 hover:opacity-30";

  return (
    <div className="flex items-center gap-5 bg-core text-void rounded-2xl py-2 px-5 border-3 border-void [&>*]:w-16">
      <ButtonWithLabel onClick={() => {}} label="お気に入り">
        <HeartIcon className={iconClassName} />
      </ButtonWithLabel>
      <ButtonWithLabel onClick={() => {}} label="カート">
        <CartIcon className={iconClassName} />
      </ButtonWithLabel>

      {isLoggedIn ? (
        <ButtonWithLabel onClick={() => {}} label="ユーザー設定">
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
