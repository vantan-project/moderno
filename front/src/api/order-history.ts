import axios from "axios";
import Cookies from "js-cookie";

export type OrderHistoryRequest = {
  currentPage: number;
};

export type OrderHistoryResponse = {
  success: boolean;
  orders: {
    id: number;
    furniture: {
      id: number;
      name: string;
      imageUrl: string;
      price: number;
    };
    count: number;
    isShipped: boolean;
    isCompleted: boolean;
    createdAt: string;
  }[];
  lastPage: number;
};

export function orderHistory({
  currentPage,
}: OrderHistoryRequest): Promise<OrderHistoryResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/history`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<OrderHistoryResponse>(apiUrl, {
      params: { currentPage },
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
        lastPage: 0,
      };
    });
}
