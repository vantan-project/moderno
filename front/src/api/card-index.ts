import axios from "axios";
import Cookies from "js-cookie";

export type CardIndexResponse = {
  success: boolean;
  cards: {
    [id: number]: {
      id: number;
      last4: string;
      expMonth: number;
      expYear: number;
      holderFirstName: string;
      holderLastName: string;
    };
  };
};

export async function cardIndex() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/card`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<CardIndexResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch(() => ({ success: false, cards: {} }));
}
