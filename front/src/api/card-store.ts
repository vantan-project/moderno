import axios from "axios";
import Cookies from "js-cookie";

export type CardStoreRequest = {
  card: {
    number: string;
    expYear: string;
    expMonth: string;
    holderFirstName: string;
    holderLastName: string;
  };
};

export type CardStoreResponse = {
  success: boolean;
  messages: string[];
};

export function cardStore({
  card,
}: CardStoreRequest): Promise<CardStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/card`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<CardStoreResponse>(
      apiUrl,
      { card },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
