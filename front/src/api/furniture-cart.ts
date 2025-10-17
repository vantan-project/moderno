import axios from "axios";

export type FurnitureCartRequest = {
  furnitureIds: number[];
};

export type FurnitureCartResponse = {
  success: boolean;
  furnitures: {
    [id: number]: {
      name: string;
      imageUrl: string;
      price: number;
      stock: number;
    };
  };
};

export function furnitureCart({
  furnitureIds,
}: FurnitureCartRequest): Promise<FurnitureCartResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/cart`;

  return axios
    .get(apiUrl, {
      params: {
        furnitureIds,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        furnitures: [],
      };
    });
}
