import axios from "axios";
import Cookies from "js-cookie";

type LikeStoreRequest = {
  furnitureId: number;
};

type LikeStoreResponse = {
  success: boolean;
  messages: string[];
};

export async function likeStore({
  furnitureId,
}: LikeStoreRequest): Promise<LikeStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/like`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(
      apiUrl,
      {
        furnitureId,
      },
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
