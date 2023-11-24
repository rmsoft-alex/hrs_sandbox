import { create } from "zustand";

interface titleCodeState {
  changeTitleCode: string;
  userInfoIdx: number;
}

interface RemoveMemberState {
  userInfoIdx: number;
}
interface DeptModalState {
  removeMember: RemoveMemberState[];
  setRemoveMember: (members: RemoveMemberState[]) => void;

  regulationOrder: number;
  setRegulationOrder: (newValue: number) => void;

  deptTitleCode: titleCodeState[];
  setDeptTitleCode: (userInfoIdx: number, listFilter: string) => void;
  resetDeptTitleCode: () => void;
}

export const DeptModalStore = create<DeptModalState>((set) => ({
  //포함구성원에서 제거될 멤버
  removeMember: [],
  setRemoveMember: (members) => set({ removeMember: members }),

  //부서의 관제 순서
  regulationOrder: 0,
  setRegulationOrder: (newValue) => set({ regulationOrder: newValue }),

  //직책변경
  deptTitleCode: [],
  setDeptTitleCode: (userInfoIdx, changeTitleCode) =>
    set((state) => {
      // userInfoIdx가 이미 존재하는지 확인
      const existingIndex = state.deptTitleCode.findIndex(
        (item) => item.userInfoIdx === userInfoIdx
      );

      // userInfoIdx가 이미 존재하는 경우 해당 요소만 업데이트
      if (existingIndex !== -1) {
        state.deptTitleCode[existingIndex] = { userInfoIdx, changeTitleCode };
      } else {
        // userInfoIdx가 존재하지 않는 경우 새로운 titleCodeState 객체를 추가
        const updatedTitleCodeState: titleCodeState = {
          userInfoIdx,
          changeTitleCode,
        };
        state.deptTitleCode.push(updatedTitleCodeState);
      }

      return { ...state };
    }),
  resetDeptTitleCode: () => set({ deptTitleCode: [] }), // 초기화 함수 정의
}));
