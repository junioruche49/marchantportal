import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router";

import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { useQuery } from "react-query";
import {
  getProfileSection,
  postAccountStatementCode,
} from "../clients/onboarding";
import { getProducts } from "../clients/products";
import InputRange, { Range } from "react-input-range";
import "react-input-range/lib/css/index.css";
import { cardCheck } from "../clients/cards";
import MonoConnect from "@mono.co/connect.js";
import { getLoanSetup } from "../clients/loan";

const NewLoanRequest = (props: any) => {
  const profile: any = useProfileStore(useCallback((state) => state.data, []));

  const [selectedProduct, setSelectedProduct] = useState<any>();

  const [loanAmount, setLoanAmount] = useState<number | Range>(0);

  const [noOfRepayments, setNoOfRepayments] = useState<number | Range>(0);
  const token = useAuthStore((state) => state.accessToken);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isAccountStatementLoading, setAccountStatementLoading] = useState(
    false
  );
  const [cardListResponse, setCardListResponse]: any = useState();
  const [isStatementView, setStatementView] = useState(false);
  const [isStatementComplete, setStatementComplete] = useState(false);
  const [shouldApply, setShouldApply] = useState(false);
  const [nextStage, setNextStage]: any = useState();

  const {
    isLoading: isLoading2,
    error: error2,
    data: data2,
  } = useQuery("sections", () => getProfileSection(token));

  const [errorMsg, setErrorMsg] = useState([]);

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const checkCustomerCards = useCallback(async () => {
    let values = {
      email: profile.e_mail,
    };
    setIsCardLoading(true);
    try {
      const {
        message: cardListMessage,
        data: cardListData,
        status: cardListStatus,
      } = await cardCheck(token, values);

      if (cardListStatus === false) {
        let msg = [] as any;
        msg.push(cardListMessage);
        setErrorMsg(msg);
        setIsCardLoading(false);
        return;
      }
      setCardListResponse(cardListData);
      setErrorMsg([]);
      setIsCardLoading(false);
    } catch (error) {
      setIsCardLoading(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push(
          "Fatal Error! Please check your network connection or kindly logout and login again."
        );
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
    if (profile && profile.e_mail) checkCustomerCards();
  }, [profile]);

  const checklist = data2 ? data2 : [];

  const checklistCompletion = checklist.every(
    (loan) => loan.completed === true
  );

  const getLastSection = () => {
    let minSection = 0;
    let name = "";
    checklist &&
      checklist.map((data: any) => {
        if (data.completed === false) {
          if (minSection === 0) {
            minSection = data.sequence;
            name = data.name;
          } else {
            if (data.sequence < minSection) {
              minSection = data.sequence;
              name = data.name;
            }
          }
        }
      });
    return name;
  };

  const { isLoading, error, data } = useQuery("products", () =>
    getProducts(token)
  );

  // Fetch loan setup. To be used to determine what stage and what the Apply button does on loan request form
  const {
    isLoading: isLoanSetupLoading,
    error: loanSetupError,
    data: loanSetupData,
  } = useQuery("loanSetup", () => getLoanSetup(token), {retry: 2});

  // From loan setup, set the next stage after clicking Apply button
  const _checkLoanSetupData = () => {
    if (loanSetupData?.require_statement_on_loan_req) {
      _handleNextStage(1);
    } else {
      props.history.replace({
        pathname: "/loan-schedule",
        loanData: {
          loan_amount: loanAmount,
          no_of_repayments: noOfRepayments,
          ...selectedProduct,
        },
      });
    }
  };

  // Pass the stage into a state and use for dynamic views during render
  const _handleNextStage = (stage) => {
    if (stage === 1) {
      setNextStage(1);
    }
  };

  const _handleLoanAmountUpdate = (value: number | Range) => {
    setLoanAmount(Number(value));
  };

  const _handleRepaymentsUpdate = (value: number | Range) => {
    setNoOfRepayments(Number(value));
  };

  const _handleProductSelection = (productNo) => {
    let products: any[] | null = data?.data;

    if (!products) {
      return;
    }

    let product = products.find((prod) => prod.no === productNo);

    setSelectedProduct(product);

    setLoanAmount(product ? product.min_loan_amount : 0);
    setNoOfRepayments(product ? product.min_number_of_repayment : 0);
    setShouldApply(
      product &&
        Number(product.min_loan_amount) > 0 &&
        Number(product.min_number_of_repayment) > 0
    );
  };

  const _handleAccountStatementCode = useCallback(
    async (payload) => {
      const { code, loanAmount, noOfRepayments, selectedProduct } = payload;
      let values = { code: code };
      setAccountStatementLoading(true);
      try {
        const {
          message,
          data,
          success,
          status,
        } = await postAccountStatementCode(token, values);

        if (success === false || status === false) {
          let msg = [] as any;
          msg.push(message);
          setErrorMsg(msg);
          setAccountStatementLoading(false);
          return;
        }
        setAccountStatementLoading(true);
        props.history.replace({
          pathname: "/loan-schedule",
          loanData: {
            loan_amount: loanAmount,
            account_statement_code: code,
            no_of_repayments: noOfRepayments,
            ...selectedProduct,
          },
        });
        setAccountStatementLoading(false);
      } catch (error) {
        setAccountStatementLoading(false);
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
    },
    [token]
  );

  const monoConnect = React.useMemo(() => {
    const monoInstance = new MonoConnect({
      onSuccess: async ({ code }) =>
        await _handleAccountStatementCode({
          code,
          loanAmount,
          noOfRepayments,
          selectedProduct,
        }),
      key: process.env.REACT_APP_MONO_PUBLIC_KEY ?? "",
    });

    monoInstance.setup();

    return monoInstance;
  }, [
    loanAmount,
    noOfRepayments,
    selectedProduct,
    _handleAccountStatementCode,
  ]);

  if (
    isLoading ||
    !data ||
    isLoading2 ||
    !profile.e_mail ||
    isCardLoading ||
    cardListResponse === undefined ||
    isLoanSetupLoading ||
    isAccountStatementLoading
  ) {
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
      <main
        className={
          checklistCompletion ? "md:pl-12 loan-request-bg md:pb-32" : "md:pl-12"
        }
      >
        <div className="flex ">
          <div className="w-full ">
            <div className="flex items-center mt-10 lg:mt-0">
              <div className="w-8 h-1 bg-blue-700 rounded mr-3 hidden md:block"></div>
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-light md:font-semibold text-sm md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                New Loan
              </h4>
            </div>
            <br />

            <div className="w-11/12 flex justify-end items-center h-16 my-2 md:m-0 m-auto lg:hidden">
              <button
                className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={() => props.history.goBack()}
              >
                <div className="ml-2 text-blue-700 text-md">Go Back</div>
              </button>
            </div>

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

            {!checklistCompletion ? (
              <>
                <div className="relative w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
                  <div className="w-full m-auto mb-6">
                    <img
                      src="img/checklists.svg"
                      alt=""
                      className="w-2/4 md:w-1/4 m-auto"
                    />
                  </div>
                  <div className="w-3/4 md:w-2/4 m-auto">
                    <p className="text-gray-700 font-medium text-center">
                      Oops! Looks like you need to complete your profile before
                      we can disburse your money.
                    </p>
                  </div>
                  <div className="w-full m-auto mt-10">
                    <button
                      onClick={() => {
                        props.history.push("/onboarding/" + getLastSection());
                      }}
                      className="flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-green-600 hover:bg-green-700 rounded-md m-auto transition-colors duration-150 ease-in-out"
                    >
                      <span className="text-sm xl:text-lg lg:text-sm pr-2">
                        Okay, let's go!
                      </span>
                      <img
                        src="img/chevron-right.svg"
                        className="w-5 pt-1"
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </>
            ) : cardListResponse?.data?.cards === false ? (
              <>
                <div className="relative w-11/12 bg-white rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">
                  <div className="w-full m-auto mb-6">
                    <img
                      src="img/checklists.svg"
                      alt=""
                      className="w-2/4 md:w-1/4 m-auto"
                    />
                  </div>
                  <div className="w-3/4 md:w-2/4 m-auto">
                    <p className="text-gray-700 font-medium text-center">
                      One more thing! You need to have at least one debit card
                      on your profile before you can access a loan.
                    </p>
                  </div>
                  <div className="w-full m-auto mt-10">
                    <button
                      onClick={() => {
                        props.history.push("/cards/add");
                      }}
                      className="flex w-2/4 md:w-1/4 shadow-xl text-xl font-light text-white justify-center py-4 md:py-3 items-center bg-green-600 hover:bg-green-700 rounded-md m-auto transition-colors duration-150 ease-in-out"
                    >
                      <span className="text-sm xl:text-lg lg:text-sm pr-2">
                        Add a card now
                      </span>
                      <img
                        src="img/chevron-right.svg"
                        className="w-5 pt-1"
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <img
                  src="/img/new-loan-mobile-card-bg.svg"
                  alt=""
                  className="md:hidden absolute mobile-card-bg"
                />
                <div className="relative w-11/12 bg-white flex rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-b-8 mb-20 m-auto md:m-0 mt-12 md:mt-0 loan-calc-alt">
                  {/* Check if the user is to upload his account statement (stage 1), else show the loan application form. */}
                  {nextStage === 1 ? (
                    <div className="w-full m-auto max-w-lg">
                      <div className="w-11/12 md:w-full px-3 m-auto">
                        <h3 className="text-lg text-gray-700 text-center font-bold m-auto mb-10">
                          Aye! We need to know a little about your bank
                          transactions.
                        </h3>
                        <div className="flex flex-wrap -mx-3 mb-12">
                          <div className="w-full m-auto mb-6">
                            <img
                              src="/img/bank-statement.svg"
                              alt=""
                              className="w-2/4 md:w-1/4 m-auto"
                            />
                          </div>
                          <div className="w-full px-3 pt-4">
                            <label className="block tracking-wide text-center text-gray-600 text-xs font-semibold mb-10">
                              We work with Mono.co to get your valid bank
                              statement (with your permission of course). Please
                              click the button below to authenticate with Mono
                              before you can continue.
                            </label>
                            <div className="relative"></div>
                          </div>

                          <div className="w-full flex justify-center">
                            <div>
                              <button
                                onClick={() => monoConnect.open()}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline shadow-2xl hover:shadow-xl inline-flex items-center transition-colors duration-150 ease-in-out"
                              >
                                Authenticate with Mono
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <form className="w-full m-auto max-w-lg">
                        <div className="w-11/12 md:w-full px-3 m-auto">
                          <h3 className="md:hidden text-lg text-gray-700 text-center font-bold m-auto mb-10">
                            How much money do you want?
                          </h3>
                          <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-ful px-3">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Loan Type
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  id="grid-state"
                                  onChange={(e) =>
                                    _handleProductSelection(e.target.value)
                                  }
                                >
                                  <option value="">- Select -</option>
                                  {data?.data?.length > 0
                                    ? data.data.map((option, key) => {
                                        return (
                                          <option
                                            key={option.key}
                                            value={option.no}
                                          >
                                            {option.description}
                                          </option>
                                        );
                                      })
                                    : null}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                  <svg
                                    className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </div>
                              </div>
                              {selectedProduct ? (
                                <p className="text-gray-700 text-xs italic">
                                  <a
                                    href={selectedProduct.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="text-blue-500">
                                      {" "}
                                      Learn more
                                    </span>
                                  </a>{" "}
                                  about the selected loan type
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap -mx-3 mb-12">
                            <div className="w-full px-3 pt-4">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-10">
                                Amount
                              </label>
                              <div className="relative">
                                <InputRange
                                  formatLabel={(value) =>
                                    `₦` + Number(value).toLocaleString()
                                  }
                                  maxValue={
                                    selectedProduct
                                      ? Number(selectedProduct.max_loan_amount)
                                      : 0
                                  }
                                  minValue={
                                    selectedProduct
                                      ? Number(selectedProduct.min_loan_amount)
                                      : 0
                                  }
                                  step={1000}
                                  value={loanAmount}
                                  onChange={_handleLoanAmountUpdate}
                                  disabled={!!!selectedProduct}
                                  name="loan_amount"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap -mx-3 mb-12">
                            <div className="w-full px-3 pt-4">
                              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-10">
                                Duration
                              </label>
                              <div className="relative">
                                <InputRange
                                  formatLabel={(value) => value + " months"}
                                  maxValue={
                                    selectedProduct
                                      ? Number(
                                          selectedProduct.max_number_of_repayment
                                        )
                                      : 0
                                  }
                                  minValue={
                                    selectedProduct
                                      ? Number(
                                          selectedProduct.min_number_of_repayment
                                        )
                                      : 0
                                  }
                                  step={1}
                                  value={noOfRepayments}
                                  onChange={_handleRepaymentsUpdate}
                                  disabled={!!!selectedProduct}
                                  name="no_of_repayments"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <button
                              onClick={() => _checkLoanSetupData()}
                              className={
                                shouldApply
                                  ? "bg-green-600 hover:bg-green-700 text-white text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center transition-colors duration-150 ease-in-out"
                                  : "bg-gray-300 text-white text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center cursor-not-allowed"
                              }
                              disabled={!shouldApply}
                              type="button"
                            >
                              <span> Apply! </span>
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
                        </div>
                      </form>
                    </>
                  )}
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

export default withRouter(NewLoanRequest);
