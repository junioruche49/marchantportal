import React, { useState, useCallback } from "react";
import MyCards from "./MyCards";
import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { getCards } from "../clients/cards";
import { withRouter } from "react-router-dom";
import PayWithExistingCard from "./PayWithExistingCard";
import PayWithNewCard from "./PayWithNewCard";

const PayWithCard = (props: any) => {
  const amountToPay = props.amount ? props.amount : null;
  const loanId = props.loanId ? props.loanId : null;
  const [isLoading, setLoading] = useState(false);

  const profile: any = useProfileStore(useCallback((state) => state.data, []));
  const [responseData, setResponse]: any = useState();
  const [responseMessage, setResponseMessage]: any = useState(null);
  const [showCardsList, setShowCardsList]: any = useState(false);
  const [launchInitializaPayment, setLaunchInitializePayment] = useState(false);

  const [errorMsg, setErrorMsg] = useState([]);

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const _handlePayWithExistingCard = () => {
    setShowCardsList(true);
  };


  const _handlePayWithNewCard = () => {
    setLaunchInitializePayment(true);
  };

  if (isLoading || !profile.e_mail) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait while we process your request...
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
            Ooops! The system was unable to capture one or more of your payment data. Please try
            again!
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
      {responseMessage && responseData?.length > 0 ? (
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
      ) : null}

      {!showCardsList && !launchInitializaPayment ? (
        <div className="md:flex w-11/12 m-auto">
          <div
            className="flex justify-between items-center w-full md:w-1/2 h-28 p-4 my-6 mr-2 hover:bg-green-100 rounded-lg border border-blue-300 shadow-md cursor-pointer transition duration-300 ease-in-out fadeInUp"
            onClick={_handlePayWithExistingCard}
          >
            <div className="flex items-center">
              <img
                className="rounded-lg h-12 w-12"
                src="/img/new-card.svg"
                alt="Saved cards"
              />
              <div className="ml-4">
                <div className="text-sm font-semibold text-gray-600">
                  Use Existing Card
                </div>
                <div className="text-sm font-light text-gray-500">
                  Pay with any of your previously saved cards.
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full md:w-1/2 h-28 p-4 my-6 mr-2 hover:bg-green-100 rounded-lg border border-blue-300 shadow-md cursor-pointer transition duration-300 ease-in-out fadeInUp" onClick={_handlePayWithNewCard}>
            <div className="flex items-center">
              <img
                className="rounded-lg h-12 w-12"
                src="/img/saved-cards.svg"
                alt="New card"
              />
              <div className="ml-4">
                <div className="text-sm font-semibold text-gray-600">
                  New Card
                </div>
                <div className="text-sm font-light text-gray-500">
                  Pay with a new card
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showCardsList ? <PayWithExistingCard amount={amountToPay} loanId={loanId} /> : null}
      {launchInitializaPayment ? <PayWithNewCard amount={amountToPay} loanId={loanId}/> : null}
    </>
  );
};

export default withRouter(PayWithCard);
