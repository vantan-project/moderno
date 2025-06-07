"use client";

import { TextWithLabel } from "@/components/features/text-with-label";
import { FirstView } from "../components/features/first-view";
import { useEffect, useState } from "react";
import {
  FurnitureWeeklyRanking,
  FurnitureWeeklyRankingResponse,
} from "@/api/furniture-weekly-ranking";
import Image from "next/image";
import Link from "next/link";
import {
  FurnitureNewArrival,
  FurnitureNewArrivalResponse,
} from "@/api/furniture-new-arrival";

export default function Page() {
  const [weeklyRankings, setWeeklyRankings] = useState<
    FurnitureWeeklyRankingResponse["furnitures"]
  >([]);
  const [newArrivals, setNewArrivals] = useState<
    FurnitureNewArrivalResponse["furnitures"]
  >([]);

  useEffect(() => {
    const weeklyRankingApi = async () => {
      const res = await FurnitureWeeklyRanking();
      setWeeklyRankings(res.furnitures);
    };
    const newArrivalApi = async () => {
      const res = await FurnitureNewArrival();
      setNewArrivals(res.furnitures);
    };

    weeklyRankingApi();
    newArrivalApi();
  }, []);

  const sectionTitleClassName = "border-b pl-2 pb-2 mx-4";
  const scrollableClassName =
    "flex gap-10 overflow-x-auto w-full py-4 [scrollbar-color:var(--color-void)_transparent]";
  return (
    <div className="px-12 flex flex-col gap-20">
      <FirstView />

      {weeklyRankings.length > 0 && (
        <section>
          <div className={sectionTitleClassName}>
            <TextWithLabel text="WEEKLY RANKING" label="週間ランキング" />
          </div>

          <div className={scrollableClassName}>
            {weeklyRankings.map((furniture, index) => (
              <Link
                href={`/furniture/${furniture.id}`}
                className="rounded-2xl flex-shrink-0 overflow-hidden"
                key={furniture.id}
              >
                <div className="relative">
                  <RankingLabel ranking={index + 1} />
                  <Image
                    className="w-52 h-52 hover:brightness-75 transition-all ease-out duration-700"
                    src={furniture.imageUrl}
                    alt={furniture.name}
                    width={200}
                    height={200}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section>
          <div className={sectionTitleClassName}>
            <TextWithLabel text="NEW ARRIVALS" label="新着商品" />
          </div>
        </section>
      )}
    </div>
  );
}

const RankingLabel = ({ ranking }: { ranking: number }): React.ReactNode => {
  const defaultColor = {
    bgColor: "#F1F1F1F1",
    textColor: "var(--color-void)",
  };
  const colors: { [key: number]: { bgColor: string; textColor: string } } = {
    1: { bgColor: "#D9BA72", textColor: "var(--color-core)" },
    2: { bgColor: "#ABABAB", textColor: "var(--color-core)" },
    3: { bgColor: "#947A61", textColor: "var(--color-core)" },
  };

  return (
    <div
      className="absolute top-0 left-0 pt-1 pl-2 z-10 w-16 h-16 font-bold text-2xl [clip-path:polygon(0_0,100%_0,0_100%)]"
      style={{
        backgroundColor: colors[ranking]
          ? colors[ranking].bgColor
          : defaultColor.bgColor,
      }}
    >
      <p
        style={{
          color: colors[ranking]
            ? colors[ranking].textColor
            : defaultColor.textColor,
        }}
      >
        {ranking}
      </p>
    </div>
  );
};
