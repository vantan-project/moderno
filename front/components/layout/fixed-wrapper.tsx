"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { token } from "@/api/token";
import { SideHeader } from "./items/side-header";
import { UserControls } from "./items/user-controls";

type Props = {
  children: React.ReactNode;
};

export function FixedWrapper({ children }: Props) {
  const pathname = usePathname();
  const conditions: boolean[] = [
    !pathname.startsWith("/admin"),
    !pathname.startsWith("/login"),
    !pathname.startsWith("/sign-up"),
  ];
  const allTrue = conditions.every((condition) => condition === true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const res = await token();
      setIsLoggedIn(res.success);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoggedIn === null) return;

  return (
    <>
      {allTrue && (
        <>
          <div className="fixed top-0 left-0 z-20">
            <SideHeader />
          </div>
          <div className="fixed top-8 right-8 z-10">
            <UserControls isLoggedIn={isLoggedIn} />
          </div>
        </>
      )}
      <div className={allTrue ? "pl-64 py-24" : ""}>{children}</div>
    </>
  );
}
