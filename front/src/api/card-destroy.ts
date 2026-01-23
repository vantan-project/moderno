import axios from "axios";
import Cookies from "js-cookie";

export type CardDestroyResponse = {
  success: boolean;
  messages: string[];
};

export async function cardDestroy(id: number): Promise<CardDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/card/${id}`;
  const authToken = Cookies.get("authToken");

  return axios
    .delete<CardDestroyResponse>(apiUrl, {
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
