import axios from "axios";

export type FurnitureNewArrivalResponse = {
  success: boolean;
  furnitures: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
};

export async function furnitureNewArrival() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/new-arrival`;

  return await axios
    .get<FurnitureNewArrivalResponse>(apiUrl)
    .then((res) => res.data);
}
