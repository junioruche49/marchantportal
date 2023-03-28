import apiHndler from "./base";

export async function sendLoanApplication(token, values) {
  const { data } = await apiHandler(token).post("/loan/loan-requests", values);
  return data;
}

export async function getLoanApplications(token) {}

export async function getLoans(token) {
  const { data } = await apiHandler(token).get("/loan/loans");
  return data;
}

export async function getLoan(token, loanId) {
  const { data } = await apiHandler(token).get("/loan/loans/" + loanId);
  return data;
}

export async function getLoanSetup(token, loanId) {
  const { data } = await apiHandler(token).get("/loan/loan-setup");
  return data;
}
