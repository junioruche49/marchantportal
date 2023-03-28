import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getProfileSection } from "../clients/onboarding";
import useAuthStore from "../stores/authStore";
import { useQuery } from "react-query";
import Onboarding from "./Onboarding";
import keycloak from "../auth/keycloak";

const Profile = (props: any) => {
  const history = useHistory();
  const location = useLocation();

  const token = useAuthStore((state) => state.accessToken);

  const profile: any = useAuthStore((state) => state.currentUser);

  const [launchProfileSection, setLaunchProfileSection] = useState<boolean>();
  const [accountButtonHover, setAccountButtonHover] = useState<boolean>();
  const [filteredSection, setFilteredSection] = useState<any>([]);
  const [isKycComplete, setIsKycComplete] = useState<boolean>();

  const _handleProfileLaunch = (section) => {
    setLaunchProfileSection(true);
    history.push("/profile/" + section);
  };

  const _handleAccountSettingsLaunch = () => {
    // const authUrl = process.env.REACT_APP_AUTH_SERVER_URL;
    // const authRealm = process.env.REACT_APP_AUTH_REALM;

    // window.location.assign(authUrl + "realms/" + authRealm + "/account");
    keycloak.accountManagement();
  };

  const {
    isLoading,
    error,
    data: profileSections,
    refetch,
  } = useQuery("sections", () => getProfileSection(token));

  useEffect(() => {
    if (profileSections) {
      setFilteredSection(
        profileSections.filter((sec) => sec.editable_when_complete)
      );

      setIsKycComplete(
        profileSections.every((loan) => loan.completed === true)
      );
    }
  }, [profileSections, setFilteredSection]);

  if (isLoading || !profile.email) {
    return (
      <>
        {/* <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Loading your profile...
          </h6>
        </div> */}
      </>
    );
  }

  return (
    <>
      {!launchProfileSection &&
      (location.pathname === "/profile/" ||
        location.pathname === "/profile") ? (
        <main className="md:pl-12">
          <div className="flex ">
            <div className="w-full ">
              <div className="flex items-center mt-10 lg:mt-0">
                <div className="w-8 h-1 bg-blue-700 rounded mr-0 hidden md:block"></div>
                <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-normal md:font-semibold text-md md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                  My Profile
                </h4>
              </div>
              <br />
              <div className="w-11/12 flex justify-end items-center h-16 my-2 md:m-0 m-auto lg:hidden">
                <button
                  className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                  onClick={() => history.goBack()}
                >
                  <div className="ml-2 text-blue-700 text-md">Go Back</div>
                </button>
              </div>
              <div className="bg-white my-12 pb-6 justify-center items-center overflow-hidden w-11/12 rounded-lg shadow-sm m-auto md:m-0 mt-12 md:mt-0 fade-in">
                <div className="relative h-40">
                  <img
                    className="absolute h-full w-full object-cover"
                    src="/img/profile-bg.jpg"
                    alt=""
                  />
                </div>
                <div className="relative w-9/12 md:w-6/12 bg-gray-700 shadow mx-auto w-auto -my-12 h-20 rounded-full">
                  <span className="flex justify-center text-center text-lg md:text-3xl font-medium font text-gray-300 ease-in-out md:pt-4 pt-6 px-1">
                    {profile?.firstName
                      ? profile?.firstName.charAt(0).toUpperCase()
                      : null}
                    {profile?.firstName
                      ? profile?.firstName.slice(1)?.toLowerCase()
                      : null}{" "}
                    {profile?.lastName
                      ? profile?.lastName.charAt(0).toUpperCase()
                      : null}
                    {profile?.lastName
                      ? profile?.lastName.slice(1)?.toLowerCase()
                      : null}
                  </span>
                </div>
                <div className="mt-16">
                  <h1 className="text-lg text-center text-gray-700 font-medium">
                    {profile?.email}
                  </h1>
                  <p className="text-sm text-gray-600 text-center">
                    {profile?.phone_no}
                  </p>
                </div>
                <div className="mt-6 pt-3 mx-6 border-t">
                  <h1 className="flex text-left text-gray-600 text-xl font-medium py-2">
                    Personal Information
                    {!isKycComplete ? (
                      <div>
                        <svg
                          className="fill-current h-6 w-6 text-red-600 ml-2 mt-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 22 22"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                    ) : null}
                  </h1>

                  {!isKycComplete ? (
                    <>
                      <p className="flex text-sm text-red-600 text-left my-2 font-normal">
                        You need to complete your KYC!
                      </p>
                      <div className="flex flex-wrap">
                        <div
                          className="text-xs mr-2 my-1 uppercase tracking-wider border px-4 py-3 text-blue-100 border-blue-600 bg-blue-600 hover:bg-blue-700  transition-colors duration-150 ease-in-out cursor-pointer"
                          onClick={() => history.push("/onboarding/")}
                        >
                          Complete my KYC
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 text-left my-1">
                        Your profile details, documents and other information.
                      </p>
                      <div className="flex flex-wrap">
                        {filteredSection.map((section: any, id) => {
                          return (
                            <>
                              <div
                                className="text-xs mr-2 my-1 uppercase tracking-wider border px-2 py-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-indigo-100  transition-colors duration-150 ease-in-out cursor-pointer"
                                onClick={() =>
                                  _handleProfileLaunch(section["name"])
                                }
                              >
                                {section["label"]}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 pt-3 mx-6 border-t">
                  <h1 className="text-left text-gray-600 text-xl font-medium py-2">
                    Account Settings
                  </h1>
                  <p className="text-sm text-gray-600 text-left my-1">
                    Update your password and other account settings.
                  </p>
                  <div className="flex flex-wrap">
                    <div
                      className="flex text-sm mr-2 my-2 uppercase tracking-wider border px-4 py-3 text-orange-700 border-orange-700 hover:bg-orange-700 hover:text-orange-100  transition-colors duration-150 ease-in-out cursor-pointer"
                      onClick={_handleAccountSettingsLaunch}
                      onMouseEnter={() => setAccountButtonHover(true)}
                      onMouseLeave={() => setAccountButtonHover(false)}
                    >
                      {accountButtonHover ? (
                        <svg
                          className="mr-2"
                          width="20"
                          height="20"
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="settings_24px">
                            <path
                              id="icon/action/settings_24px"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M19.5022 12C19.5022 12.34 19.4722 12.66 19.4322 12.98L21.5422 14.63C21.7322 14.78 21.7822 15.05 21.6622 15.27L19.6622 18.73C19.5722 18.89 19.4022 18.98 19.2322 18.98C19.1722 18.98 19.1122 18.97 19.0522 18.95L16.5622 17.95C16.0422 18.34 15.4822 18.68 14.8722 18.93L14.4922 21.58C14.4622 21.82 14.2522 22 14.0022 22H10.0022C9.75216 22 9.54216 21.82 9.51216 21.58L9.13216 18.93C8.52216 18.68 7.96216 18.35 7.44216 17.95L4.95216 18.95C4.90216 18.97 4.84216 18.98 4.78216 18.98C4.60216 18.98 4.43216 18.89 4.34216 18.73L2.34216 15.27C2.22216 15.05 2.27216 14.78 2.46216 14.63L4.57216 12.98C4.53216 12.66 4.50216 12.33 4.50216 12C4.50216 11.67 4.53216 11.34 4.57216 11.02L2.46216 9.37C2.27216 9.22 2.21216 8.95 2.34216 8.73L4.34216 5.27C4.43216 5.11 4.60216 5.02 4.77216 5.02C4.83216 5.02 4.89216 5.03 4.95216 5.05L7.44216 6.05C7.96216 5.66 8.52216 5.32 9.13216 5.07L9.51216 2.42C9.54216 2.18 9.75216 2 10.0022 2H14.0022C14.2522 2 14.4622 2.18 14.4922 2.42L14.8722 5.07C15.4822 5.32 16.0422 5.65 16.5622 6.05L19.0522 5.05C19.1022 5.03 19.1622 5.02 19.2222 5.02C19.4022 5.02 19.5722 5.11 19.6622 5.27L21.6622 8.73C21.7822 8.95 21.7322 9.22 21.5422 9.37L19.4322 11.02C19.4722 11.34 19.5022 11.66 19.5022 12ZM17.5022 12C17.5022 11.79 17.4922 11.58 17.4522 11.27L17.3122 10.14L18.2022 9.44L19.2722 8.59L18.5722 7.38L17.3022 7.89L16.2422 8.32L15.3322 7.62C14.9322 7.32 14.5322 7.09 14.1022 6.91L13.0422 6.48L12.8822 5.35L12.6922 4H11.3022L11.1022 5.35L10.9422 6.48L9.88216 6.91C9.47216 7.08 9.06216 7.32 8.63216 7.64L7.73216 8.32L6.69216 7.9L5.42216 7.39L4.72216 8.6L5.80216 9.44L6.69216 10.14L6.55216 11.27C6.52216 11.57 6.50216 11.8 6.50216 12C6.50216 12.2 6.52216 12.43 6.55216 12.74L6.69216 13.87L5.80216 14.57L4.72216 15.41L5.42216 16.62L6.69216 16.11L7.75216 15.68L8.66216 16.38C9.06216 16.68 9.46216 16.91 9.89216 17.09L10.9522 17.52L11.1122 18.65L11.3022 20H12.7022L12.9022 18.65L13.0622 17.52L14.1222 17.09C14.5322 16.92 14.9422 16.68 15.3722 16.36L16.2722 15.68L17.3122 16.1L18.5822 16.61L19.2822 15.4L18.2022 14.56L17.3122 13.86L17.4522 12.73C17.4822 12.43 17.5022 12.21 17.5022 12ZM12.0022 8C9.79216 8 8.00216 9.79 8.00216 12C8.00216 14.21 9.79216 16 12.0022 16C14.2122 16 16.0022 14.21 16.0022 12C16.0022 9.79 14.2122 8 12.0022 8ZM10.0022 12C10.0022 13.1 10.9022 14 12.0022 14C13.1022 14 14.0022 13.1 14.0022 12C14.0022 10.9 13.1022 10 12.0022 10C10.9022 10 10.0022 10.9 10.0022 12Z"
                              fill="#FFFFFF"
                            />
                          </g>
                        </svg>
                      ) : (
                        <svg
                          className="mr-2"
                          width="20"
                          height="20"
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="settings_24px">
                            <path
                              id="icon/action/settings_24px"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M19.5022 12C19.5022 12.34 19.4722 12.66 19.4322 12.98L21.5422 14.63C21.7322 14.78 21.7822 15.05 21.6622 15.27L19.6622 18.73C19.5722 18.89 19.4022 18.98 19.2322 18.98C19.1722 18.98 19.1122 18.97 19.0522 18.95L16.5622 17.95C16.0422 18.34 15.4822 18.68 14.8722 18.93L14.4922 21.58C14.4622 21.82 14.2522 22 14.0022 22H10.0022C9.75216 22 9.54216 21.82 9.51216 21.58L9.13216 18.93C8.52216 18.68 7.96216 18.35 7.44216 17.95L4.95216 18.95C4.90216 18.97 4.84216 18.98 4.78216 18.98C4.60216 18.98 4.43216 18.89 4.34216 18.73L2.34216 15.27C2.22216 15.05 2.27216 14.78 2.46216 14.63L4.57216 12.98C4.53216 12.66 4.50216 12.33 4.50216 12C4.50216 11.67 4.53216 11.34 4.57216 11.02L2.46216 9.37C2.27216 9.22 2.21216 8.95 2.34216 8.73L4.34216 5.27C4.43216 5.11 4.60216 5.02 4.77216 5.02C4.83216 5.02 4.89216 5.03 4.95216 5.05L7.44216 6.05C7.96216 5.66 8.52216 5.32 9.13216 5.07L9.51216 2.42C9.54216 2.18 9.75216 2 10.0022 2H14.0022C14.2522 2 14.4622 2.18 14.4922 2.42L14.8722 5.07C15.4822 5.32 16.0422 5.65 16.5622 6.05L19.0522 5.05C19.1022 5.03 19.1622 5.02 19.2222 5.02C19.4022 5.02 19.5722 5.11 19.6622 5.27L21.6622 8.73C21.7822 8.95 21.7322 9.22 21.5422 9.37L19.4322 11.02C19.4722 11.34 19.5022 11.66 19.5022 12ZM17.5022 12C17.5022 11.79 17.4922 11.58 17.4522 11.27L17.3122 10.14L18.2022 9.44L19.2722 8.59L18.5722 7.38L17.3022 7.89L16.2422 8.32L15.3322 7.62C14.9322 7.32 14.5322 7.09 14.1022 6.91L13.0422 6.48L12.8822 5.35L12.6922 4H11.3022L11.1022 5.35L10.9422 6.48L9.88216 6.91C9.47216 7.08 9.06216 7.32 8.63216 7.64L7.73216 8.32L6.69216 7.9L5.42216 7.39L4.72216 8.6L5.80216 9.44L6.69216 10.14L6.55216 11.27C6.52216 11.57 6.50216 11.8 6.50216 12C6.50216 12.2 6.52216 12.43 6.55216 12.74L6.69216 13.87L5.80216 14.57L4.72216 15.41L5.42216 16.62L6.69216 16.11L7.75216 15.68L8.66216 16.38C9.06216 16.68 9.46216 16.91 9.89216 17.09L10.9522 17.52L11.1122 18.65L11.3022 20H12.7022L12.9022 18.65L13.0622 17.52L14.1222 17.09C14.5322 16.92 14.9422 16.68 15.3722 16.36L16.2722 15.68L17.3122 16.1L18.5822 16.61L19.2822 15.4L18.2022 14.56L17.3122 13.86L17.4522 12.73C17.4822 12.43 17.5022 12.21 17.5022 12ZM12.0022 8C9.79216 8 8.00216 9.79 8.00216 12C8.00216 14.21 9.79216 16 12.0022 16C14.2122 16 16.0022 14.21 16.0022 12C16.0022 9.79 14.2122 8 12.0022 8ZM10.0022 12C10.0022 13.1 10.9022 14 12.0022 14C13.1022 14 14.0022 13.1 14.0022 12C14.0022 10.9 13.1022 10 12.0022 10C10.9022 10 10.0022 10.9 10.0022 12Z"
                              fill="#C05621"
                            />
                          </g>
                        </svg>
                      )}
                      OPEN ACCOUNT SETTINGS
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-11/12 mt-8 hidden md:block">
                <hr className="w-9/12 border-t-2 border-blue-600 bg-blue-400 rounded m-auto"></hr>
              </div>
            </div>
          </div>
          <br />
        </main>
      ) : (
        <>
          <Onboarding />
        </>
      )}
    </>
  );
};

export default Profile;
