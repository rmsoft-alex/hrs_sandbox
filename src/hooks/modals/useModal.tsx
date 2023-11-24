import { create } from "zustand";

// 사용하고자 하는 모달의 이름을 등록
export type ModalType =
  | "example"
  | "test"
  | "sync"
  // | "systemAdd"
  // | "systemEdit"
  // | "systemCancel"
  // | "systemConfirm"
  | "systemEdit"
  | "systemAdd"
  | "department"
  | "restructure";

interface ModalData {
  title?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: any;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
