import axios from "axios";
import Cookies from "js-cookie";

type LikeDestroyRequest = {
  furnitureId: number;
};

type LikeDestroyResponse = {
  success: boolean;
  messages: string[];
};

export async function likeDestroy({
  furnitureId,
}: LikeDestroyRequest): Promise<LikeDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/like/${furnitureId}`;
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
