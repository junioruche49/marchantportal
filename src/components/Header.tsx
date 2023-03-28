import React from "react";
import useAuthStore from "../stores/authStore";

function Header(props: any) {
  const user = useAuthStore((state) => state.currentUser);

  if (!user) {
    return (
      <>
        {/* <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
              <img
              src="/img/loading-gif.gif"
              alt=""
              className="w-1/8 m-auto py-10"
              />
              <h6 className="m-auto text-lg text-gray-700 text-center">Preparing your acoount...</h6>
          </div> */}
      </>
    );
  }

  return (
    <div>
      {/* desktop view */}
      <header className="hidden lg:flex lg:justify-between lg:bg-white lg:pt-3 lg:pb-3 lg:pl-12 lg:shadow-sm">
        <div className="">
          <h1 className="text-gray-700 text-md font-semibold pt-2">
            Agile Credit Loan Portal
          </h1>
        </div>
        <div className="flex items-center mr-16">
          <h4 className="text-gray-700 text-md font-base mr-5">
            Hello,{" "}
            {user?.firstName
              ? user?.firstName.charAt(0).toUpperCase() +
                user?.firstName.slice(1)?.toLowerCase()
              : null}
          </h4>
          {/* <img src="/img/Notification-icon.svg" alt="" /> */}
        </div>
      </header>
      <br className="hidden lg:inline" />
      <br className="hidden lg:inline" />

      {/* mobile view */}
      <header className="flex justify-start pl-8 lg:hidden">
        <button
          className="h-12 w-12 focus:outline-none fixed z-50"
          onClick={() => props.navBar()}
        >
          <img src="/img/hamburger-menu.svg" alt="" />
        </button>
        <img src="/img/agile-credit-logo.png" className="w-16 ml-24" alt="" />
      </header>
    </div>
  );
}

export default Header;
