import { DateRange } from "react-day-picker";
import { create } from "zustand";

type SyncState = {
  syncIdx: number;
  syncTitle: string;
  success: string;
  description: string;
  regBy: string;
  regDate: DateRange | undefined | { [key: string]: string };
};

type SyncStateAction = {
  action: {
    setSyncTitle: (value: string) => void;
    setSuccess: (value: string) => void;
    setRegBy: (value: string) => void;
    setRegDate: (value: any, type: string) => void;
    deleteStatus: (value: string) => void;
    deleteRegBy: () => void;
    reset: () => void;
  };
};

export const useSyncStore = create<SyncState & SyncStateAction>()((set) => ({
  syncIdx: 0,
  syncTitle: "",
  success: "",
  description: "",
  regBy: "",
  regDate: undefined,
  action: {
    setSyncTitle: (value) => set(() => ({ syncTitle: value })),
    setSuccess: (value) => set(() => ({ success: value })),
    setRegBy: (value) => set(() => ({ regBy: value })),
    setRegDate: (value, type) =>
      set((state) => ({ regDate: { ...state.regDate, [type]: value } })),
    deleteStatus: () => set(() => ({ success: "" })),
    deleteRegBy: () => set(() => ({ regBy: "" })),
    reset: () =>
      set(() => ({
        syncIdx: 0,
        syncTitle: "",
        success: "",
        regBy: "",
        description: "",
        regDate: undefined,
      })),
  },
}));

export const useSyncFilterStore = () => {
  const success = useSyncStore((state) => state.success);
  const syncTitle = useSyncStore((state) => state.syncTitle);
  const regDate = useSyncStore((state) => state.regDate);
  const regBy = useSyncStore((state) => state.regBy);

  return { success, syncTitle, regDate, regBy };
};

export const useSyncRegDateAction = () => useSyncStore((state) => state.action);

export const useSyncStatusAction = () => useSyncStore((state) => state.action);
