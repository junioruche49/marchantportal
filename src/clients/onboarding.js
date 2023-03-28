import apiHandler from "./base";

export async function getPersonalDetailsFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/personal"
  );
  return data;
}

export async function getBvnDetailsFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/bvn"
  );
  return data;
}

export async function getNextofKinFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/next_of_kin"
  );
  return data;
}

export async function getEducationalFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/education"
  );
  return data;
}

export async function getContactFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/contact"
  );
  return data;
}

export async function getEmploymentFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/employment"
  );
  return data;
}

export async function getAccountFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/account"
  );
  return data;
}

export async function getBankFields(token) {
  const { data } = await apiHandler(token).get("/payment/getbankcodes");
  return data;
}

export async function getProfileSection(token) {
  const { data } = await apiHandler(token).get("/customer/profile-sections");
  return data;
}

export async function getContactInformation(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/contact"
  );
  return data;
}

export async function getAccountStatementFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/statement_validation"
  );
  return data;
}

export async function getIdentificationFields(token) {
  const { data } = await apiHandler(token).get(
    "/customer/section-checklist/documents"
  );
  return data;
}

export async function patchRequest(token, values) {
  const { data } = await apiHandler(token).patch("/customer/profile", {
    ...values,
  });
  return data;
}

export async function resolveBvn(token, values) {
  const { data } = await apiHandler(token).post("/kycvalidation/resolvebvn", {
    ...values,
  });
  return data;
}

export async function completeResolveBVN(token, values) {
  const { data } = await apiHandler(token).post(
    "/kycvalidation/completeresolvebvn",
    {
      ...values,
    }
  );
  return data;
}

export async function uploadDocument(token, values) {
  const file = true;
  const { data } = await apiHandler(token).post(
    "/customer/uploaded-kyc-documents/create",
    values
  );
  return data;
}

export async function deleteDocument(token, id) {
  const { data } = await apiHandler(token).delete(
    "/customer/uploaded-kyc-documents/" + id
  );
  return data;
}

export async function validateAccounts(token, values) {
  const { data } = await apiHandler(token).post(
    "/kycvalidation/resolveaccountnumber",
    values
  );
  return data;
}

export async function sendAccounts(token, values) {
  const { data } = await apiHandler(token).patch(
    "/customer/bank-account/",
    values
  );
  return data;
}


export async function postAccountStatementCode(token, values) {
  const { data } = await apiHandler(token).post(
    "/kycvalidation/getstatement",
    values
  );
  return data;
}