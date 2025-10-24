import { AuthIndexResponse } from "@/api/auth-index";
import { CartCounts } from "@/type/cart-counts";
import { createContext, useContext } from "react";

type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  cartCounts: CartCounts;
  setCartCounts: (cartCounts: CartCounts) => void;
  cartIds: number[];
  likeIds: number[];
  setLikeIds: (likeIds: number[]) => void;
  user: AuthIndexResponse["auth"];
  setUser: (user: AuthIndexResponse["auth"]) => void;
  // TODO: isAdminの追加
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
