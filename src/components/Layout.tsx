import React, { Props, useState, useRef } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Footer from "./Footer";
import "../assets/custom.css";

function Layout(props: Props<{}>) {
  const [navOpen, setNavopen] = useState(false);
  const wrapperRef = useRef();

  const openNav = ($value = false) => {
    // let wrapper: any = wrapperRef.current;
    // wrapper.classList.toggle("bg-green-800");
    $value ? setNavopen(false) : setNavopen((preVal) => !preVal);
  };

  return (
    <div className="w-full m-auto relative h-full lg:flex bg-gradient-to-b from-blue-100 to-white md:bg-none md:bg-gray-100   lg:p-0">
      <SideBar
        navSideBarToggle={() => openNav(true)}
        navValue={navOpen}
        refData={wrapperRef}
      />
      <div
        className={
          navOpen
            ? "bg-gray-400 opacity-50 z-auto relative"
            : "lg:w-10/12 lg:relative pt-12 lg:pt-0"
        }
        onClick={() => (navOpen ? openNav() : null)}
      >
        <Header navBar={openNav} />
        <div>{props.children}</div>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
