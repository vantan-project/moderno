import axios from "axios";
import Cookies from "js-cookie";

export type AuthIndexResponse = {
  success: true;
  auth: {
    name: string;
    email: string;
    postalCode: string;
    prefecture: string;
    city: string;
    streetAddress: string;
    cards: {
      id: number;
      last4: string;
      expMonth: number;
      expYear: number;
      holderFirstName: string;
      holderLastName: string;
    }[];
  };
};

export function authIndex(): Promise<AuthIndexResponse | { success: false }> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<AuthIndexResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch(() => {
      return {
        success: false,
      };
    });
}
