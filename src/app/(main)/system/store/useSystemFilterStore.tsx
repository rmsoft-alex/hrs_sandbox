import { create } from "zustand";

type SystemFilteringState = {
  systemCode: string;
  systemName: string;
  systemDomain: string;
};

type SystemFilteringAction = {
  action: {
    setSystemCode: (value: string) => void;
    setSystemName: (value: string) => void;
    setSystemDomain: (value: string) => void;
    deleteSystemCode: () => void;
    deleteSystemName: () => void;
    deleteSystemDomain: () => void;
    reset: () => void;
  };
};

const useSystemFilterStore = create<
  SystemFilteringState & SystemFilteringAction
>()((set) => ({
  systemCode: "",
  systemName: "",
  systemDomain: "",
  action: {
    setSystemCode: (value) => set(() => ({ systemCode: value })),
    setSystemName: (value) => set(() => ({ systemName: value })),
    setSystemDomain: (value) => set(() => ({ systemDomain: value })),
    deleteSystemCode: () => set(() => ({ systemCode: "" })),
    deleteSystemName: () => set(() => ({ systemName: "" })),
    deleteSystemDomain: () => set(() => ({ systemDomain: "" })),
    reset: () =>
      set(() => ({
        systemCode: "",
        systemName: "",
        systemDomain: "",
      })),
  },
}));

export const useSystemFieldState = () => {
  const systemCode = useSystemFilterStore((state) => state.systemCode);
  const systemName = useSystemFilterStore((state) => state.systemName);
  const systemDomain = useSystemFilterStore((state) => state.systemDomain);
  return { systemCode, systemName, systemDomain };
};

export const useSystemFilterAction = () =>
  useSystemFilterStore((state) => state.action);
