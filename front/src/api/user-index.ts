import axios from "axios";
import Cookies from "js-cookie";

export type UserIndexRequest = {
  search: {
    keyword: string;
  };
};

export type UserIndexResponse = {
  success: boolean;
  users: {
    id: number;
    name: string;
    email: string;
    postalCode: string;
    prefecture: string;
    city: string;
    streetAddress: string;
  }[];
};
export async function userIndex(
  params: UserIndexRequest
): Promise<UserIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        search: params.search,
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
