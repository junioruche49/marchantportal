import React, { useState, useEffect, useCallback } from "react";
import OnboardingSideBar from "../components/OnboardingSideBar";
import { useForm, Controller } from "react-hook-form";

import { useQuery } from "react-query";

import useProfileStore from "../stores/profileStore";
import useAuthStore from "../stores/authStore";
import {
  getEmploymentFields,
  patchRequest,
  getProfileSection,
} from "../clients/onboarding";
import FormInput from "../components/FormInput";
import { getPersonalDetails } from "../clients/profile";

const removeEmptyOrNull = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === "object" && removeEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );
  return obj;
};

const Employment = (props: any) => {
  let pageType = "profile";

  if (props.location.pathname.includes("/onboarding")) {
    pageType = "onboarding";
  }

  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.accessToken);
  const profile = useProfileStore((state) => state.data);
  const [readonlyValue, setReadonlyValue] = useState(false);
  const { isLoading, error, data } = useQuery("employment", () =>
    getEmploymentFields(token)
  );

  // console.log("readonly value", readonlyValue);
  // console.log("profile value", profile);

  const {
    isLoading: isLoading2,
    error: error2,
    data: employmentDetails,
    refetch,
  } = useQuery("employmentSections", () => getProfileSection(token));

  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, errors, reset, control } = useForm();

  const getUpdatedProfile = async () => {
    let getProfile = await getPersonalDetails(token);
    initializeProfileStore(getProfile.data);
    setReadonlyValue(getProfile.data["is_employed"]);
    console.log("this is set", getProfile.data["is_employed"]);
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

  useEffect(() => {
    employmentDetails &&
      initializeProfileSection(
        [].concat(employmentDetails),
        employmentDetails.every((loan) => loan.completed === true)
      );
  }, [employmentDetails, initializeProfileSection]);

  useEffect(() => {
    const result = profile; // result: { firstName: 'test', lastName: 'test2' }
    reset(result); // asynchronously reset your form values
  }, [reset]);

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

  const toggleInput = (checked) => {
    setReadonlyValue((prev) => {
      if (prev === false) {
        reset();
        return checked;
      }
      return checked;
    });
  };

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    values.is_employed = readonlyValue;
    let value = {};
    data.forEach((val) => {
      if (val.name == "is_employed") {
        value[val.name] = values[val.name];
      }

      if (!values.is_employed) {
        return;
      }

      value[val.name] = values[val.name];
    });

    value = removeEmptyOrNull(value);

    try {
      setLoading(true);
      let postData = await patchRequest(token, value);
      setSubmitted(true);
      const { data } = postData;
      initializeProfileStore(data);
      setTimeout(function () {
        setSubmitted(false);
        setLoading(false);
        refetch();
        pageType === "onboarding"
          ? props.history.push("/onboarding/account")
          : props.history.replace("/profile/employment");
      }, 2000);
      setErrorMsg([]);
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
      data.errors && updateErrors(data.errors);
    }
  };

  return (
    <>
      <div className="hidden md:block w-5/12 mb-6 border-r-2 border-gray-200">
        <OnboardingSideBar name="employment" />
        <img src="/img/checklists.svg" alt="" className="w-1/4 m-auto pt-16" />
      </div>

      <div className="md:w-7/12 w-full mb-6 px-8 relative">
        <h1 className="block text-gray-700 text-lg font-bold mb-2">
          EMPLOYMENT DETAILS
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
                    Employment details created successfully
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap -mx-3 mb-6">
                {data &&
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
                        readonlyValue={!readonlyValue}
                        toggleInput={toggleInput}
                      />
                    );
                  })}
              </div>

              <div className="flex items-center justify-between mb-16">
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm md:text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center shadow-lg"
                  type="submit"
                >
                  <span> Save </span>
                  {!loading ? (
                    <svg
                      className="ml-2"
                      width="13"
                      height="13"
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
            </form>
          </>
        )}

        <div className="flex justify-end w-full pr-0 md:pr-4 mt-10">
          <div className="inline-flex justify-end">
            <button
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/education")
                  : props.history.push("/profile/education")
              }
              className="bg-gray-500 hover:bg-gray-600 hover:bg-gray-600 text-white text-md md:text-xl font-light py-2 px-6 md:py-3 md:px-8 rounded-l focus:outline-none focus:shadow-outline inline-flex items-center"
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
              // disabled={!submitted}
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/account")
                  : props.history.push("/profile/account")
              }
              className="bg-green-600 hover:bg-green-700 text-white text-md md:text-xl font-light py-2 px-6 md:py-3 md:px-8 rounded-r focus:outline-none focus:shadow-outline inline-flex items-center"
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
            // disabled={!submitted}
            onClick={() => props.history.push("/onboarding/account")}
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

export default Employment;
