import axios from "axios";
import Cookies from "js-cookie";

export type AuthUpdateRequest = {
  auth: {
    name?: string;
    email?: string;
    password?: string;
    postal_code?: string;
    prefecture?: string;
    city?: string;
    streetAddress?: string;
  };
};

export type AuthUpdateResponse = {
  success: boolean;
  messages: string[];
};

export function authUpdate({
  auth,
}: AuthUpdateRequest): Promise<AuthUpdateResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
  const authToken = Cookies.get("authToken");

  return axios
    .patch<AuthUpdateResponse>(
      apiUrl,
      { auth },
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
