import axios from "axios";

export type AuthSignUpRequest = {
  auth: {
    name: string;
    email: string;
    password: string;
  };
};

export type AuthSignUpResponse = {
  success: boolean;
  messages: string[];
  authToken: string;
};

export async function authSignUp({
  auth,
}: AuthSignUpRequest): Promise<AuthSignUpResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`;

  return axios
    .post<AuthSignUpResponse>(apiUrl, {
      auth,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        messages: err.response?.data.messages || [],
        authToken: "",
      };
    });
}
