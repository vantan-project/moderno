import axios from "axios";
import Cookies from "js-cookie";

export type OrderUnshipResponse = {
  success: boolean;
  messages: string[];
};

export async function orderUnship(
  orderId: number
): Promise<OrderUnshipResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/unship`;
  const authToken = Cookies.get("authToken");

  return axios
    .patch(
      apiUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
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
