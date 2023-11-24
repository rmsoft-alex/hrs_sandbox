import { create } from "zustand";

type UserModalState = {
  isRegisterModalOpen: boolean;
  isCancelModalOpen: boolean;
  isFirstEditModalOpen: boolean;
  isSecondEditModalOpen: boolean;
};

type UserModalAction = {
  action: {
    setIsRegisterModalOpen: (value: boolean) => void;
    setIsCancelModalOpen: (value: boolean) => void;
    setIsFirstEditModalOpen: (value: boolean) => void;
    setIsSecondEditModalOpen: (value: boolean) => void;
  };
};

const useModalStore = create<UserModalState & UserModalAction>()((set) => ({
  isRegisterModalOpen: false,
  isCancelModalOpen: false,
  isFirstEditModalOpen: false,
  isSecondEditModalOpen: false,
  action: {
    setIsRegisterModalOpen: (value) =>
      set(() => ({ isRegisterModalOpen: value })),
    setIsCancelModalOpen: (value) => set(() => ({ isCancelModalOpen: value })),
    setIsFirstEditModalOpen: (value) =>
      set(() => ({ isFirstEditModalOpen: value })),
    setIsSecondEditModalOpen: (value) =>
      set(() => ({ isSecondEditModalOpen: value })),
  },
}));

export const useModalState = () => {
  const isRegisterModalOpen = useModalStore(
    (state) => state.isRegisterModalOpen
  );
  const isCancelModalOpen = useModalStore((state) => state.isCancelModalOpen);
  const isFirstEditModalOpen = useModalStore(
    (state) => state.isFirstEditModalOpen
  );
  const isSecondEditModalOpen = useModalStore(
    (state) => state.isSecondEditModalOpen
  );
  return {
    isRegisterModalOpen,
    isCancelModalOpen,
    isFirstEditModalOpen,
    isSecondEditModalOpen,
  };
};
export const useRegisterModalState = () =>
  useModalStore((state) => state.isRegisterModalOpen);
export const useCancelModalState = () =>
  useModalStore((state) => state.isCancelModalOpen);
export const useFirstEditModalState = () =>
  useModalStore((state) => state.isFirstEditModalOpen);
export const useSecondEditModalState = () =>
  useModalStore((state) => state.isSecondEditModalOpen);
export const useModalAction = () => useModalStore((state) => state.action);
