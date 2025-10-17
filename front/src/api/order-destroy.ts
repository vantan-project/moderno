import axios from "axios";
import Cookies from "js-cookie";

export type OrderDestroyResponse = {
  success: boolean;
  messages: string[];
};

export async function orderDestroy(
  orderId: number
): Promise<OrderDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`;
  const authToken = Cookies.get("authToken");

  return axios
    .delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
