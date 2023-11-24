import { create } from "zustand";
import { DateRange } from "react-day-picker";

type UsrFilteringState = {
  name: string;
  userId: string;
  departmentNameList: Array<string>;
  activeStatus: Array<string | undefined>;
  regDate: DateRange | undefined | { [key: string]: string };
};

type UsrFilteringAction = {
  action: {
    setName: (value: string) => void;
    setUserId: (value: string) => void;
    deleteName: () => void;
    deleteUserId: () => void;
    setDepartmentName: (value: string) => void;
    deleteDepartmentName: (value: string) => void;
    resetDepartmentName: () => void;
    setActiveStatus: (value: string) => void;
    deleteActiveStatus: (value: string) => void;
    setRegDate: (value: any, type: string) => void;
    reset: () => void;
  };
};

const useUsrFilteringStore = create<UsrFilteringState & UsrFilteringAction>()(
  (set) => ({
    name: "",
    userId: "",
    departmentNameList: [],
    activeStatus: [],
    regDate: undefined,
    action: {
      setName: (value) => set(() => ({ name: value })),
      setUserId: (value) => set(() => ({ userId: value })),
      deleteName: () => set(() => ({ name: "" })),
      deleteUserId: () => set(() => ({ userId: "" })),
      setDepartmentName: (name) => {
        set((state) =>
          state.departmentNameList.includes(name)
            ? {
                departmentNameList: state.departmentNameList.filter(
                  (el) => el !== name
                ),
              }
            : { departmentNameList: [...state.departmentNameList, name] }
        );
      },
      deleteDepartmentName: (name) =>
        set((state) => ({
          departmentNameList: state.departmentNameList.filter(
            (el) => el !== name
          ),
        })),
      resetDepartmentName: () => set((state) => ({ departmentNameList: [] })),
      setActiveStatus: (value) =>
        set((state) =>
          state.activeStatus.includes(value)
            ? { activeStatus: state.activeStatus.filter((el) => el !== value) }
            : { activeStatus: [...state.activeStatus, value] }
        ),
      deleteActiveStatus: (value) =>
        set((state) => ({
          activeStatus: state.activeStatus.filter((el) => el !== value),
        })),
      setRegDate: (value, type) =>
        set((state) => ({ regDate: { ...state.regDate, [type]: value } })),
      reset: () =>
        set(() => ({
          name: "",
          userId: "",
          departmentNameList: [],
          activeStatus: [],
          regDate: undefined,
        })),
    },
  })
);

export const useUserFilteringState = () => {
  const name = useUsrFilteringStore((state) => state.name);
  const userId = useUsrFilteringStore((state) => state.userId);
  const departmentNameList = useUsrFilteringStore(
    (state) => state.departmentNameList
  );
  const activeStatus = useUsrFilteringStore((state) => state.activeStatus);
  const regDate = useUsrFilteringStore((state) => state.regDate);
  return { name, userId, departmentNameList, activeStatus, regDate };
};

export const useTextFieldState = () => {
  const name = useUsrFilteringStore((state) => state.name);
  const userId = useUsrFilteringStore((state) => state.userId);
  return { name, userId };
};

export const useComboboxFieldState = () => {
  const departmentNameList = useUsrFilteringStore(
    (state) => state.departmentNameList
  );
  return { departmentNameList };
};

export const useSelectFieldState = () => {
  const activeStatus = useUsrFilteringStore((state) => state.activeStatus);
  return { activeStatus };
};

export const useDatePickerFieldState = () => {
  const regDate = useUsrFilteringStore((state) => state.regDate);
  return { regDate };
};

export const useUsrFilteringAction = () =>
  useUsrFilteringStore((state) => state.action);
