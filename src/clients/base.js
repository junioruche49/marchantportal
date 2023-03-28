import axios from "axios";
import keycloak from "../auth/keycloak";

export default function apiHandler(token = null) {
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_APP_BASE_URL,
    ...(token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      : {}),
  });

  axiosInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status == 401) {
        keycloak.logout();
        return;
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
