import axios from "axios";

export type CategoryIndexResponse = {
  success: boolean;
  categories: {
    id: number;
    name: string;
  }[];
};

export async function categoryIndex(): Promise<CategoryIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/category`;

  return await axios.get<CategoryIndexResponse>(apiUrl).then((res) => res.data);
}
