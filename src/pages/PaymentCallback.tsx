import React, { useState, useEffect, useCallback } from "react";
import { useLocation, withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import useProfileStore from "../stores/profileStore";
import { useQuery, useMutation } from "react-query";
import useAuthStore from "../stores/authStore";
import { verifyPaymentReference, addCardToProfile } from "../clients/cards";
import { validatePayment } from "../clients/payments";

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

const PaymentCallback = (props: any) => {

  let referrerData = props.location.referrerData;
  if (
    referrerData === null ||
    referrerData === "" ||
    referrerData === undefined
  ) {
    props.history.push("/pay");
  }

  const profile: any = useProfileStore((state) => state.data);
  const [isLoading, setLoading] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [verifyTrxResponse, setVerifyTrxResponse]: any = useState();
  const [errorMsg, setErrorMsg] = useState([]);
  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const [addCardErrorResponse, setAddCardErrorResponse] = useState<any>();

  let query = useQueryParams();

  const history = useHistory();

  const token = useAuthStore((state) => state.accessToken);

  const confirmPaymentEntry = useCallback(async () => {
    let values = {
      email: profile?.e_mail,
      amount: referrerData?.amount,
      user_id: profile?.user_id,
      payment_type: referrerData?.payment_type,
      description: referrerData?.payment_type === 0 ? "Card Pre-auth charge" : "Repayment with new card",
      item_id: referrerData?.item_id,
      reference: referrerData?.reference,
    };
    setLoading(true);
    try {
      const { message, data, success, status } = await validatePayment(
        token,
        values
      );

      if (success === false || status === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      setLoading(true);
      setIsPaymentValid(status)
      setVerifyTrxResponse(data);
      setErrorMsg([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
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
  }, [profile]);

  useEffect(() => {
    if (profile?.e_mail && !verifyTrxResponse) {
      confirmPaymentEntry();
    }

    if (profile?.e_mail && isPaymentValid) {
      if (verifyTrxResponse?.payment_type === 0) addCard();
      if (verifyTrxResponse?.payment_type === 2) {
        props.history.replace({
          pathname: "/pay/success",
          referrerData: {
            amount: verifyTrxResponse?.amount,
            loan_id: verifyTrxResponse?.item_id,
          },
        });
      }
    }
  }, [verifyTrxResponse, profile]);

  const [
    addCardMutation,
    { isLoading: isAddCardLoading, error: addCardError, data: addCardResponse },
  ] = useMutation(addCardToProfile);

  const addCard = useCallback(async () => {
    try {
      const { message, data, success } = await addCardMutation({
        token,
        email: profile.e_mail,
        transaction_ref: verifyTrxResponse?.reference,
      });

      if (!success) {
        throw new Error(message);
      }

      props.history.replace("/cards", { message });
    } catch (err) {
      console.log(err);
      setAddCardErrorResponse(err.message);
    }
  }, [profile, token, query, addCardMutation, history]);

  if (isLoading || isAddCardLoading || !profile.e_mail) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait. We are verifying the transaction...
          </h6>
        </div>
      </>
    );
  }

  if (
    errorMsg.length > 0 ||
    addCardError ||
    (verifyTrxResponse && !verifyTrxResponse.status) ||
    (addCardResponse && !addCardResponse.status)
  ) {
    return (
      <>
        <main className="md:pl-12">
          <div className="flex ">
            <div className="w-full ">
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
              <div className="relative w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
                <div className="w-full m-auto mb-6">
                  <img
                    src="/img/error-icon.svg"
                    alt=""
                    className="w-2/4 md:w-1/4 m-auto"
                  />
                </div>
                <div className="w-3/4 md:w-2/4 m-auto">
                  <p className="text-gray-700 font-medium text-center">
                    <span className="text-red-600">
                      Oops! An error has occured.
                    </span>{" "}
                    <br />
                    {verifyTrxResponse && verifyTrxResponse.status === false
                      ? verifyTrxResponse.message
                      : ""}
                    {addCardError
                      ? addCardError.response.status +
                        " - " +
                        addCardError.response.data.message +
                        " " +
                        addCardErrorResponse
                      : ""}
                    {addCardResponse && addCardResponse.status === false
                      ? +" - " + addCardResponse.message
                      : ""}
                    {addCardErrorResponse ? addCardErrorResponse : null}
                  </p>
                </div>
                <div className="w-full m-auto mt-10">
                  <button
                    onClick={() => props.history.replace("/")}
                    className="flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-gray-800 hover:bg-gray-700 rounded-md m-auto transition-colors duration-150 ease-in-out"
                  >
                    <svg
                      className="mr-2 -mt-1"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="chevron_left_24px">
                        <path
                          id="icon/navigation/chevron_left_24px"
                          d="M15.705 16.59L11.125 12L15.705 7.41L14.295 6L8.29498 12L14.295 18L15.705 16.59Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    <span className="text-sm xl:text-lg lg:text-sm pr-2">
                      Back to home
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="md:pl-12">
        <div className="flex ">
          <div className="w-full ">
            <br />
            <div className="relative w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
              <div className="w-full m-auto mb-6">
                <img
                  src="/img/error-icon.svg"
                  alt=""
                  className="w-2/4 md:w-1/4 m-auto"
                />
              </div>
              <div className="w-3/4 md:w-2/4 m-auto">
                <p className="text-gray-700 font-medium text-center">
                  <span className="text-red-600">
                    Fatal exception. Please reach out to the administrator
                    immediately! Payment ref: {referrerData?.reference}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default withRouter(PaymentCallback);
