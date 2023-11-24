import { create } from "zustand";
import { UsrEditReq, UsrRegisterReq } from "../type";

type ChangedUserState = {
  newUser: UsrRegisterReq;
  updatedUser: UsrEditReq;
};

type ChangedUserAction = {
  action: {
    setNewUser: (value: UsrRegisterReq) => void;
    setUpdatedUser: (value: UsrEditReq) => void;
  };
};

const useChangedUserStore = create<ChangedUserState & ChangedUserAction>()(
  (set) => ({
    newUser: {
      activeStatus: "",
      birth: "",
      employeeNumber: "",
      gender: "",
      name: "",
      nickname: "",
      titleCode: "",
      userId: "",
      userDepartmentRelationList: [
        {
          crudOperationType: "",
          departmentIdx: 0,
          departmentTitleCode: "",
          mainDepartmentYn: "",
        },
      ],
    },
    updatedUser: {
      userInfoIdx: 0,
      activeStatus: "",
      employeeNumber: "",
      name: "",
      nickname: "",
      titleCode: "",
      userDescription: "",
      userDepartmentRelationList: [
        {
          crudOperationType: "",
          relationIdx: 0,
          departmentIdx: 0,
          departmentTitleCode: "",
          mainDepartmentYn: "",
        },
      ],
    },
    action: {
      setNewUser: (value) => set(() => ({ newUser: value })),
      setUpdatedUser: (value) => set(() => ({ updatedUser: value })),
    },
  })
);

export const useNewUserState = () =>
  useChangedUserStore((state) => state.newUser);
export const useUpdatedUserState = () =>
  useChangedUserStore((state) => state.updatedUser);
export const useChangedUserAction = () =>
  useChangedUserStore((state) => state.action);
