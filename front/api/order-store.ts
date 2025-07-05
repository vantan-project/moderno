import axios from "axios";

export type OrderStoreResquest = {
  orders: {
    furnitureId: number;
    count: number;
  }[];
};

export type OrderStoreResponse = {
  success: boolean;
  messages: string[];
};

export async function orderStore({ orders }: OrderStoreResquest) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order`;

  return await axios
    .post<OrderStoreResponse>(apiUrl, {
      orders,
    })
    .then((res) => res.data)
    .catch((err) => {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
      return {
        success: false,
        messages: err.response?.data.messages || ["エラーが発生しました"],
      };
    });
}
