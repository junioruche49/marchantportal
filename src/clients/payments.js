import apiHandler from "./base";

export async function sendOtpRequest(token) {
  const { data } = await apiHandler(token).post("/payment/startrepayment");
  return data;
}

export async function payWithExistingCard(token, values) {
  const { data } = await apiHandler(token).post(
    "/payment/completerepayment",
    values
  );
  return data;
}

export async function initializePayment(token, values) {
  const { data } = await apiHandler(token).post(
    "/payment/initializepayment",
    values
  );
  return data;
}

export async function validatePayment(token, values) {
  const { data } = await apiHandler(token).post(
    "/payment/completeinitiatedpayment",
    values
  );
  return data;
}

export async function requestVirtualAccount(token, values) {
  const { data } = await apiHandler(token).post(
    "/payment/providus/initiatetransaction",
    values
  );
  return data;
}

export async function processVirtualAccountPayment(token, values) {
  const { data } = await apiHandler(token).post(
    `/payment/providus/gettransactionstatus/${values?.reference}`
  );
  return data;
}
