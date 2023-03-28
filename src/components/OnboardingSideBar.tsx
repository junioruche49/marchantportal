import React from "react";
import { useLocation } from "react-router-dom";
import useProfileStore from "../stores/profileStore";

function OnboardingSideBar(props: any) {
  const location = useLocation();
  let profileSections = useProfileStore((state) => state.profileSection);

  let pageType = "profile";

  if (location.pathname.includes("/onboarding")) {
    pageType = "onboarding";
  }


  if (pageType === "profile") {
    profileSections = profileSections.filter(
      (item) => item.editable_when_complete
    );
  }

  return (
    <>
      <div className="flex flex-col w-8/12 ml-12 mt-8">
        {profileSections &&
          profileSections.map((key: any, id) => {
            // let menu = key["label"];
            // menu = menu;
            return (
              <div className="flex justify-start items-center mb-5" key={id}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.9863 13.9061C10.8447 13.9061 13.9726 10.7931 13.9726 6.95307C13.9726 3.11299 10.8447 0 6.9863 0C3.12787 0 0 3.11299 0 6.95307C0 10.7931 3.12787 13.9061 6.9863 13.9061Z"
                    fill={
                      props.name === key["name"]
                        ? "#0770B0"
                        : key.completed === true
                        ? "#38a169"
                        : props.name === "LOAN REQUEST"
                        ? "#0770B0"
                        : "#CCCCCC"
                    }
                  />
                  <path
                    d="M6.59318 9.76776C6.40268 9.76811 6.21723 9.7068 6.06481 9.59308L6.05536 9.58602L4.06551 8.06978C3.9731 7.9996 3.89551 7.91197 3.83717 7.8119C3.77883 7.71184 3.7409 7.60131 3.72553 7.48664C3.71017 7.37197 3.71767 7.25541 3.74762 7.14363C3.77757 7.03185 3.82938 6.92704 3.90008 6.83521C3.97077 6.74338 4.05898 6.66633 4.15963 6.60846C4.26028 6.5506 4.37141 6.51306 4.48666 6.49799C4.60191 6.48292 4.71902 6.49062 4.83127 6.52065C4.94353 6.55067 5.04873 6.60244 5.14086 6.67298L6.42973 7.65656L9.47552 3.7033C9.54616 3.61161 9.63426 3.53466 9.73478 3.47686C9.8353 3.41905 9.94627 3.38151 10.0614 3.36639C10.1765 3.35127 10.2934 3.35886 10.4056 3.38873C10.5177 3.4186 10.6229 3.47016 10.715 3.54047L10.6961 3.56606L10.7155 3.54084C10.9013 3.68298 11.0229 3.89269 11.0536 4.12395C11.0842 4.35521 11.0215 4.58914 10.8791 4.77441L7.29651 9.42439C7.21365 9.53154 7.1071 9.61826 6.98513 9.6778C6.86316 9.73735 6.72903 9.76813 6.59318 9.76776Z"
                    fill="white"
                  />
                </svg>
                <h2
                  className={
                    props.name === key["name"]
                      ? "ml-8 text-gray-700 font-semibold"
                      : key.completed === true
                      ? "ml-8 text-green-600 font-semibold"
                      : props.name === "LOAN REQUEST"
                      ? "ml-8 text-gray-700 font-semibold"
                      : "ml-8 text-gray-400 font-semibold"
                  }
                >
                  {key["label"].toUpperCase()}
                </h2>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default OnboardingSideBar;
