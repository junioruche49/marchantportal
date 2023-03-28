import React from "react";
import { NavLink } from "react-router-dom";

const NavigationLink = (props: any) => {
  return (
    <NavLink
      exact={props.exact}
      onClick={() => props.navAction()}
      activeClassName="bg-indigo-200 text-blue-700"
      to={props.to}
      className="text-gray-700 flex p-4 rounded-tl-lg rounded-bl-lg mb-1"
    >
      <img src={props.icon} className="ml-3 w-5" alt="" />
      <span className=" ml-6 lg:text-sm xl:text-lg font-light">
        {props.name}
      </span>
    </NavLink>
  );
};

export default NavigationLink;
