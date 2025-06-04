import axios from "axios";

export type FurnitureShowRequest = {
  furnitureId: number;
};

export type FurnitureShowResponse = {
  furniture: {
    id: number;
    name: string;
    imageUrl: string;
    detail: string;
    price: number;
    categoryId: number;
    stock: number;
  };
};

export function FurnitureShow({
  furnitureId,
}: FurnitureShowRequest): Promise<FurnitureShowResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/${furnitureId}`;

  return axios
    .get<FurnitureShowResponse>(apiUrl)
    .then((response) => response.data);
}
