import axios from "axios";
import Cookies from "js-cookie";

export type FurnitureStoreRequest = {
  furniture: {
    name: string;
    imageFile: FileList | null;
    detail: string;
    price: number;
    categoryId: number | null;
    stock: number;
  };
};

export type FurnitureStoreResponse = {
  success: boolean;
  messages: string[];
};

export async function furnitureStore({
  furniture,
}: FurnitureStoreRequest): Promise<FurnitureStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<FurnitureStoreResponse>(
      apiUrl,
      {
        furniture: {
          ...furniture,
          imageFile: furniture.imageFile ? furniture.imageFile[0] : null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
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
