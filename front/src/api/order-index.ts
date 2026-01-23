import axios from "axios";
import Cookies from "js-cookie";

export type OrderIndexRequest = {
  search: {
    keyword: string;
    userId: number | null;
  };
};

export type OrderIndexResponse = {
  success: boolean;
  orders: {
    id: number;
    furniture: {
      id: number;
      name: string;
      imageUrl: string;
      price: number;
    };
    user: {
      name: string;
      postalCode: string;
      prefecture: string;
      city: string;
      streetAddress: string;
    };
    count: number;
    isShipped: boolean;
    isCompleted: boolean;
    createdAt: string;
  }[];
  lastPage: number;
};

export function orderIndex(
  req: OrderIndexRequest
): Promise<OrderIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: req,
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
