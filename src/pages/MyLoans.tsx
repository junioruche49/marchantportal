import React, { Fragment, useEffect, useState } from "react";
import { useTable } from "react-table";
import ReactDatatable from "@ashvin27/react-datatable";
// import 'bootstrap/dist/css/bootstrap.css';
import { useQuery } from "react-query";
import useAuthStore from "../stores/authStore";
import { getLoans } from "../clients/loan";
import { withRouter } from "react-router";

function MyLoans(props) {
  const token = useAuthStore((state) => state.accessToken);
  const [allMyLoans, setAllMyLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const getAllLoans = async (token) => {
    setLoading(true);
    try {
      let postData = await getLoans(token);
      const { data } = postData;
      let tableDatas = [] as any;
      setLoading(false);
      data &&
        data.map((item) => {
          tableDatas.push({
            col1: item.loan_id,
            col2: item.description,
            col3: (
              <span className="text-green-600 font-bold">
                ₦
                {Number(item.loan_amount).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            ),
            col4: new Date(item.created_at).toDateString(),
            col6: (
              <button
                onClick={() => props.history.push("/loan-details/" + item.uuid)}
                className="bg-blue-700 py-1 px-2 rounded"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="visibility_24px">
                    <path
                      id="icon/action/visibility_24px"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.625 7.5C1.70625 4.75625 4.375 2.8125 7.5 2.8125C10.625 2.8125 13.2937 4.75625 14.375 7.5C13.2937 10.2438 10.625 12.1875 7.5 12.1875C4.375 12.1875 1.70625 10.2438 0.625 7.5ZM13.0125 7.5C11.9813 5.39375 9.86878 4.0625 7.50003 4.0625C5.13128 4.0625 3.01878 5.39375 1.98753 7.5C3.01878 9.60625 5.13128 10.9375 7.50003 10.9375C9.86878 10.9375 11.9813 9.60625 13.0125 7.5ZM7.5 5.9375C8.3625 5.9375 9.0625 6.6375 9.0625 7.5C9.0625 8.3625 8.3625 9.0625 7.5 9.0625C6.6375 9.0625 5.9375 8.3625 5.9375 7.5C5.9375 6.6375 6.6375 5.9375 7.5 5.9375ZM4.6875 7.5C4.6875 5.95 5.95 4.6875 7.5 4.6875C9.05 4.6875 10.3125 5.95 10.3125 7.5C10.3125 9.05 9.05 10.3125 7.5 10.3125C5.95 10.3125 4.6875 9.05 4.6875 7.5Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </button>
            ),
          });
        });
      setAllMyLoans(tableDatas);
    } catch (error) {
      setLoading(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push(
          "Fatal Error! Please check your network connection or kindly logout and login again."
        );
        setErrorMsg(msg);
        return;
      }
      if (
        error &&
        (error.response.status === 500 ||
          error.response.status === 404 ||
          error.response.status === 401)
      ) {
        let msg = [] as any;
        msg.push(error.response.data.message);
        setErrorMsg(msg);
        return;
      }
      const {
        response: { data },
      } = error;
      data.errors && updateErrors(data.errors);
    }
  };

  useEffect(() => {
    getAllLoans(token);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Loan ID",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Type",
        accessor: "col2",
      },
      {
        Header: "Amount",
        accessor: "col3",
      },
      {
        Header: "Date",
        accessor: "col4",
      },
      {
        Header: "Action",
        accessor: "col6",
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
  } = useTable({ columns: columns, data: allMyLoans });

  if (loading) {
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
                My Loans
              </h4>
            </div>
            <br />
            {errorMsg.length ? (
              <div
                className="w-11/12  bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md m-auto my-5"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-red-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    {/* <p className="font-bold">Sent successfully</p> */}
                    {/* <p className="text-sm">{errorMsg}</p> */}
                    <ul style={{ listStyleType: "none" }}>
                      {errorMsg.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="w-11/12 flex justify-end items-center h-16 my-2 md:m-0 m-auto lg:hidden">
              <button
                className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={() => props.history.goBack()}
              >
                <div className="ml-2 text-blue-700 text-md">Go Back</div>
              </button>
            </div>
            <div className="w-11/12 flex justify-end items-center h-16 my-2 md:m-0 m-auto">
              <button
                className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={() => props.history.push("/applications")}
              >
                <div>
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="add_24px">
                      <path
                        id="icon/content/add_24px"
                        d="M19 13.3832H13V19.229H11V13.3832H5V11.4346H11V5.58878H13V11.4346H19V13.3832Z"
                        fill="#0A54A2"
                      />
                    </g>
                  </svg>
                </div>
                <div className="ml-2 text-blue-700 text-md">
                  My Applications
                </div>
              </button>
            </div>
            <div className="w-11/12 sm:bg-white flex rounded py-12  md:border-none  mb-20 m-auto md:m-0">
              <div className="w-full mb-6 px-8 py-6 relative">
                {allMyLoans.length > 0 ? (
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-0 md:py-4 overflow-auto  fade-in mt-5 mb-10">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                      <table
                        {...getTableProps()}
                        className="min-w-full w-full leading-normal"
                      >
                        <thead className="flex w-full">
                          {headerGroups.map((headerGroup) => (
                            <tr
                              {...headerGroup.getHeaderGroupProps()}
                              className="flex w-full bg-blue-200"
                            >
                              {headerGroup.headers.map((column) => (
                                <th
                                  {...column.getHeaderProps()}
                                  // style={{ fontSize: 16 }}
                                  // className="p-4 w-1/4 px-5 py-3 bg-blue-200 text-center text-sm font-semibold text-blue-700 uppercase tracking-wider"
                                  className="p-4 w-1/4 px-5 py-3 bg-blue-200 sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 text-center text-sm font-semibold text-blue-700 sm:text-gray-600 uppercase tracking-wider"

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
                        You have not requested for any loan so far...
                      </p>
                      <div className="w-full mb-8 lg:mb-16 m-auto text-center">
                        <button
                          onClick={() =>
                            props.history.push("/new-loan-request")
                          }
                          className="inline-flex m-auto shadow-xl text-xl text-white px-8 lg:px-10 py-2 lg:py-3 items-center bg-blue-700 rounded-md hover:bg-blue-600 transition-colors duration-150 ease-in-out"
                        >
                          <svg
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="add_24px">
                              <path
                                id="icon/content/add_24px"
                                d="M19 13.3832H13V19.229H11V13.3832H5V11.4346H11V5.58878H13V11.4346H19V13.3832Z"
                                fill="white"
                              />
                            </g>
                          </svg>
                          <span className="ml-2 text-lg font-normal">
                            Take a loan
                          </span>
                        </button>
                      </div>
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

export default withRouter(MyLoans);
