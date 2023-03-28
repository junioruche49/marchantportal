import React, { useMemo } from "react";
import { useQuery } from "react-query";
import useAuthStore from "../stores/authStore";
import {
  getTotalLoanAmount,
  getTotalOutstandingBalance,
  getNextLoanDueDate,
  getRecentLoanAmountTable,
  getRecentRepaymentsTable,
} from "../clients/reports";
import DoughnutChart from "../components/Dashboard/DoughnutChart";
import { withRouter } from "react-router-dom";
import RepaymentsGraph from "../components/Dashboard/RepaymentsGraph";

const getMonth = (dateString) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames[new Date(dateString).getMonth()];
};

const today = new Date();
const d = new Date();

d.setMonth(d.getMonth() - 6);

let formattedToday = today.toISOString().slice(0, 10);
let formattedLastSixMonthsDate = d.toISOString().slice(0, 10);

function Home(props: any) {
  const token = useAuthStore((state) => state.accessToken);
  const user: any = useAuthStore((state) => state.currentUser);

  const {
    isLoading: isTotalLoanAmountLoading,
    error: totalLoanAmountError,
    data: totalLoanAmountData,
  } = useQuery("totalLoanAMount", () => getTotalLoanAmount(token), {
    retry: 1,
  });

  const {
    isLoading: isTotalOutstandingBalanceLoading,
    error: totalOutstandingBalanceError,
    data: totalOutstandingBalanceData,
  } = useQuery(
    "totalOutstandingBalance",
    () => getTotalOutstandingBalance(token),
    {
      retry: 1,
    }
  );

  const {
    isLoading: isNextLoanDueDateLoading,
    error: nextLoanDueDateError,
    data: nextLoanDueDateBalanceData,
  } = useQuery("nextLoanDueDate", () => getNextLoanDueDate(token), {
    retry: 1,
  });

  const {
    isLoading: isRecentLoanAmountTableLoading,
    error: recentLoanAmountTableError,
    data: recentLoanAmountTableData,
  } = useQuery(
    "recentLoanAmountTable",
    () =>
      getRecentLoanAmountTable(
        token,
        formattedToday,
        formattedLastSixMonthsDate
      ),
    {
      retry: 1,
    }
  );

  const {
    isLoading: isRecentRepaymentsTableLoading,
    error: recentRepaymentsTableError,
    data: recentRepaymentsTableData,
  } = useQuery(
    "recentRepaymentsTable",
    () =>
      getRecentRepaymentsTable(
        token,
        formattedToday,
        formattedLastSixMonthsDate
      ),
    {
      retry: 1,
    }
  );

  const doughnutChartData = useMemo(() => {
    if (!recentLoanAmountTableData) {
      return { labels: [], values: [] };
    }
    let labels = Object.keys(recentLoanAmountTableData?.data).map((label) => {
      return new Date(label).toDateString();
    });
    return {
      labels: labels,
      values: Object.values(recentLoanAmountTableData?.data),
    };
  }, [recentLoanAmountTableData]);

  const repaymentGraphData = useMemo(() => {
    if (!recentRepaymentsTableData) {
      return { labels: [], values: [] };
    }
    const rawRepaymentsData = recentRepaymentsTableData?.data.map((data) => {
      return {
        ...data,
        created_at: getMonth(data?.created_at),
      };
    });

    const labels = rawRepaymentsData
      .map((data) => {
        return data.created_at;
      })
      .filter((data, index, arr) => {
        return arr.indexOf(data) === index;
      });

    const values = labels.map((label) => {
      let data = rawRepaymentsData.filter((data) => {
        return data.created_at === label;
      });

      const value = data.reduce((acc, curr) => {
        return acc + Number(curr.amount);
      }, 0);

      return value / 100;
    });

    return { labels, values };
  }, [recentRepaymentsTableData]);

  let myPayments = [];
  let lastTenPayments: any[] = [];

  if (recentRepaymentsTableData) {
    myPayments = recentRepaymentsTableData.data;
    lastTenPayments = myPayments.slice(0, 10);
  }

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <br className="lg:hidden" />
        <div className="w-full text-center mb-10 lg:hidden">
          <h1 className="text-green-500 font-semibold lg:hidden">
            Hello, {user && user.firstName}!
          </h1>
        </div>

        <div className="pl-10 mobile-dashboard-stats">
          <div className="flex overflow-x-auto mt-4">
            {isTotalLoanAmountLoading ? (
              <div className="w-64 bg-white flex-none  rounded p-4 p-8 shadow-sm mr-5">
                <div className="flex animate-pulse items-center justify-between mb-2">
                  <div className="bg-blue-200  w-8 h-8 rounded-full"></div>
                  <div className="bg-blue-200 w-2/3 h-2 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-blue-200 w-full h-2 rounded-md"></div>
              </div>
            ) : (
              <div className="w-64 bg-white flex-none border rounded p-4 shadow-sm mr-5">
                <div className="flex items-center justify-start mb-2">
                  <img src="img/loan-amount-icon.svg" className="w-8" alt="" />
                  <h3 className="font-normal text-blue-600 ml-6 text-sm font-medium">
                    Loans Received
                  </h3>
                </div>
                {Number(totalLoanAmountData?.data) > 0 ? (
                  <>
                    <h3 className="font-bold text-xl text-gray-600">
                      ₦
                      {Number(totalLoanAmountData?.data).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </h3>
                  </>
                ) : (
                  <h3 className="font-bold text-xl text-gray-300">₦0.00</h3>
                )}
              </div>
            )}

            {isTotalOutstandingBalanceLoading ? (
              <div className="w-64 bg-white flex-none  rounded p-4 p-8 shadow-sm mr-5">
                <div className="flex animate-pulse items-center justify-between mb-2">
                  <div className="bg-blue-200  w-8 h-8 rounded-full"></div>
                  <div className="bg-blue-200 w-2/3 h-2 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-blue-200 w-full h-2 rounded-md"></div>
              </div>
            ) : (
              <div className="w-64 bg-white border-green-500 flex-none border rounded p-4 shadow-sm mr-5">
                <div className="flex items-center justify-start mb-2">
                  <img src="img/repayment-icon.svg" className="w-8" alt="" />
                  <h3 className="font-normal text-green-600 ml-6 text-sm font-medium">
                    Total Outstanding
                  </h3>
                </div>
                {Number(totalOutstandingBalanceData?.data) > 0 ? (
                  <>
                    <h3 className="font-bold text-xl text-gray-600">
                      ₦
                      {Number(totalOutstandingBalanceData?.data).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </h3>
                  </>
                ) : (
                  <h3 className="font-bold text-xl text-gray-300">₦0.00</h3>
                )}
              </div>
            )}
            {isNextLoanDueDateLoading ? (
              <div className="w-64 bg-white flex-none  rounded p-4 p-8 shadow-sm mr-5">
                <div className="flex animate-pulse items-center justify-between mb-2">
                  <div className="bg-blue-200  w-8 h-8 rounded-full"></div>
                  <div className="bg-blue-200 w-2/3 h-2 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-blue-200 w-full h-2 rounded-md"></div>
              </div>
            ) : (
              <div className="w-64 bg-white flex-none border rounded p-4 shadow-sm">
                <div className="flex items-center justify-start mb-2">
                  <img
                    src="img/next-repayment-icon.svg"
                    className="w-8"
                    alt=""
                  />
                  <h3 className="font-normal text-purple-600 ml-6 text-sm font-medium">
                    Next Repayment Date
                  </h3>
                </div>
                {nextLoanDueDateBalanceData?.data ? (
                  <h3 className="font-bold text-xl text-gray-600">
                    {" "}
                    {new Date(
                      nextLoanDueDateBalanceData?.data
                    ).toLocaleDateString()}{" "}
                  </h3>
                ) : (
                  <h3 className="font-bold text-xl text-gray-300">--</h3>
                )}
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="w-56 bg-blue-700 p-2 pr-10 rounded-tr-md rounded-br-md">
          <h4 className="text-right text-white font-normal text-xs">
            Your Recent Payments
          </h4>
        </div>
        <br />
        <div className="">
          {isRecentRepaymentsTableLoading ||
          recentRepaymentsTableData === null ? (
            <div className="sm:w-8/12 flex-none  rounded pt-6 p-8 m-auto">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                  <div className="space-y-6">
                    <div className="h-4 bg-blue-200 rounded"></div>
                    <div className="h-4 bg-blue-200 rounded"></div>
                    <div className="h-4 bg-blue-200 rounded"></div>
                    <div className="h-4 bg-blue-200 rounded"></div>
                    <div className="h-4 bg-blue-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {recentRepaymentsTableData?.data.length > 0 ? (
                <table className="table-fixed sm:w-8/12  m-auto">
                  <thead>
                    <tr className="bg-blue-200 border-0">
                      <th className="w-1/6 px-4 py-3 text-xs font-semibold text-blue-700 rounded-bl-md rounded-tl-md text-left">
                        S/N
                      </th>
                      <th className="w-1/4 px-4 py-3 text-xs font-semibold text-blue-700">
                        Amount
                      </th>
                      <th className="w-1/3 px-4 py-3 text-xs font-semibold text-blue-700 text-right">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastTenPayments?.map((d, i) => {
                      return (
                        <tr>
                          <td className="w-1/6 border-b px-4 py-3 text-xs text-gray-600 text-left">
                            {i + 1}.
                          </td>
                          <td className="w-1/6 border-b px-4 py-3 text-xs text-green-700 text-center">
                            ₦
                            {Number(d.amount/100).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="w-1/3 border-b px-4 py-3 text-xs text-gray-600 text-right">
                            {new Date(d.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <h3 className="font-bold text-xl text-gray-400 mt-12 text-center">
                  No data
                </h3>
              )}
            </>
          )}
        </div>
        <br />
        <br />
        <br />
      </div>

      {/* End of Mobile View */}

      {/* Desktop view */}
      <main className="hidden lg:block lg:pl-12">
        <br />
        <div className="flex">
          <div className="w-1/3">
            {isTotalLoanAmountLoading ? (
              <div className="w-10/12 bg-white flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="flex animate-pulse items-center justify-between mb-4">
                  <div className="bg-blue-200  w-12 h-12 rounded-full"></div>
                  <div className="bg-blue-200 w-2/3 h-4 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-blue-200 w-full h-4 rounded-md"></div>
              </div>
            ) : (
              <div className="w-10/12 bg-white flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="flex items-center justify-start mb-2">
                  <img src="img/loan-amount-icon.svg" className="w-10" alt="" />
                  <h3 className="font-normal text-blue-600 ml-6 text-base font-medium">
                    Loans Received
                  </h3>
                </div>
                {Number(totalLoanAmountData?.data) > 0 ? (
                  <>
                    <h3 className="font-bold text-2xl text-gray-600">
                      ₦
                      {Number(totalLoanAmountData?.data).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </h3>
                  </>
                ) : (
                  <h3 className="font-bold text-2xl text-gray-300">₦0.00</h3>
                )}
              </div>
            )}
          </div>
          <div className="w-1/3">
            {isTotalOutstandingBalanceLoading ? (
              <div className="w-10/12 bg-white flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="flex animate-pulse items-center justify-between mb-4">
                  <div className="bg-blue-200  w-12 h-12 rounded-full"></div>
                  <div className="bg-blue-200 w-2/3 h-4 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-blue-200 w-full h-4 rounded-md"></div>
              </div>
            ) : (
              <div className="w-10/12 bg-white border border-green-500 flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="flex items-center justify-start mb-2">
                  <img src="img/repayment-icon.svg" className="w-10" alt="" />
                  <h3 className="font-normal text-green-600 ml-6 text-base font-medium">
                    Total Outstanding
                  </h3>
                </div>
                {Number(totalOutstandingBalanceData?.data) > 0 ? (
                  <>
                    <h3 className="font-bold text-2xl text-gray-600">
                      ₦
                      {Number(totalOutstandingBalanceData?.data).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </h3>
                  </>
                ) : (
                  <h3 className="font-bold text-2xl text-gray-300">₦0.00</h3>
                )}
              </div>
            )}
          </div>
          <div className="w-1/3">
            {isNextLoanDueDateLoading ? (
              <div className="w-10/12 bg-white flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="flex animate-pulse items-center justify-between mb-4">
                  <div className="bg-blue-200  w-12 h-12 rounded-full"></div>
                  <div className="bg-blue-200 w-2/3 h-4 rounded-md"></div>
                </div>
                <div className="animate-pulse bg-blue-200 w-full h-4 rounded-md"></div>
              </div>
            ) : (
              <div className="w-10/12 bg-white flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="flex items-center justify-start mb-2">
                  <img
                    src="img/next-repayment-icon.svg"
                    className="w-10"
                    alt=""
                  />
                  <h3 className="font-normal text-purple-500 ml-6 text-base font-medium">
                    Next Repayment Date
                  </h3>
                </div>
                {nextLoanDueDateBalanceData?.data ? (
                  <h3 className="font-bold text-2xl text-gray-600">
                    {" "}
                    {new Date(
                      nextLoanDueDateBalanceData?.data
                    ).toLocaleDateString()}{" "}
                  </h3>
                ) : (
                  <h3 className="font-bold text-2xl text-gray-300">--</h3>
                )}
              </div>
            )}
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="flex ">
          <div className="w-8/12 ">
            <div className="flex items-center">
              <div className="w-8 h-1 bg-blue-700 rounded mr-3"></div>
              <h4 className="text-gray-700 font-semibold text-xl tracking-wide">
                Repayment Trend
              </h4>
            </div>
            <br />
            {isRecentRepaymentsTableLoading ||
            recentRepaymentsTableData === null ? (
              <div className="w-11/12 bg-white flex-none  rounded pt-6 p-8 shadow-sm mr-5">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                    <div className="space-y-6">
                      <div className="h-4 bg-blue-200 rounded"></div>
                      <div className="h-4 bg-blue-200 rounded"></div>
                      <div className="h-4 bg-blue-200 rounded"></div>
                      <div className="h-4 bg-blue-200 rounded"></div>
                      <div className="h-4 bg-blue-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-11/12 bg-white flex-none  rounded pt-6 p-8 shadow-lg ">
                <RepaymentsGraph data={repaymentGraphData} />
                <p className="text-sm italic text-gray-600 text-center">
                  (Last 6 months data)
                </p>
              </div>
            )}
          </div>
          <div className="w-1/3">
            <div className="w-10/12 ">
              <div className="flex items-center">
                <div className="w-8 h-1 bg-blue-700 rounded mr-3"></div>
                <h4 className="text-gray-700 font-semibold text-xl tracking-wide">
                  Recent Loans
                </h4>
              </div>
              <br />
              <div className="w-full bg-white flex-none  rounded pt-6 p-8 shadow-lg mb-3">
                {isRecentLoanAmountTableLoading ||
                recentLoanAmountTableData === null ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                      <div className="space-y-6">
                        <div className="h-4 bg-blue-200 rounded"></div>
                        <div className="h-4 bg-blue-200 rounded"></div>
                        <div className="h-4 bg-blue-200 rounded"></div>
                        <div className="h-4 bg-blue-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <DoughnutChart data={doughnutChartData} />
                    <p className="text-sm italic text-gray-600 text-center mt-3">
                      (Last 6 months data)
                    </p>
                  </>
                )}
              </div>
              <button
                className="flex w-full shadow-xl text-xl font-light text-white justify-center pt-3 pb-3 items-center bg-blue-700 hover:bg-blue-600 rounded-md transition-colors duration-150 ease-in-out"
                onClick={() => props.history.push("/loans")}
              >
                <span className="ml-4 text-sm xl:text-lg lg:text-sm pr-2">
                  See loan history
                </span>
                <img src="img/chevron-right.svg" className="w-5 pt-1" alt="" />
              </button>
            </div>
          </div>
        </div>
        <br />
      </main>

      {/* End of Desktop View */}
    </>
  );
}

export default withRouter(Home);
