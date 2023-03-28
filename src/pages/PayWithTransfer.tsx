import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import {
  requestVirtualAccount,
  processVirtualAccountPayment,
} from "../clients/payments";
import useProfileStore from "../stores/profileStore";

const PayWithTransfer = (props: any) => {
  const token = useAuthStore((state) => state.accessToken);
  const profile: any = useProfileStore(useCallback((state) => state.data, []));
  const [isLoading, setLoading] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [virtualAccountData, setVirtualAccountData]: any = useState({});

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const amountToPay = props.amount ? Number(props.amount) * 100 : null;
  const loanId = props.loanId ? props.loanId : null;

  const fetchCustomerVirtualAccount = useCallback(async () => {
    setLoading(true);
    let values = {
      amount: amountToPay,
      customerEmail: profile.e_mail,
      customerName:
        profile?.first_name.charAt(0).toUpperCase() +
        profile?.first_name.slice(1)?.toLowerCase() +
        " " +
        profile?.surname.charAt(0).toUpperCase() +
        profile?.surname.slice(1)?.toLowerCase(),
      paymentDescription: "Payment with Providus Bank Account",
      item_id: loanId,
    };
    try {
      const { message, data, success, status } = await requestVirtualAccount(
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
      setVirtualAccountData(data);
      setLoading(false);
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
  }, [token]);

  useEffect(() => {
    fetchCustomerVirtualAccount();
  }, []);


  const postPaymentReference = async () => {
    setIsConfirmingPayment(true);
    let values = {
      // reference: referenceInput.replace(/\s+/g, ''),
      reference: virtualAccountData?.transactionReference,
    };
    try {
      const {
        message,
        data,
        success,
        status,
      } = await processVirtualAccountPayment(token, values);

      if (success === false || status === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setIsConfirmingPayment(false);
        return;
      }
      props.history.replace({
        pathname: "/pay/success",
        referrerData: {
          amount: amountToPay,
          loan_id: loanId,
        },
      })
      setIsConfirmingPayment(false);
    } catch (error) {
      setIsConfirmingPayment(false);
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

  if (isLoading || !profile.e_mail) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait while we fetch your payment profile.
          </h6>
        </div>
      </>
    );
  }

  if (isConfirmingPayment) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait while we verify your payment.
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
      {Object.entries(virtualAccountData).length > 0 ? (
        <>
          <div className="flex flex-col bg-white px-8 py-6 max-w-sm mx-auto rounded-lg shadow-lg border-2 border-gray-400">
            <h1 className="block text-blue-800 text-lg font-bold mb-6 fade-in">
              Account to pay into:
            </h1>
            <table className="table-fixed w-full mb-8 fade-in">
              <tbody>
                <tr>
                  <td className="sm:w-8/12 w-1/2  py-1 text-sm md:text-md  font-normal text-gray-700">
                    ACCOUNT NUMBER:
                  </td>
                  <td className="sm:w-4/12 w-1/2 px-2 py-1 text-sm md:text-md text-right font-bold text-gray-700">
                    {virtualAccountData?.accountNumber}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-8/12 w-1/2  py-1 text-sm md:text-md  font-normal text-gray-700">
                    ACCOUNT NAME:
                  </td>
                  <td className="sm:w-4/12 w-1/2 px-2 py-1 text-sm md:text-md text-right font-bold text-gray-700">
                    {virtualAccountData?.accountName}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-8/12 w-1/2  py-1 text-sm md:text-md font-normal text-gray-700">
                    BANK NAME:
                  </td>
                  <td className="sm:w-4/12 w-1/2 px-2 py-1 text-sm md:text-md text-right font-bold text-gray-700">
                    {virtualAccountData?.bankName}
                  </td>
                </tr>
                <tr>
                  <td className="sm:w-8/12 w-1/2  py-2 text-sm md:text-md font-bold text-gray-700">
                    AMOUNT TO PAY:
                  </td>
                  <td className="w-4/12 px-2 py-1 text-sm md:text-md text-right font-normal text-gray-700">
                    <span className="text-green-600 font-bold">
                      ₦
                      {(
                        Number(virtualAccountData.totalPayable) / 100
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => postPaymentReference()}
              className="w-full py-3 px-6 mt-10 bg-green-700 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-green-600 hover:shadow-none"
            >
              I HAVE MADE THE PAYMENT
            </button>
            <button
              onClick={() => props.history.goBack()}
              className="w-full py-3 px-6 mt-5 bg-gray-800 rounded-sm
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
            >
              CANCEL
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col bg-white px-8 py-6 max-w-sm mx-auto rounded-lg shadow-lg border-2 border-gray-400">
          <h5 className="text-md font-normal text-gray-700">
            Bank account unavailable.
          </h5>
        </div>
      )}
    </>
  );
};
export default withRouter(PayWithTransfer);
