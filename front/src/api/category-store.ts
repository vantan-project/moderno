import axios from "axios";
import Cookies from "js-cookie";

export type CategoryStoreRequest = {
  category: {
    name: string;
  };
};

export type CategoryStoreResponse = {
  success: boolean;
  messages: string[];
};

export function categoryStore({
  category,
}: CategoryStoreRequest): Promise<CategoryStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/category`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<CategoryStoreResponse>(
      apiUrl,
      { category },
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
