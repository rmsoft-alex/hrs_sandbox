import { create } from "zustand";

// 상태 타입 정의
interface NodeIdState {
  departmentIdx: number;
  setDepartmentIdx: (newValue: number) => void;
}

export const DepartmentStore = create<NodeIdState>((set) => ({
  departmentIdx: 0,
  setDepartmentIdx: (newValue) => set({ departmentIdx: newValue }),
}));
