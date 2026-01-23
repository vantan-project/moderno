import axios from "axios";
import Cookies from "js-cookie";

export type FurnitureDestroyResponse = {
  success: boolean;
  messages: string[];
};

export async function furnitureDestroy(
  id: number
): Promise<FurnitureDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/${id}`;
  const authToken = Cookies.get("authToken");

  return axios
    .delete<FurnitureDestroyResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        messages: err.response?.data?.messages || [],
      };
    });
}
