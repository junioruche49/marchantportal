import apiHandler from "./base";

export async function getProducts(token) {
  const { data } = await apiHandler(token).get("/common/products");
  return data;
}
