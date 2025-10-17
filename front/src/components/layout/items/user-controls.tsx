import { token } from "@/api/token";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { LoginIcon } from "@/components/shared/icons/login-icon";
import { UserIcon } from "@/components/shared/icons/user-icon";
import { useGlobalContext } from "@/hooks/use-global-state";
import { useRouter } from "next/navigation";
import { Indicator } from "@mantine/core";

export function UserControls() {
  const { isLoggedIn } = useGlobalContext();
  const router = useRouter();
  const { cartCounts } = useGlobalContext();
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

  return (
    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.7)] backdrop-filter-[blur(8px)] text-void rounded-2xl py-2 px-5 [&>*]:w-16">
      <ButtonWithLabel onClick={handleLike} label="お気に入り">
        <HeartIcon className={iconClassName} />
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
        <ButtonWithLabel onClick={() => router.push("/login")} label="ログイン">
          <LoginIcon className={iconClassName} />
        </ButtonWithLabel>
      )}
    </div>
  );
}
