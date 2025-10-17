import { token } from "@/api/token";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { HistoryIcon } from "@/components/shared/icons/history-icon";
import { LoginIcon } from "@/components/shared/icons/login-icon";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { useGlobalContext } from "@/hooks/use-global-state";
import { useRouter } from "next/navigation";

export function UserControls() {
  const { isLoggedIn } = useGlobalContext();
  const router = useRouter();
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

  return (
    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] text-void rounded-2xl py-2 px-5 [&>*]:w-16">
      <ButtonWithLabel onClick={handleHistory} label="購入履歴">
        <HistoryIcon className={iconClassName} />
      </ButtonWithLabel>
      <ButtonWithLabel onClick={handleLike} label="お気に入り">
        <HeartIcon className={iconClassName} />
      </ButtonWithLabel>
      <ButtonWithLabel onClick={handleCart} label="カート">
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
