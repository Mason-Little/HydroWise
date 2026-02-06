import ky from "ky";

const API_URL = import.meta.env.VITE_SERVER_BASE_URL;

// TODO: Get this from the auth context
const USER_ID = "1";

if (!API_URL) {
  throw new Error("VITE_SERVER_BASE_URL is not defined");
}

type APIResponse<T> = {
  data: T;
};

const getHeaders = () => {
  return {
    userId: USER_ID,
  };
};

export const client = ky.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const headers = getHeaders();
        request.headers.set("userId", headers.userId);
      },
    ],
  },
});

export type { APIResponse };
