import React, { useState } from "react";
import { withRouter } from "react-router";
import { getLoanApplications } from "../clients/loan";
import { getProducts } from "../clients/products";
import { useQuery } from "react-query";
import useAuthStore from "../stores/authStore";

const LoanRequests = (props: any) => {
  const token = useAuthStore((state) => state.accessToken);
  const [rejectionMessageVisible, setRejectionMessageVisible] = useState(false);
  const [rejectionData, setRejectionData]: any = useState({});

  const { isLoading, error, data } = useQuery("applications", () =>
    getLoanApplications(token)
  );

  const {
    isLoading: isProductLoading,
    error: productError,
    data: productData,
  } = useQuery("products", () => getProducts(token), {
    retry: 1,
  });

  const getProductName = (productNo) => {
    let products: any[] | null = productData?.data;

    if (!products) {
      return;
    }
    let currentProduct = products.find((prod) => prod.no === productNo);

    return currentProduct?.description;
  };

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
          <span className="relative inline-block px-3 py-1 font-semibold text-red-700 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">{status}</span>
          </span>
        );

      case "Error":
        return (
          <span className="relative inline-block px-3 py-1 font-semibold text-red-600 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 opacity-50 rounded-full"
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

  const _handleRejectionMessage = (data) => {
    setRejectionData(data);
    setRejectionMessageVisible(true);

    setTimeout(() => {
      setRejectionData({});
      setRejectionMessageVisible(false);
    }, 10000);
  };

  if (isLoading || isProductLoading) {
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
      <main className="md:pl-12 set-bg">
        <div className="flex ">
          <div className="w-full ">
            <div className="flex items-center mt-10 lg:mt-0">
              <div className="w-8 h-1 bg-blue-700 rounded mr-0 hidden md:block"></div>
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-normal md:font-semibold text-md md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                My Applications
              </h4>
            </div>
            <br />

            {error || productError ? (
              <div
                className="w-11/12 bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md mb-5 m-auto md:m-0 md:mb-2"
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
                    <ul style={{ listStyleType: "none" }}>
                      Sorry, we could not fetch your data completely. Please
                      ensure you have completed your KYC.
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="w-11/12 sm:bg-white flex rounded py-0 md:py-4  mb-0 md:mb-20 m-auto md:m-0 rounded-t-3xl">
              <div className="w-full mb-6 px-8 py-6 relative">
                <h1 className="block text-blue-800 text-lg font-bold mb-6 fade-in">
                  Recent loan applications:
                </h1>

                {rejectionMessageVisible ? (
                  <div className="flex w-full bg-red-100 shadow-lg rounded-lg mb-4 fade-in">
                    <div className="w-2 bg-red-600"></div>
                    <div className="flex items-center px-2 py-3">
                      <div className="mx-3">
                        <h2 className="text-xl font-semibold text-red-600">
                          Applied for ₦
                          {Number(rejectionData?.loan_amount).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </h2>
                        <p className="text-gray-600">
                          <p className="font-semibold">Message: </p>
                          <p>{rejectionData?.message}</p>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {data?.data?.length > 0 ? (
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-0 md:py-4 overflow-auto  fade-in mt-5 mb-10">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                      <table className="min-w-full w-full leading-normal">
                        <thead className="flex w-full">
                          <tr className="flex w-full bg-blue-200">
                            <th className="p-4 w-1/4 px-5 py-3  bg-blue-200 text-left text-xs font-semibold sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 sm:text-gray-600 text-blue-700 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="p-4 w-1/4 px-5 py-3  bg-blue-200 text-left text-xs font-semibold sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 sm:text-gray-600  text-blue-700 uppercase tracking-wider">
                              Loan Type
                            </th>
                            <th className="p-4 w-1/4 px-5 py-3  bg-blue-200 text-left text-xs font-semibold sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 sm:text-gray-600  text-blue-700 uppercase tracking-wider text-center">
                              Amount
                            </th>
                            <th className="p-4 w-1/4 px-5 py-3  bg-blue-200 text-left text-xs font-semibold sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 sm:text-gray-600 text-blue-700 uppercase tracking-wider text-center">
                              Duration
                            </th>
                            <th className="p-4 w-1/4 px-5 py-3  bg-blue-200 text-left text-xs font-semibold sm:border-b-2 sm:border-gray-200 sm:bg-gray-100 sm:text-gray-600 text-blue-700 uppercase tracking-wider text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="flex flex-col items-center overflow-y-scroll w-full schedule-table">
                          {data &&
                            data.data.map((d) => (
                              <tr className="flex w-full">
                                <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-xs md:text-sm text-gray-700">
                                  {new Date(d.created_at).toDateString()}
                                </td>
                                <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-xs md:text-sm text-gray-700">
                                  {getProductName(d.product_code)}
                                </td>
                                <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-xs md:text-sm text-green-600 font-bold text-center">
                                  ₦
                                  {Number(d.loan_amount).toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </td>
                                <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-xs md:text-sm text-gray-700 text-center">
                                  {d.number_of_payments} months
                                </td>
                                <td className="p-4 w-1/4 px-5 py-5 border-b border-gray-200 bg-white text-xs md:text-sm text-green-600 font-bold text-center">
                                  <div className="flex justify-center">
                                    {statusClass(d.status)}
                                    {d.status.trim() === "Rejected" ||
                                    d.status.trim() === "Error" ? (
                                      <div>
                                        <button
                                          className="flex bg-red-100 hover:bg-red-200 items-center py-1 px-1 rounded transition-colors duration-150 ease-in-out cursor-pointer"
                                          onClick={() =>
                                            _handleRejectionMessage(d)
                                          }
                                        >
                                          <div>
                                            <svg
                                              width="18"
                                              height="18"
                                              viewBox="0 0 24 25"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g id="alert/notification_important_24px">
                                                <path
                                                  id="icon/outlined/alert/notification_important_24px"
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M10.5 2.75C10.5 1.92 11.17 1.25 12 1.25C12.83 1.25 13.5 1.92 13.5 2.75V3.92C16.64 4.6 19 7.4 19 10.75V16.75L21 18.75V19.75H3V18.75L5 16.75V10.75C5 7.4 7.36 4.6 10.5 3.92V2.75ZM12 5.75C14.76 5.75 17 7.99 17 10.75V17.75H7V10.75C7 7.99 9.24 5.75 12 5.75ZM10.01 20.76C10.01 21.86 10.9 22.75 12 22.75C13.1 22.75 13.99 21.86 13.99 20.76H10.01ZM13 7.75V11.75H11V7.75H13ZM13 15.75V13.75H11V15.75H13Z"
                                                  fill="#c53030"
                                                />
                                              </g>
                                            </svg>
                                          </div>
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            ))}
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
                        We could not find any loan application on your profile
                        so far...
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
          </div>
        </div>
        <br />
      </main>
    </>
  );
};

export default withRouter(LoanRequests);
