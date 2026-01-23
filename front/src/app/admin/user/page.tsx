"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  userIndex,
  UserIndexResponse,
  UserIndexRequest,
} from "@/api/user-index";
import { token } from "@/api/token";
import { UserRoundIcon } from "@/components/shared/icons/user-round-icon";
import { MailIcon } from "@/components/shared/icons/mail-icon";
import { MapPinHouseIcon } from "@/components/shared/icons/map-pin-house-icon";
import { SearchIcon } from "@/components/shared/icons/search-icon";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<UserIndexResponse["users"]>([]);

  const [search, setSearch] = useState<UserIndexRequest["search"]>({
    keyword: "",
  });

  const userApi = async () => {
    const authToken = await token();
    if (!authToken.success) {
      router.push("/login");
      return;
    }
    try {
      const userRes = await userIndex({ search });
      if (userRes.success) {
        setUser(userRes.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    userApi();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const indexApi = async () => {
        const res = await userIndex({ search });
        if (res.success) {
          setUser(res.users);
        }
      };

      indexApi();
    }, 500);

    return () => clearTimeout(timer);
  }, [search.keyword]);

  return (
    <section className="m-10">
      <div className="h-full [&>*]:border-b [&>*]:border-void text-void">
        <div className="grid items-center grid-cols-[2fr_3fr_5fr_2fr] gap-10  [&>*]:py-2 [&>*]:px-2">
          <div className="flex items-center justify-start gap-2">
            <UserRoundIcon />
            <p>ユーザー名</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <MailIcon />
            <p>メールアドレス</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <MapPinHouseIcon />
            <p>お届け先</p>
          </div>
          <div className="relative w-72">
            <input
              type="text"
              placeholder="検索する"
              className="rounded px-2 py-2 text-sm bg-gray-100 w-70 placeholder-void"
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value })
              }
            ></input>
            <SearchIcon className="absolute right-2  top-4 bg-gray-100" />
          </div>
        </div>
        {user.map((user) => (
          <div key={user.id} className="[&>*]:py-4 [&>*]:px-2">
            <div className="grid items-center grid-cols-[2fr_3fr_6fr_2fr] gap-10">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>
                {user.postalCode &&
                user.prefecture &&
                user.city &&
                user.streetAddress ? (
                  <>
                    〒{user.postalCode} / {user.prefecture} / {user.city} /{" "}
                    {(() => {
                      const match = user.streetAddress.match(/^(.+?)(\d.*)$/);
                      if (match) {
                        return (
                          <>
                            <span>{match[1]}</span> {} / <span>{match[2]}</span>
                          </>
                        );
                      }
                      return user.streetAddress;
                    })()}
                  </>
                ) : (
                  "未設定"
                )}
              </p>
              <button
                className="bg-white border border-void rounded-lg py-2 w-50 cursor-pointer"
                onClick={() => {
                  router.push(`/admin/order?userId=${user.id}`);
                }}
              >
                ユーザー注文状況へ
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
