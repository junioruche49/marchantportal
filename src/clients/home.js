import apiHandler from "./base";

export async function getUser(token) {
  const { data } = await apiHandler(token).get("/user");
  return data;
}
