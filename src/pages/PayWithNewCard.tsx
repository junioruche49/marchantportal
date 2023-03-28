import React, { useState, useCallback, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { withRouter } from "react-router-dom";
import { PaystackConsumer } from "react-paystack";

const PayWithNewCard = (props: any) => {
  const [isLoading, setLoading] = useState(false);
  const profile: any = useProfileStore(useCallback((state) => state.data, []));

  const amountToPay = props.amount ? Number(props.amount) * 100 : null;
  const loanId = props.loanId ? props.loanId : null;


  const _handlePrematurePaymentModalClose = () => {
    props.history.goBack();
  };

  const psConfig = {
    reference: new Date().getTime().toString(),
    email: profile.e_mail,
    amount: Number(amountToPay),
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ?? "",
  };

  const componentProps = {
    ...psConfig,
    text: "Proceed to pay",
    onSuccess: (transaction) => {
      props.history.replace({
        pathname: "/pay/process",
        referrerData: {
          amount: Number(amountToPay),
          payment_type: 2,
          item_id: loanId,
          reference: transaction.reference,
        },
      });
    },
    onClose: _handlePrematurePaymentModalClose,
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
      <PaystackConsumer {...componentProps}>
        {({ initializePayment }) => (
          <>
            {initializePayment()}
          </>
        )}
      </PaystackConsumer>
      <div className="w-11/12 bg-white rounded py-6 md:py-12 border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0">
        <h3 className="block text-green-600 text-sm md:text-lg font-semibold mb-6 fade-in text-center">
          Communicating with the payment gateway...
        </h3>
      </div>
    </>
  );
};

export default withRouter(PayWithNewCard);
