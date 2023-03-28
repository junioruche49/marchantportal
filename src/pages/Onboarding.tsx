import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NavLink, useHistory, Route, Switch, useLocation } from "react-router-dom";
import { withRouter } from "react-router";
import Bvn from "./Bvn";
import PersonalDetails from "./PersonalDetails";
import EducationalDetails from "./EducationalDetails";
import OnboardingSideBar from "../components/OnboardingSideBar";
import AccountDetails from "./AccountDetails";
import LoanRequest from "./LoanApplication";
import Employment from "./Employment";
import IdentificationUpload from "./IdentificationUpload";
import NextofKin from "./NextofKin";
import ContactInformation from "./ContactInformation";

import useProfileStore from "../stores/profileStore";
import useAuthStore from "../stores/authStore";
import { getProfileSection } from "../clients/onboarding";
import AccountStatement from "./AccountStatement";

function Onboarding(props: any) {
  const profile = useProfileStore((state) => state.profileSection);
  // const [checkList, setcheckList] = useState([]);
  const token = useAuthStore((state) => state.accessToken);
  // console.log("profile",  profile[7]);

  const history = useHistory();
  const location = useLocation();

  const { isLoading : checklistLoading, error: checklistError, data: checklistData } = useQuery("sections", () =>
    getProfileSection(token)
  );

  const checklist = checklistData? checklistData : [];

  const completedKyc = checklist.every((loan) => loan.completed === true);

  if(completedKyc && location.pathname.includes("/onboarding")) {
    history.replace("/profile");
  }
  
  let pageType = "profile";

  if(history.location.pathname.includes("/onboarding")){
    pageType = "onboarding";
  } 

  if(location.pathname === "/onboarding/" || location.pathname === "/onboarding") {
    history.replace("/onboarding/bvn");
  }

  if(location.pathname === "/profile/" || location.pathname === "/profile" ) {
    history.replace("/profile/bvn");
  }




  return (
    <>
      <main className="md:pl-12">
        <div className="flex ">
          <div className="w-full ">
            <div className="flex items-center mt-10 lg:mt-0">
              <div className="w-8 h-1 bg-blue-700 rounded mr-3 hidden md:block"></div>
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-light md:font-semibold text-sm md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                Profile Update
              </h4>
            </div>
            <br />
            <img
              src="/img/bvn-mobile-card-bg.svg"
              alt=""
              className="md:hidden absolute mobile-card-bg"
            />
            <div className="relative w-11/12 bg-white flex rounded py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0 mt-12 md:mt-0">

                  <Switch>
                    <Route path={pageType === "onboarding" ?  "/onboarding/next_of_kin": "/profile/next_of_kin"} component={NextofKin} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/contact" : "/profile/contact"} component={ContactInformation} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/employment" : "/profile/employment"} component={Employment} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/account" : "/profile/account"} component={AccountDetails} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/personal" : "/profile/personal"} component={PersonalDetails} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/education" : "/profile/education"} component={EducationalDetails} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/statement_validation" : "/profile/statement_validation"} component={AccountStatement} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/documents" : "/profile/documents"} component={IdentificationUpload} pageType={pageType}/>
                    <Route path={pageType === "onboarding" ?  "/onboarding/bvn" : "/profile/bvn"} component={Bvn} pageType={pageType}/>
                  </Switch>
                  <br />
                {/* <Switch>
                  <Route path="/onboarding/next_of_kin" component={NextofKin} />
                  <Route
                    path="/onboarding/contact"
                    component={ContactInformation}
                  />
                  <Route path="/onboarding/employment" component={Employment} />
                  <Route
                    path="/onboarding/account"
                    component={AccountDetails}
                  />
                  <Route
                    path="/onboarding/personal"
                    component={PersonalDetails}
                  />
                  <Route
                    path="/onboarding/education"
                    component={EducationalDetails}
                  />
                  <Route
                    path="/onboarding/documents"
                    component={IdentificationUpload}
                  />
                  <Route path="/onboarding/bvn" component={Bvn} />
                </Switch> */}
            </div>
            <div className="w-11/12 mt-8 hidden md:block">
              <hr className="w-9/12 border-t-2 border-blue-600 bg-blue-400 rounded m-auto"></hr>
            </div>
          </div>
        </div>
        <br />
      </main>
    </>
  );
}

export default withRouter(Onboarding);
