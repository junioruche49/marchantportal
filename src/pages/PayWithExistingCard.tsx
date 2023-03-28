import React, { useState, useCallback, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { getCards } from "../clients/cards";
import { withRouter } from "react-router-dom";
import { sendOtpRequest, payWithExistingCard } from "../clients/payments";

const PayWithExistingCard = (props: any) => {
  const [isLoading, setLoading] = useState(false);

  const token = useAuthStore((state) => state.accessToken);
  const profile: any = useProfileStore(useCallback((state) => state.data, []));
  const [cardsReponse, setCardsReponse]: any = useState();
  const [responseMessage, setResponseMessage]: any = useState(null);
  const [showCardsList, setShowCardsList]: any = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>();
  const [showOtpForm, setShowOtpForm]: any = useState(false);
  const [userOtpInput, setUserOtpInput] = useState(null);
  const [submitting, setSubmitting]: any = useState(false);
  const [otpRequestResponseData, setOtpRequestResponseData]: any = useState();
  const [otpRequestMessage, setOtpRequestMessage]: any = useState(null);
  const [repaymentMessage, setRepaymentMessage]: any = useState(null);

  const [errorMsg, setErrorMsg] = useState([]);

  const amountToPay = props.amount ? Number(props.amount) * 100 : null;
  const loanId = props.loanId ? props.loanId : null;

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const goToAddCard = () => {
    props.history.push("/cards/add");
  };

  const postCardOwner = useCallback(async () => {
    let values = {
      email: profile.e_mail,
    };
    setLoading(true);
    try {
      const { message, data, success } = await getCards(token, values);

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      // setResponseMessage(message);
      setTimeout(function () {
        setResponseMessage(null);
      }, 3000);
      setCardsReponse(data);
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
      if (error && error.response.status === 500) {
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
  }, [token, profile.e_mail]);

  useEffect(() => {
    if (profile && profile.e_mail) postCardOwner();
  }, [profile]);

  const postOtpRequest = async () => {
    setLoading(true);
    try {
      const {
        message: OtpRequestMessage,
        data: OtpRequestData,
        status: OtpRequestStatus,
      } = await sendOtpRequest(token);

      if (OtpRequestStatus === false) {
        let msg = [] as any;
        msg.push(OtpRequestMessage);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      setOtpRequestMessage(OtpRequestMessage);
      setShowCardsList(false);
      setShowOtpForm(true);
      setTimeout(function () {
        setOtpRequestMessage(null);
      }, 4000);
      setOtpRequestResponseData(OtpRequestData);
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
      if (error && error.response.status === 500) {
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

  const submitRepayment = async () => {
    setSubmitting(true);

    let values = {
      otp: userOtpInput,
      requestid: otpRequestResponseData.otprequestid,
      amount: amountToPay,
      payment_type: 2,
      description: "On Demand Charge",
      card_id: selectedCard,
      loan_id: loanId,
    };

    try {
      const {
        message: repaymentResponseMessage,
        data: repaymentResponseData,
        status: repaymentResponseStatus,
      } = await payWithExistingCard(token, values);

      if (repaymentResponseStatus === false) {
        let msg = [] as any;
        msg.push(repaymentResponseMessage);
        setErrorMsg(msg);
        setSubmitting(false);
        return;
      }
      setRepaymentMessage(repaymentResponseMessage);
      setErrorMsg([]);
      props.history.replace({
        pathname: "/pay/success",
        referrerData: { loan_id: loanId, amount: amountToPay },
      });
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
        setErrorMsg(msg);
        return;
      }
      if (error && error.response.status === 500) {
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

  const _handleCardSelection = (id) => {
    setSelectedCard(id);
  };

  const _handleAuthorizeToPay = () => {
    postOtpRequest();
  };

  const _handleUserOtpInput = (e) => {
    setUserOtpInput(e.target.value);
  };

  if (isLoading || !profile.e_mail) {
    return (
      <>
        <img src="/img/loading-gif.gif" alt="" className="w-1/8 m-auto py-10" />
        <h6 className="m-auto text-lg text-gray-700 text-center">
          Please wait while we process your request...
        </h6>
      </>
    );
  }

  if (submitting) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Hold on, while we attempt to charge your card...
          </h6>
        </div>
      </>
    );
  }

  if (amountToPay === null || loanId === null) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 m-auto px-4 relative mt-20">
          <img
            src="/img/error-icon.svg"
            alt=""
            className="w-2/4 md:w-1/4 m-auto"
          />
          <h6 className="m-auto text-lg text-red-600 text-center font-semibold mt-4">
            Ooops! The system was unable to capture one or more of your payment
            data. Please try again!
          </h6>
        </div>
      </>
    );
  }

  return (
    <>
      {errorMsg.length ? (
        <div
          className="w-11/12 m-auto bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md my-5"
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
      {responseMessage && cardsReponse?.length > 0 ? (
        <div
          className="w-11/12 m-auto bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm">{responseMessage}</p>
            </div>
          </div>
        </div>
      ) : otpRequestMessage ? (
        <div
          className="w-11/12 m-auto bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm">{otpRequestMessage}</p>
            </div>
          </div>
        </div>
      ) : repaymentMessage ? (
        <div
          className="w-11/12 m-auto bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm">{repaymentMessage}</p>
            </div>
          </div>
        </div>
      ) : null}

      {showOtpForm ? (
        <>
          <p className="text-green-700 font-medium text-center my-6">
            We have sent a code to your phone. Please enter the code below.
          </p>
          <div className="md:flex justify-center w-full">
            <div className="md:w-3/5 px-3 ">
              <input
                name="otp"
                onInput={_handleUserOtpInput}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                placeholder="Enter the OTP sent to your phone..."
              />
            </div>
            <button
              onClick={submitRepayment}
              disabled={submitting}
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center my-3 md:my-0 ml-3"
              type="button"
            >
              <span> Confirm & Pay</span>
              {!submitting ? (
                <svg
                  className="ml-2"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="done_24px">
                    <path
                      id="icon/action/done_24px"
                      d="M6.5999 11.925L3.4499 8.775L2.3999 9.825L6.5999 14.025L15.5999 5.025L14.5499 3.975L6.5999 11.925Z"
                      fill="white"
                    />
                  </g>
                </svg>
              ) : (
                <img src="/img/25.gif" className="ml-2" alt="" />
              )}
            </button>
          </div>
          <div className="md:flex justify-center w-full my-4">
            <div className="md:w-3/5"></div>
            <button
              onClick={() => postOtpRequest()}
              disabled={submitting}
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center my-3 md:my-0 ml-3 md:ml-0"
              type="button"
            >
              <span> Resend OTP</span>
              {!submitting ? (
                <svg
                  className="ml-2"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="replay_24px">
                    <path
                      id="icon/av/replay_24px"
                      d="M12 6V2L7 7L12 12V8C15.31 8 18 10.69 18 14C18 17.31 15.31 20 12 20C8.69 20 6 17.31 6 14H4C4 18.42 7.58 22 12 22C16.42 22 20 18.42 20 14C20 9.58 16.42 6 12 6Z"
                      fill="white"
                    />
                  </g>
                </svg>
              ) : (
                <img src="/img/25.gif" className="ml-2" alt="" />
              )}
            </button>
          </div>
        </>
      ) : null}

      {showCardsList && cardsReponse?.length > 0 ? (
        <>
          <div className="w-11/12 m-auto">
            <div className="w-9/12 m-auto mt-4">
              <h3 className="text-md md:text-xl text-gray-700 text-left font-semibold mb-4">
                Select your card:
              </h3>
            </div>
            <div className="relative w-9/12 m-auto">
              <svg
                className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                />
              </svg>
              <select
                className="w-full border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none m-auto"
                onChange={(e) => _handleCardSelection(e.target.value)}
              >
                <option value="">-- Select a card --</option>
                {cardsReponse &&
                  cardsReponse.map((card, key) => {
                    return (
                      <option key={key} value={card.id}>
                        XXXX-{card.last4} - Exp: {card.exp_month}/
                        {card.exp_year.slice(-2)} ({card.card_type.trim()})
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="w-full m-auto mt-10">
              <button
                disabled={selectedCard ? false : true}
                onClick={_handleAuthorizeToPay}
                className={
                  !selectedCard
                    ? "flex w-2/4 md:w-1/4 text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-gray-200 rounded-md m-auto cursor-not-allowed"
                    : "flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-green-600 hover:bg-green-700 rounded-md m-auto transition-colors duration-150 ease-in-out"
                }
              >
                <span className="text-sm xl:text-lg lg:text-sm pr-2">
                  Proceed
                </span>
                <img src="/img/chevron-right.svg" className="w-5 pt-1" alt="" />
              </button>
            </div>
          </div>
        </>
      ) : showCardsList && cardsReponse?.length === 0 ? (
        <>
          <div className="w-full m-auto mb-6">
            <img
              src="/img/check-files.svg"
              alt=""
              className="w-3/4 md:w-2/4 m-auto opacity-50"
            />
          </div>
          <div className="w-3/4 m-auto">
            <p className="text-gray-700 font-medium text-center">
              We found no cards on your profile. Please add a card!
            </p>
          </div>
          <div className="flex justify-center items-center h-16 my-2 md:my-6">
            <button
              className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
              onClick={goToAddCard}
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
              <div className="ml-2 text-blue-700 text-md">Add Card</div>
            </button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default withRouter(PayWithExistingCard);
