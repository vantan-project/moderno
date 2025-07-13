import axios from "axios";
import Cookies from "js-cookie";

export type AuthLogoutResponse = {
  success: boolean;
  messages: string[];
};

export async function authLogout(): Promise<AuthLogoutResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(
      apiUrl,
      {},
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
