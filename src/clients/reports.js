import apiHandler from "./base";

export async function getTotalLoanAmount(token) {
  const { data } = await apiHandler(token).get("/loan/reports/total-loan-amount");
  return data;
}

export async function getTotalOutstandingBalance(token) {
  const { data } = await apiHandler(token).get("/loan/reports/outstanding-loan-balance");
  return data;
}

export async function getNextLoanDueDate(token) {
  const { data } = await apiHandler(token).get("/loan/reports/next-loan-due-date");
  return data;
}

export async function getRecentLoanAmountTable(token, formattedToday, formattedLastSixMonthsDate) {
  const { data } = await apiHandler(token).get("/loan/reports/recent-loan-amounts-by-date/"+formattedLastSixMonthsDate+"/"+formattedToday);
  return data;
}

export async function getRecentRepaymentsTable(token, formattedToday, formattedLastSixMonthsDate) {
  const { data } = await apiHandler(token).get("/loan/reports/repayment-trend-by-date/"+formattedLastSixMonthsDate+"/"+formattedToday);
  return data;
}
