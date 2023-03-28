import React, { useState, useEffect, useCallback } from "react";
import OnboardingSideBar from "../components/OnboardingSideBar";
import { useForm, Controller } from "react-hook-form";

import { useQuery } from "react-query";

import useProfileStore from "../stores/profileStore";
import useAuthStore from "../stores/authStore";
import {
  getAccountFields,
  sendAccounts,
  validateAccounts,
  getProfileSection,
} from "../clients/onboarding";
import FormInput from "../components/FormInput";
import { getPersonalDetails } from "../clients/profile";

const AccountDetails = (props: any) => {
  let pageType = "profile";

  if (props.location.pathname.includes("/onboarding")) {
    pageType = "onboarding";
  }

  const [accountName, setAccountName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const profile = useProfileStore((state) => state.data);
  const [hideValidate, setHideValidate] = useState(false);
  const [banks, setBanks] = useState([] as any);
  const token = useAuthStore((state) => state.accessToken);
  const [readonlyValue, setReadonlyValue] = useState(false);
  const { isLoading, error, data } = useQuery("account", () =>
    getAccountFields(token)
  );

  const { register, handleSubmit, errors, control, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const getUpdatedProfile = async () => {
    let getProfile = await getPersonalDetails(token);
    initializeProfileStore(getProfile.data);
  };

  useEffect(() => {
    getUpdatedProfile();
  }, []);

  const initializeProfileStore = useProfileStore(
    useCallback((state) => state.initialize, [])
  );

  const initializeProfileSection = useProfileStore(
    useCallback((state) => state.initializeProfileSection, [])
  );

  const {
    isLoading: isLoading2,
    error: error2,
    data: accountDetails,
    refetch,
  } = useQuery("AccountSections", () => getProfileSection(token));

  useEffect(() => {
    accountDetails &&
      initializeProfileSection(
        [].concat(accountDetails),
        accountDetails.every((loan) => loan.completed === true)
      );
  }, [accountDetails, initializeProfileSection]);

  useEffect(() => {
    const result = profile; // result: { firstName: 'test', lastName: 'test2' }
    reset(result); // asynchronously reset your form values
  }, [reset]);

  useEffect(() => {
    let getBanks = data && data.filter((val) => val.name === "bank");
    setBanks(getBanks && getBanks[0]["options"]);
  }, [data]);

  if (isLoading || isLoading2) {
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

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const toggleInput = () => {
    setReadonlyValue((prev) => !prev);
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      const { message, data, success } = await validateAccounts(token, values);
      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      setBankCode(values.bank_code);
      setBankAccount(values.account_number);
      // setSubmitted(true);
      setLoading(false);
      setErrorMsg([]);
      setHideValidate(true);
      setAccountName((prev) => data.account_name);
      // let data = postData;
    } catch (error) {
      setLoading(false);
      if (error && error.response.status == 500) {
        let msg = [] as any;
        msg.push(error.response.data.message);
        setErrorMsg(msg);
        return;
      }
      if (!error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
        setErrorMsg(msg);
        return;
      }
      const {
        response: { data },
      } = error;
      console.log(data.errors);
      data.errors && updateErrors(data.errors);
    }
  };

  const validateAccount = async () => {
    let values = {
      bank: bankCode,
      bank_account_no: bankAccount,
    };
    setLoading2(true);
    try {
      let postData = await sendAccounts(token, values);
      setSubmitted(true);
      const { data } = postData;
      initializeProfileStore(data);
      setTimeout(function () {
        setSubmitted(false);
        setLoading(false);
        refetch();
        pageType === "onboarding"
          ? props.history.push("/onboarding/statement_validation")
          : props.history.replace("/profile/account");
      }, 2000);
      setErrorMsg([]);
    } catch (error) {
      setLoading2(false);
      if (error && error.response.status == 500) {
        let msg = [] as any;
        msg.push(error.response.data.message);
        setErrorMsg(msg);
        return;
      }
      if (!error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
        setErrorMsg(msg);
        return;
      }
      const {
        response: { data },
      } = error;
      data.errors && updateErrors(data.errors);
    }
  };

  const changeValue = (e) => {
    setBankAccount(e.target.value);
  };

  return (
    <>
      <div className="hidden md:block w-5/12 mb-6 border-r-2 border-gray-200">
        <OnboardingSideBar name="account" />
        <img src="/img/checklists.svg" alt="" className="w-1/4 m-auto pt-16" />
      </div>

      <div className="md:w-7/12 w-full mb-6 px-8 relative">
        <h1 className="block text-gray-700 text-lg font-bold mb-2">
          ACCOUNT DETAILS
        </h1>
        {errorMsg.length ? (
          <div
            className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md my-5"
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
        {/* <h3 className="text-gray-600 text-sm"> We hate to ask, but regulations mandate us to. <br/> Your BVN is safe with us!</h3> */}
        {submitted ? (
          <>
            <div
              className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
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
                  <p className="font-bold">Sent successfully</p>
                  <p className="text-sm">
                    Account details created successfully
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap -mx-3 mb-6">
                {/* {data &&
                  data.map((data, key) => {
                    return (
                      <FormInput
                        key={key}
                        label={data.label}
                        name={data.name}
                        required={data.required}
                        errors={errors}
                        register={register}
                        type={data.type}
                        options={data.options}
                        value={profile[data.name]}
                        Controller
                        control
                        readonly={data.readonly}
                        readonlyValue={readonlyValue}
                        toggleInput={toggleInput}
                      />
                    );
                  })} */}
                <div className="w-full md:w-1/2 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Bank
                  </label>
                  {/* <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    ref={register({ required: true })}
                    name="bank"
                  />
                  {errors.bank && errors.bank.type === "required" && (
                    <p className="text-red-500 text-xs italic">
                      Please fill out this field.
                    </p>
                  )} */}
                  <div className="relative">
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      name="bank_code"
                      ref={register({ required: true })}
                    >
                      <option value="">- Select -</option>
                      {banks &&
                        banks.map((option, key) => {
                          return (
                            <option key={key} value={option.value}>
                              {option.label}
                            </option>
                          );
                        })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 ">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Account No.
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    ref={register({ required: true })}
                    name="account_number"
                    onChange={(e) => changeValue(e)}
                  />
                  {errors.account_number &&
                    errors.account_number.type === "required" && (
                      <p className="text-red-500 text-xs italic">
                        Please fill out this field.
                      </p>
                    )}
                </div>
                {accountName ? (
                  <div className="w-full md:w-4/5 px-3 mb-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Account Name.
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      disabled
                      value={accountName}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="flex items-center justify-between mb-16">
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm md:text-lg font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center shadow-lg"
                  type="submit"
                  // onClick={() => validateAccount()}
                >
                  <span> Validate Account </span>
                  {!loading ? (
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
                {hideValidate ? (
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white text-lg md:text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center shadow-lg"
                    type="button"
                    onClick={() => validateAccount()}
                  >
                    <span> Submit </span>
                    {!loading2 ? (
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
                ) : (
                  ""
                )}
              </div>
            </form>
          </>
        )}

        <div className="flex justify-end w-full pr-0 md:pr-4 mt-10">
          <div className="inline-flex justify-end">
            <button
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/employment")
                  : props.history.push("/profile/employment")
              }
              className="bg-gray-500 hover:bg-gray-600 text-white text-md md:text-xl font-light py-2 px-6 md:py-3 md:px-8 rounded-l focus:outline-none focus:shadow-outline inline-flex items-center"
              type="button"
            >
              <svg
                className="mr-2 -mt-1"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="chevron_right_24px">
                  <path
                    id="icon/navigation/chevron_left_24px"
                    d="M15.705 16.59L11.125 12L15.705 7.41L14.295 6L8.29498 12L14.295 18L15.705 16.59Z"
                    fill="white"
                  />
                </g>
              </svg>
              <span> Previous </span>
            </button>

            <button
              disabled={!submitted}
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/statement_validation")
                  : props.history.push("/profile/statement_validation")
              }
              className={
                submitted
                  ? "bg-green-600 hover:bg-green-700 text-white text-md md:text-xl font-light py-2 px-6 md:py-3 md:px-8 rounded-r focus:outline-none focus:shadow-outline inline-flex items-center"
                  : "bg-gray-400 text-white text-md md:text-xl font-light py-2 px-6 md:py-3 md:px-8 rounded-r focus:outline-none focus:shadow-outline inline-flex items-center cursor-not-allowed"
              }
              type="button"
            >
              <span> Next </span>
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

        {/* <div className="absolute bottom-0 right-0 mr-10 -mt-8">
          <button
            disabled={!submitted}
            onClick={() => props.history.push("/onboarding/identification")}
            className="bg-gray-400 hover:bg-gray-600 text-white text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center"
            type="button"
          >
            <span> Next </span>
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
        </div> */}
      </div>
    </>
  );
};

export default AccountDetails;
