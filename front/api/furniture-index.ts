import axios from "axios";

export type FurnitureIndexRequest = {
  search: {
    categoryId: number;
    currentPage: number;
    keyword: string;
  };
};

export type FurnitureIndexResponse = {
  success: boolean;
  furnitures: {
    id: number;
    name: string;
    imageUrl: string;
    detail: string;
    price: number;
    categoryId: number;
    stock: number;
  }[];
  lastPage: number;
};

export async function FurnitureIndex({
  search,
}: FurnitureIndexRequest): Promise<FurnitureIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture`;

  return await axios
    .get<FurnitureIndexResponse>(apiUrl, {
      params: {
        search,
      },
    })
    .then((res) => res.data);
}
