import React from "react";
import "../assets/custom.css";

const GetStarted = ({ onStart = () => {} }) => {
  return (
    <>
      <main className="md:pl-12 get-started-bg">
        <div className="flex flex-col h-screen items-center justify-around">
          <div className="w-2/4 md:w-1/3 m-auto text-center">
            <img
              src="/img/agile-credit-logo-large.svg"
              alt=""
              className=" w-8/12 m-auto"
            />
            <p className="text-gray-700">Quick money. Anytime!</p>
          </div>
          <button onClick={onStart} className="border-blue-800 border-2 w-6/12 py-4 text-blue-800 mb-16">
            GET STARTED >
          </button>
        </div>
      </main>
    </>
  );
};
export default GetStarted;
