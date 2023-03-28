import apiHandler from "./base";

export async function getPersonalDetails(token) {
  const { data } = await apiHandler(token).get("/customer/profile");
  return data;
}
