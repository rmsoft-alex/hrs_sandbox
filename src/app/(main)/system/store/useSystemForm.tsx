import { create } from "zustand";

// 상태 타입 정의
interface SystemStoreState {
  systemName: string;
  setSystemName: (newValue: string) => void;

  systemDomain: string;
  setSystemDomain: (newValue: string) => void;

  systemActive: string;
  setSystemActive: (newValue: string) => void;

  description: string;
  setDescription: (newValue: string) => void;
}

export const SystemStore = create<SystemStoreState>((set) => ({
  //시스템명
  systemName: "",
  setSystemName: (newValue) => set({ systemName: newValue }),

  //시스템도메인
  systemDomain: "",
  setSystemDomain: (newValue) => set({ systemDomain: newValue }),

  //사용여부
  systemActive: "",
  setSystemActive: (newValue) => set({ systemActive: newValue }),

  //설명
  description: "",
  setDescription: (newValue) => set({ description: newValue }),
}));
