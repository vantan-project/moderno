import axios from "axios";
import Cookies from "js-cookie";

export type OrderStockoutResponse = {
  success: boolean;
  orders: {
    id: number;
    furniture: {
      id: number;
      name: string;
      imageUrl: string;
    };
    count: number;
    isShipped: boolean;
    isCompleted: boolean;
    createdAt: string;
  }[];
};

export function orderStockout(): Promise<OrderStockoutResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/stockout`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<OrderStockoutResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        orders: [],
      };
    });
}
