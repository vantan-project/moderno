"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { token } from "@/api/token";
import { SideHeader } from "./items/side-header";
import { UserControls } from "./items/user-controls";
import { GlobalContext } from "@/hooks/use-global-state";

type Props = {
  children: React.ReactNode;
};

export function FixedWrapper({ children }: Props) {
  const pathname = usePathname();
  const showUserControls = [
    !pathname.startsWith("/login"),
    !pathname.startsWith("/sign-up"),
  ].every((condition) => condition === true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="fixed top-0 left-0 z-20">
        <SideHeader />
      </div>

      {showUserControls && (
        <div className="fixed top-8 right-8 z-10">
          <UserControls />
        </div>
      )}

      <div className="pl-64 py-24">{children}</div>
    </GlobalContext.Provider>
  );
}
