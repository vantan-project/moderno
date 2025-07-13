import axios from "axios";
import Cookies from "js-cookie";

export type FurnitureLikeRequest = {
  search: {
    currentPage: number;
    keyword: string;
  };
};

export type FurnitureLikeResponse = {
  success: boolean;
  furnitures: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  }[];
  lastPage: number;
};

export async function furnitureLike({
  search,
}: FurnitureLikeRequest): Promise<FurnitureLikeResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/like`;
  const authToken = Cookies.get("authToken");

  return await axios
    .get<FurnitureLikeResponse>(apiUrl, {
      params: { search },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data);
}
