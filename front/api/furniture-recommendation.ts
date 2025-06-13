import axios from "axios";

export type FurnitureRecommendationResponse = {
  success: boolean;
  furnitures: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  }[];
};

export async function FurnitureRecommendation(
  furnitureId: number
): Promise<FurnitureRecommendationResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/recommendation/${furnitureId}`;

  return await axios
    .get<FurnitureRecommendationResponse>(apiUrl)
    .then((res) => res.data);
}
