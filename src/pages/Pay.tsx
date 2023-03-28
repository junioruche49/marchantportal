import React, { useState } from "react";
import PayWithCard from "./PayWithCard";
import { useParams } from "react-router-dom";
import PayWithTransfer from "./PayWithTransfer";

const Pay = () => {
  const [selectedMethod, setSelectedMethod] = useState();
  const [amountInput, setAmountInput] = useState();
  const [isAmountSet, setIsAmountSet] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  let { loanId } = useParams();

  const _handleSelectedMethod = (method) => {
    setSelectedMethod(getSelectedMethodData(method));
  };

  const getSelectedMethodData = (method) => {
    switch (method) {
      case "bank":
        return {
          tag: "bank",
          name: "Bank (Coming soon)",
        };
      case "card":
        return {
          tag: "card",
          name: "Card",
        };
      case "transfer":
        return {
          tag: "transfer",
          name: "E-Transfer",
        };
      default:
        return {};
    }
  };

  const _handleAmountInput = (e) => {
    if (Number(e.target.value) >= 100) {
      setAmountInput(Number(e.target.value));
      setIsAmountSet(true);
    } else {
      setAmountInput(null);
      setIsAmountSet(false);
    }
  };

  const _loadPaymentMethods = () => {
    setShowPaymentMethods(true);
  };

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
            <div className="relative w-11/12 bg-white rounded py-20 mb-20 m-auto md:m-0 mt-12 md:mt-0 shadow-xl px-6">
              {/* Check if Amount has been set. If yes, show available payment methods. If not, display amount field */}
              {!showPaymentMethods ? (
                <div className="mt-2 flex flex-col lg:w-1/2 w-full m-auto">
                  <div className="w-full m-auto mb-6">
                    <img
                      src="/img/make-payment.svg"
                      alt=""
                      className="w-3/4 m-auto"
                    />
                  </div>
                  <h3 className="text-lg md:text-2xl text-gray-600 text-center font-bold m-auto mb-10">
                    How much would you like to pay?
                  </h3>
                  <div className="flex flex-wrap items-stretch w-full mb-4 relative h-15 bg-white items-center border border-green-300 rounded rounded-r-lg mb-6 pr-10">
                    <div className="flex -mr-px justify-center bg-green-100 rounded-l-lg w-15 p-4">
                      <span className="flex items-center leading-normal px-3 border-0 rounded rounded-r-none text-md md:text-xl text-green-500">
                        ₦
                      </span>
                    </div>
                    <input
                      type="number"
                      className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 border-grey-light rounded rounded-l-none px-3 self-center relative  font-roboto text-sm md:text-lg outline-none text-green-600 font-semibold"
                      placeholder="₦100 minimum"
                      onInput={_handleAmountInput}
                      min={100}
                    />
                  </div>
                  <button
                    onClick={_loadPaymentMethods}
                    disabled={!!!isAmountSet}
                    className={
                      !isAmountSet
                        ? "bg-gray-100 text-white text-md font-semibold py-4 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center my-3 md:my-0 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-800 text-white text-md font-semibold py-4 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center my-3 md:my-0"
                    }
                    type="button"
                  >
                    <span> Continue </span>

                    <svg
                      className="ml-2 -mt-1"
                      width="18"
                      height="18"
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
                // Amount has been set, now show the available payment methods
                <>
                  <h3 className="text-lg md:text-2xl text-blue-700 text-center font-bold m-auto mb-10">
                    {selectedMethod
                      ? "You have chosen to pay with - " + selectedMethod?.name
                      : "How would you like to pay?"}
                  </h3>
                  {selectedMethod?.tag === "card" ? (
                    <PayWithCard amount={amountInput} loanId={loanId} />
                  ) : selectedMethod?.tag === "transfer" ? (
                    <PayWithTransfer amount={amountInput} loanId={loanId}/>
                  ) : (
                    <div className="mb-6 m-auto px-20 -mx-2">
                      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-auto">
                        <div
                          className="hover:bg-gray-100 rounded-lg px-6 md:px-12 py-3 md:py-6 shadow-lg border transition duration-300 ease-in-out cursor-pointer fade-in"
                          onClick={() => _handleSelectedMethod("bank")}
                        >
                          <div className="bg-gray-200 p-6 md:p-10 w-20 md:w-40 h-20 md:h-40 rounded-full m-auto">
                            <img
                              className="w-full m-auto"
                              src="/img/pay-with-bank.svg"
                              alt=""
                            />
                          </div>
                          <div className="px-6 py-4">
                            <div className="font-semibold text-center text-gray-700 text-xl mb-2">
                              Bank
                            </div>
                            <div className="font-base text-center text-gray-600 text-sm mb-2">
                              (Coming soon)
                            </div>
                          </div>
                        </div>
                        <div
                          className="bg-blue-500 hover:bg-blue-600 rounded-lg px-6 md:px-12 py-3 md:py-6 shadow-lg border transition duration-300 ease-in-out cursor-pointer hover:animate-bounce fade-in-2s"
                          onClick={() => _handleSelectedMethod("card")}
                        >
                          <div className="bg-gray-200 p-6 md:p-10 w-20 md:w-40 h-20 md:h-40 rounded-full m-auto">
                            <img
                              className="w-full m-auto"
                              src="/img/pay-with-card.svg"
                              alt=""
                            />
                          </div>
                          <div className="px-6 py-4">
                            <div className="font-semibold text-white text-center text-xl mb-2">
                              Card
                            </div>
                          </div>
                        </div>
                        <div
                          className="hover:bg-gray-100 rounded-lg px-6 md:px-12 py-3 md:py-6 shadow-lg border transition duration-300 ease-in-out cursor-pointer fade-in-3s"
                          onClick={() => _handleSelectedMethod("transfer")}
                        >
                          <div className="bg-gray-200 p-6 md:p-10 w-20 md:w-40 h-20 md:h-40 rounded-full m-auto">
                            <img
                              className="w-full m-auto"
                              src="/img/pay-with-transfer.svg"
                              alt=""
                            />
                          </div>
                          <div className="px-6 py-4">
                            <div className="font-semibold text-center text-gray-700 text-xl mb-2">
                              E-Transfer
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Pay;
