import axios from "axios";
import Cookies from "js-cookie";

export type LikeIndexResponse = {
  success: boolean;
  likeIds: number[];
};

export async function likeIndex(): Promise<LikeIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/like`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        likeIds: [],
      };
    });
}
