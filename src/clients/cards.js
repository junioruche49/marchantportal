import apiHandler from "./base";

export async function sendCardPreAuth(token, values) {
    const { data } = await apiHandler(token).post(
      "/payment/initializepayment",
      values
    );
    return data;
}

export async function getCards(token, values) {
  const { data } = await apiHandler(token).get(
    `/payment/getcards?email=${values?.email}`,

  );
  return data;
}

export async function cardCheck(token, values) {
  const { data } = await apiHandler(token).get(
    `/payment/customercardcheck?email=${values?.email}`,

  );
  return data;
}

export async function setDefaultCard(token, values) {
  const { data } = await apiHandler(token).get(
    `/payment/makeCardDefault/${values?.id}`,

  );
  return data;
}

export async function removeCard(token, values) {
  const { data } = await apiHandler(token).get(
    `/payment/removecard/${values?.id}`,

  );
  return data;
}

export async function verifyPaymentReference(values) {
  const { data } = await apiHandler(values.token).post(
    "/payment/completepayment",
    {
      reference: values.reference
    }
  );
  return data;
}


export async function addCardToProfile(values) {
  const { data } = await apiHandler(values.token).post(
    "/payment/addcard",
    {
      email: values.email,
      transaction_ref: values.transaction_ref
    }
  );
  return data;
}

export async function getAddCardFee(token) {
  const { data } = await apiHandler(token).get(
    "/payment/getaddcardfee"
  );
  return data;
}