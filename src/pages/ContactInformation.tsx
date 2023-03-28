import React, { useState, useEffect, useCallback } from "react";
import OnboardingSideBar from "../components/OnboardingSideBar";
import { useForm, Controller } from "react-hook-form";

import { useQuery } from "react-query";

import useProfileStore from "../stores/profileStore";
import useAuthStore from "../stores/authStore";
import {
  getContactInformation,
  patchRequest,
  getProfileSection,
} from "../clients/onboarding";
import FormInput from "../components/FormInput";
import { getPersonalDetails } from "../clients/profile";

const ContactInformation = (props: any) => {
  let pageType = "profile";

  if (props.location.pathname.includes("/onboarding")) {
    pageType = "onboarding";
  }

  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const profile = useProfileStore((state) => state.data);
  const token = useAuthStore((state) => state.accessToken);
  const [readonlyValue, setReadonlyValue] = useState(false);
  const { isLoading, error, data } = useQuery("contact", () =>
    getContactInformation(token)
  );

  const {
    isLoading: isLoading2,
    error: error2,
    data: contactDetails,
    refetch,
  } = useQuery("contactSections", () => getProfileSection(token));

  const { register, handleSubmit, errors, reset, control } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [childFieldOptions, setChildFieldOptions] = useState<any[]>([]);

  useEffect(() => {
    const result = profile; // result: { firstName: 'test', lastName: 'test2' }
    reset(result); // asynchronously reset your form values
  }, [reset]);

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

  useEffect(() => {
    contactDetails &&
      initializeProfileSection(
        [].concat(contactDetails),
        contactDetails.every((loan) => loan.completed === true)
      );
  }, [contactDetails, initializeProfileSection]);

  function getChildFieldOptions(field, value) {
    control.setValue(field, value);

    let childFields = data.filter(
      (f) => f.filtered_by && f.filtered_by == field
    );

    if (!childFields) return;

    childFields.forEach((c) => {
      control.setValue(c.name, null);
    });

    let fieldSet = childFields.map((c) => {
      return {
        ...c,
        ...{
          options: c.options.filter((opt) => {
            return opt[c.filter_field] == value;
          }),
        },
      };
    });

    setChildFieldOptions(fieldSet);
  }

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

  const toggleInput = () => {
    setReadonlyValue((prev) => !prev);
  };

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    let value = {};
    data.map((val) => {
      value[val.name] = values[val.name];
    });
    try {
      let postData = await patchRequest(token, value);
      setSubmitted(true);
      const { data } = postData;
      initializeProfileStore(data);
      setTimeout(function () {
        setSubmitted(false);
        setLoading(false);
        refetch();
        pageType === "onboarding"
          ? props.history.push("/onboarding/education")
          : props.history.replace("/profile/contact");
      }, 2000);
      setLoading(false);
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
      console.log(data.errors);
      data.errors && updateErrors(data.errors);
    }
  };
  return (
    <>
      <div className="hidden md:block w-5/12 mb-6 border-r-2 border-gray-200">
        <OnboardingSideBar name="contact" />
        <img src="/img/checklists.svg" alt="" className="w-1/4 m-auto pt-16" />
      </div>

      <div className="md:w-7/12 w-full mb-6 px-8 relative">
        <h1 className="block text-gray-700 text-lg font-bold mb-2">
          Contact Information
        </h1>
        {/* <h3 className="text-gray-600 text-sm"> We hate to ask, but regulations mandate us to. <br/> Your BVN is safe with us!</h3> */}
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
                    Contact information created successfully
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
                        readonlyValue={readonlyValue}
                        toggleInput={toggleInput}
                        filteredBy={data.filtered_by ?? null}
                        getChildFieldOptions={getChildFieldOptions}
                        filteredOptions={childFieldOptions.find(
                          (c) => c.name == data.name
                        )}
                      />
                    );
                  })}
              </div>

              <div className="flex items-center justify-between mb-16">
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white text-lg md:text-xl font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center shadow-lg"
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
                          d="M2 0H14L18 4V16C18 17.1 17.1 18 16 18H2C0.89 18 0 17.1 0 16V2C0 0.9 0.89 0 2 0ZM16 16V4.83L13.17 2H2V16H16ZM9 9C7.34 9 6 10.34 6 12C6 13.66 7.34 15 9 15C10.66 15 12 13.66 12 12C12 10.34 10.66 9 9 9ZM12 3H3V7H12V3Z"
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
                  ? props.history.push("/onboarding/next_of_kin")
                  : props.history.push("/profile/next_of_kin")
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
              // disabled={!submitted}
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/education")
                  : props.history.push("/profile/education")
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
            disabled={!submitted}
            onClick={() => props.history.push("/onboarding/education")}
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

export default ContactInformation;
