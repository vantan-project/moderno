import axios from "axios";
import Cookies from "js-cookie";

export type UserSelectResponse = {
  success: boolean;
  users: {
    id: number;
    name: string;
  }[];
};
export async function userSelect(): Promise<UserSelectResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        users: [],
      };
    });
}
