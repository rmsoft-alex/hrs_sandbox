import { create } from "zustand";
import { UserDept } from "../type";

type UsrDeptState = {
  userDept: UserDept[];
};

type UsrDeptAction = {
  action: {
    initializeDept: (dept: UserDept[]) => void;
    addDept: (selected: number) => void;
    setTitle: (selected: string, idx: number) => void;
    setMainDepartmentYn: (selected: string, idx: number) => void;
    deleteRow: (idx: number) => void;
  };
};

const useUsrDeptStore = create<UsrDeptState & UsrDeptAction>()((set) => ({
  userDept: [],
  action: {
    initializeDept: (dept) => set(() => ({ userDept: [...dept] })),
    addDept: (idx) =>
      set((state) =>
        state.userDept.find(({ departmentIdx }) => departmentIdx === idx)
          ? { userDept: state.userDept }
          : {
              userDept: [
                ...state?.userDept,
                {
                  departmentName: undefined,
                  crudOperationType: undefined,
                  relationIdx: undefined,
                  departmentIdx: idx,
                  departmentTitleCode: undefined,
                  mainDepartmentYn: undefined,
                },
              ],
            }
      ),
    setTitle: (departmentTitleCode, idx) =>
      set((state) => ({
        userDept: state.userDept.map((el) =>
          el.departmentIdx === idx ? { ...el, departmentTitleCode } : el
        ),
      })),
    setMainDepartmentYn: (mainDepartmentYn, idx) =>
      set((state) => ({
        userDept: state.userDept.map((el) =>
          el.departmentIdx === idx ? { ...el, mainDepartmentYn } : el
        ),
      })),
    deleteRow: (idx) =>
      set((state) => ({
        userDept: state.userDept.filter(
          ({ departmentIdx }) => departmentIdx !== idx
        ),
      })),
  },
}));

export const useUsrDeptState = () => useUsrDeptStore((state) => state.userDept);

export const useUsrDeptAction = () => useUsrDeptStore((state) => state.action);
