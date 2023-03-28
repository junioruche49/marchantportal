import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from "react-query";
import { getLoan } from "../clients/loan";
import useAuthStore from "../stores/authStore";

const PaymentSuccess = (props: any) => {
  let referrerData = props.location.referrerData;
  if (
    referrerData === null ||
    referrerData === "" ||
    referrerData === undefined
  ) {
    props.history.push("/pay");
  }


  const token = useAuthStore((state) => state.accessToken);
  const [errorMsg, setErrorMsg] = useState([]);

  const {
    isLoading: isloanDetailsLoading,
    error: loanDetailsError,
    data: loanDetails,
  } = useQuery("loanDetail", () => getLoan(token, referrerData?.loan_id));

  if (loanDetailsError) {
    let msg = [] as any;
    msg.push(
      "Could not load the details of the loan attached to this payment. Please check with your loan officer to ensure payment accuracy."
    );
    setErrorMsg(msg);
  }

  if (isloanDetailsLoading) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-10">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait...
          </h6>
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
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-normal md:font-semibold text-md md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                Make Payment
              </h4>
            </div>
            <br />

            <div className="relative w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
              {errorMsg.length ? (
                <div
                  className="w-9/12 m-auto bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md my-5"
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
              <div className="w-full m-auto mb-6 animate-pulse">
                <img
                  src="/img/payment-success.png"
                  alt=""
                  className="w-3/4 md:w-2/4 m-auto"
                />
              </div>
              <div className="w-3/4 m-auto">
                <p className="text-gray-700 font-medium text-center">
                  <span className="text-green-700 text-xl md:text-2xl">
                    Awesome!
                  </span>{" "}
                  <br />
                  We have been able to successfully process your repayment of{" "}
                  <span className="text-green-700">
                    {referrerData && referrerData.amount
                      ? "₦" + Number(referrerData.amount) / 100
                      : null}
                  </span>{" "}
                  for loan:{" "}
                  {loanDetails && loanDetails.data.loan_id
                    ? loanDetails.data.loan_id
                    : null}
                  .
                </p>
              </div>
              <div className="w-full m-auto mt-10">
                <button
                  onClick={() => props.history.replace("/")}
                  className="flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-green-600 hover:bg-green-700 rounded-md m-auto transition-colors duration-150 ease-in-out"
                >
                  <span className="text-sm xl:text-lg lg:text-sm pr-2">
                    Go to dashboard
                  </span>
                  <img
                    src="/img/chevron-right.svg"
                    className="w-5 pt-1"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
      </main>
    </>
  );
};

export default withRouter(PaymentSuccess);
