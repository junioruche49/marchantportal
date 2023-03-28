import axios from "axios";

export default function apiHandler(token = null) {
  return axios.create({
    baseURL: process.env.REACT_APP_APP_MOCK_URL,
    ...(token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {}),
  });
}
