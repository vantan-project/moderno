import axios from "axios";
import Cookies from "js-cookie";

export type CategoryDestroyResponse = {
  success: boolean;
  messages: string[];
};

export function categoryDestroy(
  id: number
): Promise<CategoryDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`;
  const authToken = Cookies.get("authToken");

  return axios
    .delete<CategoryDestroyResponse>(apiUrl, {
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
