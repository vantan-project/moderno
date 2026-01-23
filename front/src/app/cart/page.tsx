"use client";

import { furnitureCart, FurnitureCartResponse } from "@/api/furniture-cart";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/use-global-state";
import Image from "next/image";
import { OrderCounter } from "@/components/shared/order-counter";
import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import { HeartIcon } from "@/components/shared/icons/heart-icon";
import { token } from "@/api/token";
import { useRouter } from "next/navigation";
import { likeStore } from "@/api/like-store";
import { showToast } from "@/utils/show-toast";
import { likeDestroy } from "@/api/like-destroy";
import clsx from "clsx";
import { ButtonWithLabel } from "@/components/shared/button-with-label";
import { CartIcon } from "@/components/shared/icons/cart-icon";
import { DeleteIcon } from "@/components/shared/icons/delete";
import { Modal, Select, SelectProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BagIcon } from "@/components/shared/icons/bag-icon";
import { cardIndex, CardIndexResponse } from "@/api/card-index";
import { orderStore, OrderStoreRequest } from "@/api/order-store";

export default function Page() {
  const router = useRouter();
  const [furnitures, setFurnitures] = useState<
    FurnitureCartResponse["furnitures"]
  >({});
  const [cards, setCards] = useState<CardIndexResponse["cards"]>({});
  const { cartCounts, setCartCounts, cartIds, likeIds, setLikeIds, user } =
    useGlobalContext();
  const [opened, { open, close }] = useDisclosure(false);
  const carts = Object.entries(cartCounts)
    .filter(
      ([furnitureId, count]) => furnitures[Number(furnitureId)] && count > 0,
    )
    .map(([furnitureId, count]) => {
      const id = Number(furnitureId);
      return {
        id,
        count,
        ...furnitures[id],
      };
    });
  const totalCount = Object.values(cartCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const totalPrice = carts.reduce(
    (sum, cart) => sum + cart.price * cart.count,
    0,
  );
  const [cardId, setCardId] = useState<string | null>(null);

  const cartApi = () => {
    furnitureCart({ furnitureIds: cartIds }).then((res) => {
      setFurnitures(res.furnitures);
    });
  };

  useEffect(() => {
    cartApi();
  }, [cartIds]);

  const likeStoreApi = async (furnitureId: number) => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    const res = await likeStore({ furnitureId });
    showToast(res.success, res.messages);

    if (res.success) {
      setLikeIds([...likeIds, furnitureId]);
    }
  };

  const likeDestroyApi = async (furnitureId: number) => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    const res = await likeDestroy({ furnitureId });
    showToast(res.success, res.messages);

    if (res.success) {
      setLikeIds(likeIds.filter((id) => id !== furnitureId));
    }
  };

  const orderStoreApi = async () => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
    }

    if (!cardId) {
      showToast(false, ["カードが選択されていません"]);
    } else {
      const orders: OrderStoreRequest["orders"] = carts.map((cart) => ({
        furnitureId: cart.id,
        count: cart.count,
      }));
      const res = await orderStore({ orders });
      showToast(res.success, res.messages);

      if (res.success) {
        setCartCounts({});
        router.push("/");
      }
    }
  };

  const indexApi = async () => {
    const indexResponse = await cardIndex();
    setCards(indexResponse.cards);
  };
  const cardSelectData = Object.values(cards).map((card) => ({
    value: String(card.id),
    label: `**********${card.last4}`,
  }));

  useEffect(() => {
    indexApi();
  }, []);

  const renderSelectOption: SelectProps["renderOption"] = ({ option }) => {
    const card = cards[Number(option.value)];
    if (!card) return null;

    return (
      <div className="p-2 overflow-hidden h-[100px] flex flex-col justify-between w-full">
        <p className="w-full border-b border-void">**********{card.last4}</p>

        <div>
          <div className="w-full flex justify-between">
            <p className="text-xs">カード名義</p>
            <p>
              {card.holderFirstName} {card.holderLastName}
            </p>
          </div>
          <div className="w-full flex justify-between">
            <p className="text-xs">有効期限</p>
            <p>
              {card.expMonth}/{card.expYear}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="px-12">
        <div className="border-b border-void py-2 flex justify-between items-center">
          <div className="flex gap-2 items-end text-lg">
            <CartIcon className="w-8 h-8" />
            カート
          </div>

          <div className="flex gap-8 items-center">
            <div className="flex gap-4 h-fit">
              <div className="flex justify-between min-w-42 pr-4 border-r-2 border-void">
                <p>注文件数：</p>
                <p>{totalCount}件</p>
              </div>
              <div className="flex justify-between min-w-42">
                <p>合計(税込)：</p>
                <p>
                  {totalPrice.toLocaleString("ja-JP", {
                    style: "currency",
                    currency: "JPY",
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={clsx(
                  "w-42 relative",
                  totalCount === 0 && "opacity-50",
                )}
              >
                <ButtonWithIcon
                  color="var(--color-error)"
                  backgroundColor="white"
                  borderColor="var(--color-error)"
                  icon={<DeleteIcon />}
                  onClick={() => setCartCounts({})}
                >
                  一括削除
                </ButtonWithIcon>
                {totalCount === 0 && (
                  <div className="absolute top-0 left-0 w-full h-full hover:cursor-not-allowed z-10" />
                )}
              </div>

              <div
                className={clsx(
                  "w-42 relative",
                  totalCount === 0 && "opacity-50",
                )}
              >
                <ButtonWithIcon
                  icon={<CartIcon />}
                  onClick={() => {
                    if (!user?.name) {
                      router.push("/login");
                      return;
                    }
                    const {
                      postalCode,
                      prefecture,
                      city,
                      streetAddress,
                      cards,
                    } = user;

                    const missingFields: string[] = [];

                    if (!postalCode || !prefecture || !city || !streetAddress) {
                      missingFields.push("住所");
                    }

                    if (!cards?.length) {
                      missingFields.push("カード情報");
                    }

                    if (missingFields.length > 0) {
                      const message = `${missingFields.join(
                        "と",
                      )}が入力されていません`;
                      showToast(false, [message]);
                      router.push("/setting");
                    } else {
                      open();
                    }
                  }}
                >
                  購入に進む
                </ButtonWithIcon>
                {totalCount === 0 && (
                  <div className="absolute top-0 left-0 w-full h-full hover:cursor-not-allowed z-10" />
                )}
              </div>
            </div>
          </div>
        </div>
        {carts.map((cart) => (
          <div
            className="h-[200px] flex border-b border-void py-4"
            key={cart.id}
          >
            <div className="w-full flex justify-between">
              <div className="flex gap-8">
                <div
                  className="relative group h-full aspect-square rounded-sm overflow-hidden"
                  onClick={() => router.push(`/furniture/${cart.id}`)}
                >
                  <Image
                    className="w-full h-full"
                    width={200}
                    height={200}
                    src={cart.imageUrl}
                    alt={cart.name}
                  />
                  <div className="hidden group-hover:block absolute top-0 left-0 w-full h-full bg-black/20" />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col gap-4 w-[200px]">
                    <p>{cart.name}</p>
                    <h3 className="text-2xl pb-8">
                      {cart.price.toLocaleString("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      })}
                      <span className="text-xs">（税込）</span>
                    </h3>
                  </div>
                  <div className="h-10 w-full">
                    <OrderCounter furnitureId={cart.id} stock={cart.stock} />
                  </div>
                </div>
              </div>
            </div>
            <ButtonWithLabel
              onClick={() => {
                if (likeIds.includes(cart.id)) {
                  likeDestroyApi(cart.id);
                } else {
                  likeStoreApi(cart.id);
                }
              }}
              label="お気に入り"
            >
              <HeartIcon
                className={clsx(
                  likeIds.includes(cart.id) && "text-error",
                  "w-8 h-8 hover:opacity-30",
                )}
              />
            </ButtonWithLabel>
          </div>
        ))}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        size="lg"
      >
        <div className="px-24">
          <h2 className="text-center text-2xl border-b-2 border-void py-2">
            注文内容のご確認
          </h2>
          <div className="h-[200px] overflow-auto my-4 flex flex-col gap-2">
            {carts.map((cart) => (
              <div
                key={cart.id}
                className="flex justify-between items-center text-sm"
              >
                <p className="truncate max-w-[150px]">・{cart.name}</p>
                <p>×{cart.count}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center">
            <Select
              label="お支払いカード"
              placeholder="カードを選択してください"
              data={cardSelectData}
              renderOption={renderSelectOption}
              classNames={{
                root: "w-full",
                input: "!h-12 !whitespace-pre-line",
              }}
              value={cardId}
              onChange={(e) => setCardId(e)}
            />

            <div className="w-full flex justify-between border-b text-lg px-1 mt-4">
              <h3>ご購入金額</h3>
              <p>
                {totalPrice.toLocaleString("ja-JP", {
                  style: "currency",
                  currency: "JPY",
                })}
              </p>
            </div>

            <ButtonWithIcon icon={<BagIcon />} onClick={orderStoreApi}>
              注文を確定する
            </ButtonWithIcon>
            <button className="w-fit border-b border-void" onClick={close}>
              キャンセル
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
