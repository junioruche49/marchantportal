import apiHandler from "./mockbase";
import axios from "axios";


export async function getBvn() {
  const { data } = await axios.get("https://run.mocky.io/v3/0eadad3a-27f4-4083-8eaf-c219f069c426");
  return data;
}
export async function validateOTP() {
  const { data } = await axios.get("https://run.mocky.io/v3/e00e0a2f-419a-404e-8ee7-d1377b578ab0");
  return data;
}
