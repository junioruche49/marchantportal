import Keycloak from "keycloak-ionic";

const keycloak = Keycloak({
  realm: process.env.REACT_APP_AUTH_REALM ?? "",
  url: process.env.REACT_APP_AUTH_SERVER_URL ?? "",
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID ?? "",
});

export default keycloak;
