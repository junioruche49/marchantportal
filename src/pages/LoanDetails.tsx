import React, { Fragment } from "react";
import { useTable } from "react-table";
import ReactDatatable from "@ashvin27/react-datatable";
import { useParams } from "react-router-dom";
import { getLoan } from "../clients/loan";
import { useQuery } from "react-query";
import useAuthStore from "../stores/authStore";
import { withRouter } from "react-router";

// import 'bootstrap/dist/css/bootstrap.css';

function LoanDetails(props) {
  const token = useAuthStore((state) => state.accessToken);

  let { loanId } = useParams();
  const { isLoading, error, data: loan } = useQuery("loanDetail", () =>
    getLoan(token, loanId)
  );

  const statusClass = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">{status}</span>
          </span>
        );
      case "Rejected":
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">{status}</span>
          </span>
        );
      default:
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">{status}</span>
          </span>
        );
    }
  };

  let loanData = loan && loan.data;
  let loanDatas = [] as any;

  loan &&
    loanData["schedules"].map((item) => {
      loanDatas.push({
        col1: item.id,
        col2: (
          <span className="text-green-600 font-bold">
            ₦
            {Number(item.repayment).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </span>
        ),
        col3: new Date(item.schedule_date).toDateString(),
        col4: statusClass(item.payment_status),
      });
    });

  const data = React.useMemo(
    () => [
      // {
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "S/N",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Repayment",
        accessor: "col2",
      },
      {
        Header: "Due Date",
        accessor: "col3",
      },
      {
        Header: "Status",
        accessor: "col4",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: columns, data: loanDatas });

  if (isLoading) {
    return (
      <>
        <div className="w-full m-auto px-8 relative">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-20"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <main className="md:pl-12">
        <div className="flex ">
          <div className="w-full ">
            <div className="flex items-center mt-10 lg:mt-0">
              <div className="w-8 h-1 bg-blue-700 rounded mr-0 hidden md:block"></div>
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-light md:font-semibold text-sm md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                Loan Details
              </h4>
            </div>
            <br />
            <div className="w-11/12 flex justify-end items-center h-16 my-2 md:m-0 m-auto lg:hidden">
              <button
                className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={() => props.history.goBack()}
              >
                <div className="ml-2 text-blue-700 text-md">Go Back</div>
              </button>
            </div>
            <div className="w-11/12 bg-white flex flex-col sm:flex-row rounded py-6 shadow-lg border-b-4 border-blue-700 md:border-none pl-4 sm:mb-20 m-auto md:m-0">
              <div className="w-full sm:w-1/4 text-center  sm:border-r-8 sm:border-blue-100 align-middle justify-center">
                <h2 className="text-blue-700 xl:text-4xl font-semibold py-5 pl-3 lg:text-2xl">
                  {loanData.loan_id}
                </h2>
              </div>
              <div className="w-full sm:w-1/4 flex-row">
                <div className="flex flex-row text-blue-700 xl:text-lg lg:text-sm mb-4">
                  <div className="w-1/2 mx-5">Amount: </div>
                  <div className="w-1/2 text-left font-bold">
                    ₦
                    {Number(loanData.loan_amount).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="flex flex-row text-blue-700 xl:text-lg lg:text-sm">
                  <div className="w-1/2 mx-5">Duration:</div>
                  <div className="w-1/2 text-left font-bold">
                    {loanData.number_of_payments} months
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/4 flex flex-col  ">
                <div className="w-full mb-4 text-center ">
                  <p
                    style={{ fontSize: 8 }}
                    className="text-center w-1/3 lg:float-right text-teal-600 bg-teal-100 py-2  rounded-full m-auto lg:m-px"
                  >
                    {loanData.status}
                  </p>
                </div>

                <div className="flex flex-row text-blue-700 xl:text-lg lg:text-sm">
                  {loanData["schedules"].length ? (
                    <>
                      <p className="w-1/2 text-right mr-5">Repayment</p>
                      <p className="w-1/2 text-left lg:text-right font-bold">
                        ₦
                        {Number(
                          loanData["schedules"][0]["repayment"]
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {loanData &&
              loanData?.voucher_status?.toLowerCase() === "completed" ? (
                <div
                  style={{ alignItems: "center" }}
                  className="w-full sm:w-1/4 justify-center flex sm:justify-end align-middle mt-6 md:mt-0"
                >
                  <button
                    onClick={() => props.history.push("/pay/" + loanId)}
                    className="bg-green-700 text-white inline-flex sm:-mr-6 px-6 py-3 rounded"
                  >
                    <span className="xl:text-lg lg:text-sm">Make Payment</span>
                    <svg
                      className="mt-1"
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="chevron_right_24px">
                        <path
                          id="icon/navigation/chevron_right_24px"
                          d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
            <br />
            <br />
            <div className="flex items-center mt-10 lg:mt-0">
              <div className="w-8 h-1 bg-blue-700 rounded mr-0 hidden md:block"></div>
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-light md:font-semibold text-sm md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                Repayment Log
              </h4>
            </div>
            <div className="w-11/12 sm:bg-white flex rounded py-12  md:border-none  mb-20 m-auto md:m-0">
              <div className="w-full mb-6 px-3 py-6 relative">
                {rows.length > 0 ? (
                  <div className="py-0 md:py-4 overflow-auto  fade-in mt-5 mb-10">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                      <table
                        {...getTableProps()}
                        className="min-w-full w-full leading-normal"
                      >
                        <thead className="flex w-full">
                          {headerGroups.map((headerGroup) => (
                            <tr
                              {...headerGroup.getHeaderGroupProps()}
                              className="flex w-full bg-blue-700"
                            >
                              {headerGroup.headers.map((column) => (
                                <th
                                  {...column.getHeaderProps()}
                                  className="p-4 w-1/4 px-5 py-3  bg-blue-200 text-center text-sm font-semibold sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 sm:text-gray-600 text-blue-700 uppercase tracking-wider"
                                  //   style={{
                                  //     borderBottom: "solid 3px red",
                                  //     background: "aliceblue",
                                  //     color: "black",
                                  //     fontWeight: "bold",
                                  //   }}
                                >
                                  {column.render("Header")}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody
                          {...getTableBodyProps()}
                          className="flex flex-col items-center overflow-y-scroll w-full schedule-table"
                        >
                          {rows.map((row) => {
                            prepareRow(row);
                            return (
                              <tr
                                {...row.getRowProps()}
                                className="flex w-full"
                              >
                                {row.cells.map((cell) => {
                                  return (
                                    <td
                                      {...cell.getCellProps()}
                                      // style={{
                                      //   padding: "10px",
                                      //   fontSize: 16,
                                      //   textAlign: "center",
                                      //   paddingBottom: 20,
                                      // }}
                                      className="p-4 w-1/4 px-5 py-5 text-center border-b border-gray-200 bg-white text-xs md:text-sm text-gray-700"
                                    >
                                      {cell.render("Cell")}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full m-auto mb-6">
                      <img
                        src="/img/check-files.svg"
                        alt=""
                        className="w-3/4 md:w-1/3 m-auto opacity-50"
                      />
                    </div>
                    <div className="w-3/4 m-auto">
                      <p className="text-gray-700 font-medium text-center my-6">
                        Schedule not available....
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-11/12 mt-8 hidden md:block">
              <hr className="w-9/12 border-t-2 border-blue-600 bg-blue-400 rounded m-auto"></hr>
            </div>
          </div>
        </div>
        <br />
      </main>
    </>
  );
}

export default withRouter(LoanDetails);
