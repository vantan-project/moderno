import axios from "axios";

export type FurnitureWeeklyRankingResponse = {
  success: boolean;
  furnitures: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
};

export async function furnitureWeeklyRanking(): Promise<FurnitureWeeklyRankingResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/weekly-ranking`;

  return await axios
    .get<FurnitureWeeklyRankingResponse>(apiUrl)
    .then((res) => res.data);
}
