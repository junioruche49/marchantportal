import React, { useState } from "react";
import { withRouter } from "react-router";
import { getAddCardFee, sendCardPreAuth } from "../clients/cards";
import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { useQuery } from "react-query";
import { PaystackConsumer } from "react-paystack";

const AddCard = (props: any) => {
  const token = useAuthStore((state) => state.accessToken);

  const [isLoading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [responseData, setResponseData]: any = useState();
  const [submitted, setSubmitted] = useState(false);

  const profile: any = useProfileStore((state) => state.data);

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const {
    isLoading: isPreAuthFeeLoading,
    error: preAuthFeeError,
    data: preAuthFeeData,
  } = useQuery("fee", () => getAddCardFee(token));

  if (preAuthFeeError) {
    let msg = [] as any;
    msg.push("Could not load card fee. Please reload the page!");
    setErrorMsg(msg);
    setLoading(false);
  }

  const _handlePrematurePaymentModalClose = () => {
    let msg = [] as any;
    msg.push(
      "You have chosen not to proceed with the payment! Feel free to try again."
    );
    setErrorMsg(msg);
    return;
  };

  const psConfig = {
    reference: new Date().getTime().toString(),
    email: profile.e_mail,
    amount: preAuthFeeData,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ?? "",
  };

  const componentProps = {
    ...psConfig,
    text: "Proceed to pay",
    onSuccess: (transaction) => { 
      props.history.replace({
        pathname: "/pay/process",
        referrerData: {
          amount: preAuthFeeData,
          payment_type: 0,
          item_id: null,
          reference: transaction.reference
        },
      })
    },
    onClose: _handlePrematurePaymentModalClose,
  };

  if (isLoading || !profile.e_mail || isPreAuthFeeLoading || !preAuthFeeData) {
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
                Add New Card
              </h4>
            </div>
            <br />

            {errorMsg.length ? (
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

            {!submitted ? (
              <>
                <div className="relative w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
                  <div className="w-full m-auto mb-6">
                    <img
                      src="/img/payment-svg-naira.svg"
                      alt=""
                      className="w-2/4 md:w-1/4 m-auto"
                    />
                  </div>
                  <div className="w-3/4 md:w-2/4 m-auto">
                    <p className="text-gray-700 font-medium text-center">
                      You will be charged ₦{Number(preAuthFeeData) / 100} to
                      confirm the validity of your card. <br /> Click proceed to
                      continue.
                    </p>
                  </div>
                  <div className="w-full m-auto mt-10">
                    <PaystackConsumer {...componentProps}>
                      {({ initializePayment }) => (
                        <button
                          disabled={!!!profile.e_mail}
                          onClick={() => {
                            errorMsg.length = 0;
                            initializePayment();
                          }}
                          className={
                            !profile.e_mail
                              ? "flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-gray-200 rounded-md m-auto cursor-not-allowed"
                              : "flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-green-600 hover:bg-green-700 rounded-md m-auto transition-colors duration-150 ease-in-out"
                          }
                        >
                          <span className="text-sm xl:text-lg lg:text-sm pr-2">
                            Proceed
                          </span>
                          <img
                            src="/img/chevron-right.svg"
                            className="w-5 pt-1"
                            alt=""
                          />
                        </button>
                      )}
                    </PaystackConsumer>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-11/12 bg-white rounded py-6 md:py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0">
                  <h3 className="block text-green-600 text-sm md:text-lg font-semibold mb-6 fade-in text-center">
                    Redirecting you to the payment gateway.
                  </h3>
                </div>
                <div className="w-11/12 mt-8 hidden md:block">
                  <hr className="w-9/12 border-t-2 border-blue-600 bg-blue-400 rounded m-auto"></hr>
                </div>
              </>
            )}
          </div>
        </div>
        <br />
      </main>
    </>
  );
};

export default withRouter(AddCard);
