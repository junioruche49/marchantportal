import React, { useEffect, useState, useCallback } from "react";
import OnboardingSideBar from "../components/OnboardingSideBar";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";

import useProfileStore from "../stores/profileStore";
import {
  getIdentificationFields,
  uploadDocument,
  deleteDocument,
  getProfileSection,
} from "../clients/onboarding";
import useAuthStore from "../stores/authStore";

const IdentificationUpload = (props: any) => {
  let pageType = "profile";

  if (props.location.pathname.includes("/onboarding")) {
    pageType = "onboarding";
  }

  const [errorMsg, setErrorMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const profile = useProfileStore((state) => state.data);
  const { register, handleSubmit, errors } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const token = useAuthStore((state) => state.accessToken);
  const [checklistCompletion, setChecklistCompletion] = useState(false);
  const { isLoading, error, data } = useQuery("identity", () =>
    getIdentificationFields(token)
  );

  const [uploaded, setUploaded] = useState(profile["kyc_documents"]);

  const {
    isLoading: isLoading2,
    error: error2,
    data: uploadSection,
  } = useQuery("sections", () => getProfileSection(token));

  const initializeProfileSection = useProfileStore(
    useCallback((state) => state.initializeProfileSection, [])
  );

  useEffect(() => {
    uploadSection &&
      initializeProfileSection(
        uploadSection,
        uploadSection.every((loan) => loan.completed === true)
      );
      setChecklistCompletion(uploadSection && uploadSection.every((loan) => loan.completed === true));
  }, [uploadSection]);

  useEffect(() => {
    setUploaded(profile["kyc_documents"]);
  }, [profile]);

  // let loanStatus = uploadSection && uploadSection.every((loan) => loan.completed === true);
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

  const onChangeHandler = (event: any, type) => {
    let dataValue = [] as any;
    let oldData = [] as any;
    oldData = [...uploadedFile];
    dataValue = { value: event.target.files[0], name: type };

    let filterData = [] as any;
    filterData = oldData.filter((val) => val.name == type);

    if (filterData.length) {
      filterData[0].value = event.target.files[0];
      let newFilterData = [] as any;
      newFilterData = oldData.filter((val) => val.name != type);
      if (newFilterData.length) {
        filterData.push(...newFilterData);
      }
      setUploadedFile(filterData);
      return;
    }
    oldData.push(dataValue);
    setUploadedFile(oldData);
  };

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const onSubmit = async (name: any) => {
    if (!uploadedFile.length) {
      return;
    }
    setLoading(true);
    let val = [] as any;
    val = [...uploadedFile];
    let newVale = [] as any;
    newVale = val.filter((val) => val.name == name);
    try {
      const files = new FormData();
      files.append("document", newVale[0].value);
      files.append("tag", name);
      let postData = await uploadDocument(token, files);
      const { message, data } = postData;
      let getUploaded = [...uploaded];
      getUploaded.push(data);
      setUploaded(getUploaded);
      // uploaded.push(data);

      setLoading(false);
      setErrorMsg([]);
      setSubmitted(true);
      setTimeout(function () {
        setSubmitted(false);
      }, 8000);
      // refetch();
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
    // console.log(uploadedFile);
  };

  const ActiveDeleteDocument = async (id: any) => {
    setLoading(true);

    try {
      let deleteData = await deleteDocument(token, id);
      let UpdateUploaded = uploaded.filter((del) => del.id != id);
      setUploaded(UpdateUploaded);
      setLoading(false);
      setDeleted(true);
      setTimeout(function () {
        setDeleted(false);
      }, 8000);
      // refetch();
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
        <OnboardingSideBar name="documents" />
        <img src="/img/checklists.svg" alt="" className="w-1/4 m-auto pt-16" />
      </div>

      <div className="md:w-7/12 w-full mb-6 px-8 relative">
        <h1 className="block text-gray-700 text-lg font-bold mb-2">
          UPLOAD YOUR ID
        </h1>
        {deleted ? (
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
                  {/* <p className="font-bold">Sent successfully</p> */}
                  <p className="text-sm">Deleted successfully</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {submitted ? (
          <>
            <div
              className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
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
                  {/* <p className="font-bold">Sent successfully</p> */}
                  <p className="text-sm">Uploaded successfully</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
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
        {loading ? (
          <img src="/img/30.gif" className="ml-2 my-5 w-auto m-auto" alt="" />
        ) : (
          ""
        )}
        {/* <h3 className="text-gray-600 text-sm"> We hate to ask, but regulations mandate us to. <br/> Your BVN is safe with us!</h3> */}
        <div className="flex flex-col my-10">
          <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
              {data &&
                data.map((data, key) => {
                  return (
                    <div className="flex flex-wrap ">
                      <div className="md:w-3/5 px-3 my-4">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                          {data.label}
                        </label>
                        <input
                          type="file"
                          name={data.name}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          onChange={(e) => onChangeHandler(e, data.name)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-5">
                        <button
                          className="bg-blue-700 hover:bg-blue-800 text-white text-sm md:text-lg font-light py-3 px-10 rounded-lg focus:outline-none focus:shadow-outline inline-flex items-center shadow-lg"
                          type="button"
                          onClick={() => onSubmit(data.name)}
                        >
                          <span> Upload </span>
                          <svg
                            className="ml-2"
                            width="13"
                            height="13"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="save_icon">
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M2 0H14L18 4V16C18 17.1 17.1 18 16 18H2C0.89 18 0 17.1 0 16V2C0 0.9 0.89 0 2 0ZM16 16V4.83L13.17 2H2V16H16ZM9 9C7.34 9 6 10.34 6 12C6 13.66 7.34 15 9 15C10.66 15 12 13.66 12 12C12 10.34 10.66 9 9 9ZM12 3H3V7H12V3Z"
                                fill="white"
                              />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </form>
          <div className="w-full my-10">
            {uploaded && uploaded.length > 0 ? (
              <>
                <h2 className="text-gray-700 text-lg font-medium mb-4">
                  Uploaded Documents
                </h2>
              </>
            ) : (
              ""
            )}
            {uploaded &&
              uploaded.map((val) => {
                return (
                  <div className="flex items-center border my-2 border-t-0 border-r-0 border-l-0 pb-2">
                    <div className="w-3/5">{val.tag}</div>
                    <div className="w-2/5 text-center">
                      <button
                        className="bg-red-600 py-1 px-2 text-white rounded-lg"
                        onClick={() => ActiveDeleteDocument(val.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex justify-end w-full pr-0 md:pr-4 mt-10">
          <div className="inline-flex justify-end">
            <button
              onClick={() =>
                pageType === "onboarding"
                  ? props.history.push("/onboarding/statement_validation")
                  : props.history.push("/profile/statement_validation")
              }
              className="bg-gray-500 hover:bg-gray-600 text-white text-md md:text-xl font-light py-2 px-6 md:py-3 md:px-8 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
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
            {pageType === "onboarding" ? (
              <button
                disabled={!checklistCompletion}
                onClick={() => props.history.push("/new-loan-request")}
                className={
                  checklistCompletion && checklistCompletion 
                    ? "bg-green-600 hover:bg-green-700 text-white text-xl font-light py-3 px-10 rounded-r focus:outline-none focus:shadow-outline inline-flex items-center"
                    : "bg-gray-400 text-white text-xl font-light py-3 px-10 rounded focus:outline-none focus:shadow-outline inline-flex items-center cursor-not-allowed"
                }
                type="button"
              >
                <span> Complete </span>
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
                      id="icon/action/done_24px"
                      d="M6.5999 11.925L3.4499 8.775L2.3999 9.825L6.5999 14.025L15.5999 5.025L14.5499 3.975L6.5999 11.925Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* <div className="absolute bottom-0 right-0 mr-10 -mt-8">
          <button
            // disabled
            onClick={() => props.history.push("/new-loan-request")}
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

export default IdentificationUpload;
