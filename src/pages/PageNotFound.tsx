import React from "react";

const PageNotFound = () => {
  return (
    <>
      <main className="md:pl-12">
        <div className="flex ">
          <div className="w-full ">
            <br />
            <div className="relative w-11/12 py-12 mb-20 m-auto md:m-0 mt-12 md:mt-0">
                <div className="w-full m-auto mb-6">
                    <img
                      src="/img/404.svg"
                      alt=""
                      className="w-3/4 md:w-1/3 m-auto"
                    />
                </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default PageNotFound;
