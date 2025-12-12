import axios from "axios";
import Cookies from "js-cookie";

export type FurnitureUpdateRequest = {
  furniture: {
    name: string;
    imageFile: File | null;
    detail: string;
    price: number;
    categoryId: number | null;
    stock: number;
  };
};

export type FurnitureUpdateResponse = {
  success: boolean;
  messages: string[];
};

export async function furnitureUpdate(
  id: number,
  { furniture }: FurnitureUpdateRequest
): Promise<FurnitureUpdateResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/furniture/${id}`;
  const authToken = Cookies.get("authToken");

  const formData = new FormData();

  formData.append("furniture[name]", furniture.name);
  formData.append("furniture[detail]", furniture.detail);
  formData.append("furniture[price]", String(furniture.price));
  formData.append("furniture[category_id]", String(furniture.categoryId ?? ""));
  formData.append("furniture[stock]", String(furniture.stock));

  if (furniture.imageFile) {
    formData.append("furniture[imageFile]", furniture.imageFile);
  }

  return axios
    .post<FurnitureUpdateResponse>(
      apiUrl,
      formData,

      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
