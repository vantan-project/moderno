import axios from "axios";
import Cookies from "js-cookie";

export type OrderStoreRequest = {
  orders: {
    furnitureId: number;
    count: number;
  }[];
};

export type OrderStoreResponse = {
  success: boolean;
  messages: string[];
};

export async function orderStore({
  orders,
}: OrderStoreRequest): Promise<OrderStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(
      apiUrl,
      { orders },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
