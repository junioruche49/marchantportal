import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { withRouter } from "react-router";
import OnboardingSideBar from "../components/OnboardingSideBar";
import { useForm } from "react-hook-form";

import useProfileStore from "../stores/profileStore";

import {
  resolveBvn,
  getBvnDetailsFields,
  completeResolveBVN,
} from "../clients/onboarding";
import useAuthStore from "../stores/authStore";
import FormInput from "../components/FormInput";

const Bvn = (props: any) => {
  let pageType = "profile";

  if (props.location.pathname.includes("/onboarding")) {
    pageType = "onboarding";
  }

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const profile = useProfileStore((state) => state.data);
  const [displayMsg, setDisplayMsg] = useState("");
  const [bvnNumber, setBvnNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState([]);
  const [otpMsg, setOtpMsg] = useState(null);
  const [userInput, setUserInput] = useState(null);
  const [otpRequestId, setOtpRequestId] = useState(null);
  const [bvnDisabled, setBvnDisabled] = useState(false);
  const [bvnVerification, setBvnVerification] = useState(false);
  const token = useAuthStore((state) => state.accessToken);

  const { isLoading, error, data, refetch } = useQuery("data", () =>
    getBvnDetailsFields(token)
  );

  if (data && data[0].completed) {
    pageType === "onboarding"
      ? props.history.replace("/onboarding/personal")
      : props.history.replace("/profile/personal");
  }

  const { register, setValue, handleSubmit, errors } = useForm();

  if (isLoading) {
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

  const onOtpSubmit = async () => {
    setErrorMsg([]);
    setLoading(true);
    try {
      let otp = {};
      otp["otp"] = userInput;
      otp["requestid"] = otpRequestId;
      otp["user_id"] = profile["user_id"];
      const { message, data, success } = await completeResolveBVN(token, otp);

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      setErrorMsg([]);
      setOtpMsg(message);
      setTimeout(function () {
        setLoading(false);
        refetch();
        pageType === "onboarding"
          ? props.history.push("/onboarding/personal")
          : props.history.push("/profile/personal");
      }, 2000);
      setLoading(false);
      setBvnVerification(true);
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
      // setErrorMsg(JSON.stringify(error.response.data.errors.otp[0]));
      setLoading(false);
    }
  };

  const setUsersInput = (e: any) => {
    setUserInput(e.target.value);
  };

  const onSubmit = async (datas: any) => {
    setLoading(true);
    setErrorMsg([]);

    try {
      let values = datas;
      values.user_id = profile["user_id"];
      setBvnNumber(datas.bvn);
      let postData = await resolveBvn(token, values);
      const { message, data, success } = postData;

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }

      let mobile = data.mobile.split("");
      let phone = ", xxx-xxx-xxx-" + mobile[9] + mobile[10];
      let Displaymessage = message + " " + phone;

      setOtpRequestId(data.otprequestid);
      setLoading(false);
      setDisplayMsg(Displaymessage);
      setBvnDisabled(true);
    } catch (error) {
      // let msg = [] as any;
      //   msg.push(error.response.data.message);
      // setErrorMsg(msg);
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
      setLoading(false);
    }
  };
  // console.log(errorMsg);

  const resendOtp = async (datas: any) => {
    setLoading2(true);
    setErrorMsg([]);

    try {
      let values = datas;
      values.user_id = profile["user_id"];
      setBvnNumber(datas.bvn);
      let postData = await resolveBvn(token, values);
      const { message, data, success } = postData;

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading2(false);
        return;
      }

      let mobile = data.mobile.split("");
      let phone = ", xxx-xxx-xxx-" + mobile[9] + mobile[10];
      let Displaymessage = message + " " + phone;

      setOtpRequestId(data.otprequestid);
      setLoading2(false);
      setDisplayMsg(Displaymessage);
      setBvnDisabled(true);
    } catch (error) {
      // let msg = [] as any;
      //   msg.push(error.response.data.message);
      // setErrorMsg(msg);
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
      console.log(data.errors);
      data.errors && updateErrors(data.errors);
      setLoading2(false);
    }
  };

  return (
    <>
      <div className="hidden md:block w-5/12 mb-6 border-r-2 border-gray-200">
        <OnboardingSideBar name="bvn" />
      </div>

      <div className="w-full md:w-7/12 mb-6 px-8 relative">
        <h1 className="block text-gray-700 text-lg font-bold mb-2">
          BVN DETAILS
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
        {otpMsg ? (
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
                <p className="text-sm">{otpMsg}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h3
              className={
                displayMsg
                  ? "text-green-700 text-sm font-semibold"
                  : "text-gray-600 text-sm"
              }
            >
              {displayMsg
                ? displayMsg
                : "We hate to ask, but regulations mandate us to.\n Your BVN is safe with us!"}{" "}
            </h3>
            <form className="rounded pt-10" onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full -mx-3 mb-6">
                <div className="flex flex-wrap ">
                  <div className="md:w-3/5 px-3 mb-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Bank Verification No. (BVN)
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="number"
                      ref={register({ required: true, minLength: 11 })}
                      name="bvn"
                      disabled={bvnDisabled}
                    />
                    {errors.bvn && errors.bvn.type === "required" && (
                      <p className="text-red-500 text-xs italic">
                        Please fill out this field.
                      </p>
                    )}
                    {errors.bvn && errors.bvn.type === "minLength" && (
                      <p className="text-red-500 text-xs italic">
                        Minimum BVN length is 11.
                      </p>
                    )}
                  </div>
                  {/* {data &&
                    data.map((data, key) => {
                      return (
                        <FormInput
                          key={key}
                          label="Bank Verification No. (BVN)"
                          name="bvn"
                          required={data.required}
                          errors={errors}
                          register={register}
                          type={data.type}
                          options={data.options}
                          value={null}
                        />
                      );
                    })} */}
                  {!displayMsg ? (
                    <div className=" mb-24 mt-6 bottom-40 ">
                      <button
                        disabled={loading}
                        className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                        type="submit"
                      >
                        <span> Verify BVN </span>
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
                    </div>
                  ) : (
                    <div className=" mb-24 mt-6">
                      <button
                        onClick={() => resendOtp({ bvn: bvnNumber })}
                        disabled={loading2}
                        className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                        type="button"
                      >
                        <span> Resend OTP </span>
                        {!loading2 ? (
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
                  )}
                </div>

                {displayMsg ? (
                  <div className="flex flex-wrap w-full">
                    <div className="md:w-3/5 px-3 ">
                      <input
                        name="otp"
                        onInput={setUsersInput}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        placeholder="Enter the OTP sent to your phone..."
                      />
                    </div>
                    <div className="flex items-center justify-between  ">
                      <button
                        onClick={onOtpSubmit}
                        disabled={loading}
                        className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                        type="button"
                      >
                        <span> Validate OTP</span>
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
                      {/* <button
                        onClick={onOtpSubmit}
                        className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                        type="button"
                      >
                        <span> Resend OTP</span>
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
                      </button> */}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </form>
          </>
        )}

        <div className="flex justify-end w-full pr-0 md:pr-4 mt-10">
          <div className="inline-flex justify-end">
            {/* <button
              onClick={() => props.history.goBack()}
              className="bg-gray-500 hover:bg-gray-600 text-white text-xl font-light py-3 px-8 rounded-l focus:outline-none focus:shadow-outline inline-flex items-center" 
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
            </button> */}

            <button
              disabled={!bvnVerification}
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/personal")
                  : props.history.push("/profile/personal")
              }
              className={
                bvnVerification
                  ? "bg-green-600 hover:bg-green-700 text-md md:text-xl font-light py-3 px-6 md:py-3 md:px-8 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
                  : "bg-gray-400 text-md md:text-xl font-light py-3 px-6 md:py-3 md:px-8 rounded-r focus:outline-none focus:shadow-outline inline-flex items-center cursor-not-allowed"
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
        {/* <div className="absolute bottom-0 right-0 mr-16 mt-10">
          <button
            disabled={!bvnVerification}
            onClick={() => props.history.push("/onboarding/personal")}
            className={bvnVerification ? "bg-green-400 hover:bg-green-600 text-white text-xl font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center" : "bg-gray-400 text-white text-xl font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center cursor-not-allowed"}
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

export default withRouter(Bvn);
