import create, { UseStore, State } from "zustand";

export interface AuthState extends State {
  authenticated: boolean;
  accessToken: null | string;
  currentUser: null | Keycloak.KeycloakProfile;
  initialize: (keycloak: Keycloak.KeycloakInstance) => void;
  reset: () => void;
  logout: null | (() => Keycloak.KeycloakPromise<void, void>);
}

const useAuthStore: UseStore<AuthState> = create((set) => ({
  authenticated: false,
  accessToken: null,
  currentUser: null,
  logout: null,
  initialize(keycloak: Keycloak.KeycloakInstance) {
    set({
      logout: keycloak.logout,
      authenticated: keycloak.authenticated,
      accessToken: keycloak.token,
    });

    keycloak
      .loadUserProfile()
      .then((profile) => {
        set({ currentUser: profile });
      })
      .catch((_) => {});
  },
  reset() {
    set({
      authenticated: false,
      accessToken: null,
      currentUser: null,
    });
  },
}));

export default useAuthStore;
