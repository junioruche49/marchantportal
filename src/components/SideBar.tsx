import React, { useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import NavigationLink from "./NavigationLink";
import { CSSTransition, Transition } from "react-transition-group";
import { Confirm } from "react-st-modal";
import keycloak from "../auth/keycloak";

function SideBar(props: any) {
  const resetAuthState = useAuthStore((state) => state.reset);

  useEffect(() => {}, [props.navValue]);

  const NavigationLinks = [
    {
      to: "/",
      name: "Overview",
      icon: "/img/overview-icon.svg",
      exact: true,
    },
    {
      to: "/loans",
      name: "My Loans",
      icon: "/img/loans-icon.svg",
      exact: false,
    },
    // {
    //   to: "/pay",
    //   name: "Make Payments",
    //   icon: "/img/payment-icon.svg",
    //   exact: false,
    // },
    {
      to: "/profile",
      name: "My Profile",
      icon: "/img/profile-icon.svg",
      exact: false,
    },
    {
      to: "/cards",
      name: "Payment Methods",
      icon: "/img/payments-icon.svg",
      exact: false,
    },
  ];

  const _logout = async () => {
    const isConfirm = await Confirm(
      "Are you sure you want to logout?",
      "Logout"
    );

    if (isConfirm) {
      resetAuthState();
      await keycloak.logout();
    }
  };

  const goToOnboarding = () => {
    props.navSideBarToggle();
    props.history.push("/new-loan-request");
  };

  return (
    // <CSSTransition
    //   in={props.navValue}
    //   timeout={500}
    //   classNames="my-node"
    //   unmountOnExit
    //   appear
    // >
    <div
      // style={{ transition: "all 2s" }}
      style={{
        transition: "color 0.8s linear",
      }}
      ref={props.refData}
      className={
        props.navValue
          ? " w-8/12 sm:w-6/12 fixed left-0 bg-white h-screen border-r z-40 pt-6"
          : "hidden  lg:w-3/12 pt-12 border-r bg-white h-auto relative lg:inline"
      }
    >
      <div className="flex justify-center mb-4 lg:mb-20">
        <img src="/img/agile-credit-logo.png" className="w-24" alt="" />
      </div>
      <div className="w-full mb-8 lg:mb-16 m-auto text-center">
        <button
          onClick={() => goToOnboarding()}
          className="inline-flex m-auto shadow-xl text-xl text-white px-8 lg:px-10 py-2 lg:py-3 items-center bg-blue-700 rounded-md hover:bg-blue-600 transition-colors duration-150 ease-in-out"
        >
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="add_24px">
              <path
                id="icon/content/add_24px"
                d="M19 13.3832H13V19.229H11V13.3832H5V11.4346H11V5.58878H13V11.4346H19V13.3832Z"
                fill="white"
              />
            </g>
          </svg>
          {/* <img src="/img/plus-icon.svg" className="w-4 lg:w-6" alt="" /> */}
          <span className="ml-2 text-lg font-normal">Take a loan</span>
        </button>
      </div>
      <div className="w-11/12 ml-auto lg:mb-24">
        {NavigationLinks.map((key, id) => {
          return (
            <NavigationLink
              key={id}
              to={key.to}
              name={key.name}
              icon={key.icon}
              exact={key.exact}
              navAction={props.navSideBarToggle}
            />
          );
        })}
      </div>
      <br />
      <div className=" bottom-0 border-t">
        <div className="w-11/12 ml-auto mt-8">
          <a
            href={process.env.REACT_APP_WEBSITE_LINK ?? ""}
            className="flex p-4 items-center rounded-tl-lg rounded-bl-lg mb-1"
          target="_blank" rel="noopenner noreferrer">
            <img src="/img/web-icon.svg" className="ml-3 w-5 h-5" alt="" />
            <span className="text-gray-700 ml-6 lg:text-sm xl:text-lg font-light">
              Visit Website
            </span>
          </a>
          <button
            onClick={_logout}
            className="hidden lg:flex p-4 rounded-tl-lg rounded-bl-lg mb-1 focus:outline-none"
          >
            <img src="/img/logout-icon.svg" className="ml-3 w-5 h-8" alt="" />
            <span className="text-gray-700 ml-6 lg:text-sm xl:text-lg font-light">
              Logout
            </span>
          </button>
          <button
            onClick={_logout}
            className="lg:hidden text-red-600 flex p-4 rounded-tl-lg rounded-bl-lg mb-1 focus:outline-none"
          >
            <img src="/img/logout-icon.svg" className="ml-3 w-5 h-6" alt="" />
            <span className="text-red-600 ml-6 lg:text-sm xl:text-lg font-light">
              Logout
            </span>
          </button>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
    // </CSSTransition>
  );
}

export default withRouter(SideBar);
