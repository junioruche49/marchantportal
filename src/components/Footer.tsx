import React from "react";
import { NavLink, useHistory } from "react-router-dom";

function Footer() {
  return (
    <>
      {/* mobile view */}
      <footer className="flex bg-blue-700 fixed bottom-0 w-full py-3 px-3 lg:hidden">
        <NavLink to="/" className="w-1/3 text-center ">
          <img
            className="text-white mx-auto"
            src="/img/overview-icon-alt.svg"
            alt=""
          />
          <h1 className="text-white text-xs">Overview</h1>
        </NavLink>
        <NavLink to="/loans" className="w-1/3 text-center">
          <img className="mx-auto" src="/img/loans-icon-alt.svg" alt="" />
          <h1 className="text-white text-xs">Loans</h1>
        </NavLink>
        <NavLink to="/profile" className="w-1/3 text-center">
          <img className="mx-auto" src="/img/profile-icon-alt.svg" alt="" />
          <h1 className="text-white text-xs">Profile</h1>
        </NavLink>
      </footer>

      {/* desktop view */}
      <footer className="absolute bottom-0 w-full bg-white pt-3 pb-3 shadow-md hidden lg:inline-block">
        <div className="relative">
          <div className="flex justify-center">
            <p className="flex justify-center text-gray-700 text-sm font-light">
              {" "}
              Agile Credit Limited | Made with{" "}
              <img className="pl-3" src="/img/favorite-icon.svg" alt="" />
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
