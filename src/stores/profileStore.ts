import create, { UseStore, State } from "zustand";

interface ProfileState extends State {
  data: object;
  profileSection: any;
  loanEligibility: boolean;
  initialize: (data: any) => void;
  initializeProfileSection: (value: any, checklist: any) => void;
}

const useProfileStore: UseStore<ProfileState> = create((set) => ({
  data: {},
  profileSection: [],
  loanEligibility: false,
  initialize(data) {
    set({
      data: data,
    });
  },
  initializeProfileSection(value, checklist) {
    set({
      profileSection: value,
      loanEligibility: checklist,
    });
  },
}));

export default useProfileStore;
