import React, { useEffect, useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Keycloak from "keycloak-ionic";
import { Deeplinks } from "@ionic-native/deeplinks";
import { Capacitor, Plugins } from "@capacitor/core";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Bvn from "./pages/Bvn";
import useAuthStore from "./stores/authStore";
import useProfileStore from "./stores/profileStore";
import MyLoans from "./pages/MyLoans";
import NewLoanRequest from "./pages/NewLoanRequest";
import LoanSchedule from "./pages/LoanSchedule";
import MyCards from "./pages/MyCards";
import AddCard from "./pages/AddCard";

import { getPersonalDetails } from "./clients/profile";
import { getProfileSection } from "./clients/onboarding";
import LoanRequests from "./pages/LoanRequests";
import keycloak from "./auth/keycloak";
import PaymentCallback from "./pages/PaymentCallback";
import Pay from "./pages/Pay";
import PageNotFound from "./pages/PageNotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import LoanDetails from "./pages/LoanDetails";
import { ACCESS_TOKEN } from "./auth/constants";
import GetStarted from "./pages/GetStarted";

const { Storage } = Plugins;

export default function App() {
  const history = useHistory();

  const authenticated = useAuthStore(
    useCallback((state) => state.authenticated, [])
  );

  const initializeAuthStore = useAuthStore(
    useCallback((state) => state.initialize, [])
  );

  const initializeProfileStore = useProfileStore(
    useCallback((state) => state.initialize, [])
  );

  const initializeProfileSection = useProfileStore(
    useCallback((state) => state.initializeProfileSection, [])
  );

  const [isCapacitor] = useState(() => {
    return Capacitor.isNative;
  });

  const [authStatus, setAuthStatus] = useState<{
    error: boolean;
    message: string;
  }>();

  const _initializeStores = useCallback(
    async (keycloak: Keycloak.KeycloakInstance) => {
      initializeAuthStore(keycloak);
      const { token } = keycloak;
      try {
        const { data } = await getPersonalDetails(token);
        const checklist = await getProfileSection(token);
        initializeProfileStore(data);
        initializeProfileSection(
          checklist,
          checklist.every((loan) => loan.completed === true)
        );
      } catch (error) {}
    },
    [initializeAuthStore, initializeProfileSection, initializeProfileStore]
  );

  const _refreshToken = useCallback(
    async (keycloak: Keycloak.KeycloakInstance) => {
      keycloak
        .updateToken(70)
        .then(async (refreshed) => {
          if (refreshed) {
            initializeAuthStore(keycloak);
          }
        })
        .catch((err) => {
          keycloak.logout();
          history.replace("/");
        });
    },
    [initializeAuthStore, history]
  );

  const _initializeAuthentication = useCallback(() => {
    keycloak
      .init({
        onLoad: "login-required",
        adapter: "default",
        // redirectUri:
        //   process.env.REACT_APP_HOME_URL ?? "http://localhost:3000/*",
        ...(isCapacitor
          ? { adapter: "capacitor", redirectUri: "com.agilecredit.app://home" }
          : {}),
      })
      .then(async (authenticated) => {
        if (authenticated) {
          await _initializeStores(keycloak);
          // await Storage.set({ key: ACCESS_TOKEN, value: keycloak.token ?? "" });
        }
      })
      .catch((error) => {
        setAuthStatus({
          error: true,
          message: error?.message ?? "Something went wrong",
        });
      });
  }, [_initializeStores, isCapacitor]);

  useEffect(() => {
    if (!isCapacitor) {
      _initializeAuthentication();
    }

    const deeplinking = () =>
      Deeplinks.route({ "/": { target: "/" } }).subscribe((match) => {
        history.replace(match.$route);
      });

    if (isCapacitor) {
      window.addEventListener("deviceready", deeplinking);
    }

    return () => {
      if (isCapacitor) {
        window.removeEventListener("deviceready", () => {
          deeplinking().unsubscribe();
        });
      }
    };
  }, [_initializeAuthentication, isCapacitor, history]);

  if (!authenticated) {
    if (authStatus?.error) {
      return (
        <div className="h-screen w-screen flex justify-center items-center">
          <p className="text-xl">{authStatus.message}</p>
        </div>
      );
    }

    return (
      <>
        {isCapacitor ? (
          <GetStarted onStart={_initializeAuthentication} />
        ) : (
          <div className="w-full m-auto px-8 relative">
            <img
              src="/img/loading-gif.gif"
              alt=""
              className="w-1/8 m-auto pt-64 pb-10"
            />
            <h6 className="m-auto text-lg text-gray-700 text-center">
              One moment please...
            </h6>
          </div>
        )}
      </>
    );
  }

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/new-loan-request">
            <NewLoanRequest />
          </Route>
          <Route path="/loan-schedule">
            <LoanSchedule />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/loans">
            <MyLoans />
          </Route>
          <Route path="/loan-details/:loanId">
            <LoanDetails />
          </Route>
          <Route path="/onboarding">
            <Onboarding />
          </Route>
          <Route path="/applications">
            <LoanRequests />
          </Route>
          <Route path="/pay/process">
            <PaymentCallback />
          </Route>
          <Route path="/cards/add">
            <AddCard />
          </Route>
          <Route path="/cards">
            <MyCards />
          </Route>
          <Route path="/pay/success">
            <PaymentSuccess />
          </Route>
          <Route path="/pay/:loanId">
            <Pay />
          </Route>
          <Route path="/get-started">
            <GetStarted />
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}
