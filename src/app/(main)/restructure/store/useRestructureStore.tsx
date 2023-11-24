import { create } from "zustand";
import {
  AbolishCodeEnum,
  AbolitioinHistoryType,
  CreateFormType,
  CreationHistoryType,
  MemberHistoryType,
  MemberRestructureCodeEnum,
  MemberType,
  StepState,
  TempDeletedDepartmentType,
  TempNewDepartmentType,
  TreeDataType,
} from "../types";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import useStore from "@/store/useStore";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { getAllChildsByParent } from "../util/getAllChildsByParent";
import { TempStorageReqType } from "@/api/restructure.api.schema";
import { getDepartmentTitleNameByCode } from "../util/getDepartmentTitleNameByCode";
import { formatUTC } from "@/utils/format";

interface RestructureStoreState {
  isSaved: { dept: boolean; user: boolean };
  step: StepState;
  tree: NodeModel<TreeDataType>[];
  updatedTree: NodeModel<TreeDataType>[];
  creationHistory: CreationHistoryType[];
  abolitionHistory: AbolitioinHistoryType[];
  memberHistory: MemberHistoryType[];
  memberGroup: MemberType[];
  tempStorage: TempStorageReqType;
  actions: {
    setDeptIsSaved: () => void;
    setUserIsSaved: () => void;
    setStep: (step: StepState) => void;
    setTree: (newTree: NodeModel<TreeDataType>[]) => void;
    setUpdatedTree: (newTree: NodeModel<TreeDataType>[]) => void;
    setCreationHistory: (records: CreationHistoryType[]) => void;
    setAbolitionHistory: (records: AbolitioinHistoryType[]) => void;
    setMemberHistory: (records: MemberHistoryType[]) => void;
    setMemberGroup: (memberGroup: MemberType[]) => void;
    setTempStorage: (tempStorage: TempStorageReqType) => void;
    createDepartment: (data: CreateFormType) => void; // 신규 부서 생성
    abolishDepartment: (dep: NodeModel<TreeDataType>[]) => void; // 부서 폐지
    translocationDepartment: (
      members: MemberType[],
      targetGroup: NodeModel<TreeDataType>
    ) => void; // 구성원 부서 이동
    updatePosition: (
      member: MemberType,
      position: { commonCodeName: string; commonCode: string },
      originGroup: NodeModel<TreeDataType>[]
    ) => void; // 구성원 직책 변경
    deleteCreationHistory: (
      histories: CreationHistoryType[]
    ) => number[] | null; // 부서 생성 이력 삭제
    deleteAbolitionHistory: (histories: AbolitioinHistoryType[]) => void; // 부서 폐지 이력 삭제
    deleteMemberHistory: (histories: MemberHistoryType[]) => void; // 구성원 변경 이력 삭제
    deleteMemberHistoryByDeletedDepartments: (members: number[]) => void;
  };
}

const useRestructureStore = create<RestructureStoreState>()(
  immer(
    persist(
      (set) => ({
        isSaved: { dept: true, user: true },
        step: "Creation",
        tree: [],
        updatedTree: [],
        creationHistory: [],
        abolitionHistory: [],
        memberHistory: [],
        memberGroup: [],
        tempStorage: {
          reqRestructureDepartmentDTO: {
            deleteDepartmentList: null,
            newDepartmentList: null,
          },
          reqRestructureUserDTO: null,
        },
        actions: {
          setDeptIsSaved: () =>
            set((state) => ({
              isSaved: { dept: true, user: state.isSaved.user },
            })),
          setUserIsSaved: () =>
            set((state) => ({
              isSaved: { dept: state.isSaved.dept, user: true },
            })),
          setStep: (step) => set(() => ({ step: step })),
          setTree: (newTree) => set(() => ({ tree: newTree })),
          setUpdatedTree: (newTree) => set(() => ({ updatedTree: newTree })),
          setCreationHistory: (records) =>
            set(() => ({ creationHistory: records })),
          setAbolitionHistory: (records) =>
            set(() => ({ abolitionHistory: records })),
          setMemberHistory: (records) =>
            set(() => ({ memberHistory: records })),
          setMemberGroup: (memberGroup) =>
            set(() => ({ memberGroup: memberGroup })),
          setTempStorage: (tempStorage) =>
            set(() => ({ tempStorage: tempStorage })),
          createDepartment: (data: CreateFormType) =>
            set((state) => {
              const tmpId = new Date().getTime();
              const prevs = data.prevDepartments
                ? getAllChildsByParent(
                    state.tree,
                    data.prevDepartments.map((prev) => prev.value as number)
                  )
                : [];
              let originTree: NodeModel<TreeDataType>[] = state.tree;
              let updated: NodeModel<TreeDataType>[] = state.updatedTree;
              let tempDeletedDepData: TempDeletedDepartmentType | null = null;

              // 새 부서 Data 생성
              const newTreeData: NodeModel<TreeDataType> = {
                id: tmpId,
                text: data.name,
                parent: data.parent,
                data: {
                  activeType: "Y",
                  departmentIdx: tmpId,
                  regulationOrder: 0,
                  restructureIdx: tmpId,
                  restructureCode: "HRS03030101",
                  restructureDetailCode: `${data.createType}`,
                  depth: data.depth,
                },
              };

              // 새부서 temp데이터
              const tempNewDepData: TempNewDepartmentType = {
                cmmnCode: "HRS03030101",
                cmmnCodeDetail: `${data.createType}`,
                departmentName: data.name,
                depth: data.depth,
                parentDepartmentTempIdx: Number(data.parent),
                previousDepartmentInfo:
                  data.createType === "HRS0303010104"
                    ? null
                    : prevs.map((prev) => Number(prev.id)),
                regDate: `${formatUTC(new Date())}`,
              };

              // 신설부서가 아닌경우 이전부서 핸들링
              if (data.createType !== "HRS0303010104") {
                const mapping = (tree: NodeModel<TreeDataType>) =>
                  prevs.some((prev) => prev.id === tree.id)
                    ? ({
                        ...tree,
                        data: {
                          ...tree.data,
                          activeType: "N",
                          restructureIdx: null,
                          restructureCode: "HRS03030102",
                          restructureDetailCode: `${data.deactiveType}`,
                        },
                      } as NodeModel<TreeDataType>)
                    : tree;

                // 조직도에 폐지 된 부서 업데이트
                originTree = state.tree.map(mapping);
                updated = state.updatedTree.map(mapping);

                const currentDeletedDep =
                  state.tempStorage.reqRestructureDepartmentDTO.deleteDepartmentList?.find(
                    (list) =>
                      list.departmentInfoList.some(
                        (dep) => dep.departmentTempIdx === prevs[0].id
                      )
                  );
                if (
                  !(
                    data.createType === "HRS0303010102" &&
                    currentDeletedDep &&
                    currentDeletedDep.cmmnCodeDetail === "HRS0303010202"
                  )
                ) {
                  // 분할로 인한 동일 부서 폐지 이력이 없는 경우
                  // 폐지 부서 temp 데이터 생성
                  tempDeletedDepData = {
                    cmmnCode: "HRS03030102",
                    cmmnCodeDetail: `${data.deactiveType}`,
                    departmentInfoList: prevs.map((prev) => ({
                      departmentTempIdx: Number(prev.id),
                      departmentName: prev.text,
                    })),
                    regDate: `${formatUTC(new Date())}`,
                  };
                }
              }

              const originNewTemp =
                state.tempStorage.reqRestructureDepartmentDTO
                  .newDepartmentList || [];
              const originDeleteTemp: TempDeletedDepartmentType[] =
                state.tempStorage.reqRestructureDepartmentDTO
                  .deleteDepartmentList || [];
              const deleteDepartmentList = tempDeletedDepData
                ? [...originDeleteTemp, tempDeletedDepData]
                : [...originDeleteTemp];

              return {
                isSaved: { dept: false, user: state.isSaved.user },
                tree: [...originTree, newTreeData],
                updatedTree: [...updated, newTreeData],
                tempStorage: {
                  ...state.tempStorage,
                  reqRestructureDepartmentDTO: {
                    newDepartmentList: [...originNewTemp, tempNewDepData],
                    deleteDepartmentList:
                      deleteDepartmentList.length === 0
                        ? null
                        : deleteDepartmentList,
                  },
                },
              };
            }),
          abolishDepartment: (deps) =>
            set((state) => {
              const mapping = (tree: NodeModel<TreeDataType>) =>
                deps.some((dep) => dep.id === tree.id) &&
                tree.data?.activeType === "Y"
                  ? {
                      ...tree,
                      data: {
                        ...tree.data,
                        activeType: "N",
                        restructureIdx: null,
                        restructureCode: "HRS03030102",
                        restructureDetailCode: "HRS0303010204",
                      },
                    }
                  : tree;

              // 조직도에 폐지 된 부서 업데이트
              const originTree = state.tree.map(mapping);
              const updatedTree = state.updatedTree.map(mapping);

              // 폐지 부서 tmp데이터
              const tempDeletedDepData: TempDeletedDepartmentType = {
                cmmnCode: "HRS03030102",
                cmmnCodeDetail: "HRS0303010204",
                departmentInfoList: deps
                  // 현재 생성한 tmp데이터에 이전부서로 인해 폐지된 다른 부서가 포함되어있는 경우 해당 부서 제외
                  .filter(
                    (dep) =>
                      !(
                        dep.data?.activeType === "N" &&
                        dep.data.restructureDetailCode !== "HRS0303010204"
                      )
                  )
                  .map((dep) => ({
                    departmentTempIdx: Number(dep.id),
                    departmentName: dep.text,
                  })),
                regDate: `${formatUTC(new Date())}`,
              };

              let originDeleteDepartments: TempDeletedDepartmentType[] | null =
                state.tempStorage.reqRestructureDepartmentDTO
                  .deleteDepartmentList;

              // 이전 이력에 현재 폐지 되는 부서가 폐지로 포함되어있는 경우 해당 부서 폐지이력 삭제
              if (
                originDeleteDepartments &&
                originDeleteDepartments?.some(
                  (origin) =>
                    origin.cmmnCodeDetail === "HRS0303010204" &&
                    origin.departmentInfoList.some((dep) =>
                      tempDeletedDepData.departmentInfoList.some(
                        (newTemp) =>
                          newTemp.departmentTempIdx === dep.departmentTempIdx
                      )
                    )
                )
              ) {
                originDeleteDepartments = originDeleteDepartments?.filter(
                  (origin) =>
                    !(
                      origin.cmmnCodeDetail === "HRS0303010204" &&
                      origin.departmentInfoList.some((dep) =>
                        tempDeletedDepData.departmentInfoList.some(
                          (newTemp) =>
                            newTemp.departmentTempIdx === dep.departmentTempIdx
                        )
                      )
                    )
                );
              }

              const deleteDepartmentList: TempDeletedDepartmentType[] =
                originDeleteDepartments
                  ? [...originDeleteDepartments, tempDeletedDepData]
                  : [tempDeletedDepData];

              return {
                isSaved: { dept: false, user: state.isSaved.user },
                tree: originTree,
                updatedTree: updatedTree,
                tempStorage: {
                  ...state.tempStorage,
                  reqRestructureDepartmentDTO: {
                    ...state.tempStorage.reqRestructureDepartmentDTO,
                    deleteDepartmentList: deleteDepartmentList,
                  },
                },
              };
            }),
          translocationDepartment: (members, targetGroup) =>
            set((state) => {
              let newHistories: MemberHistoryType[] = [...state.memberHistory];
              const getPrevDepartmentInfo = (member: MemberType) => {
                const preDep = state.tree.find(
                  (group) => member.departmentTempIdx === group.id
                );
                const preDepDeactiveType =
                  AbolishCodeEnum.find(
                    (code) => code.code === preDep?.data?.restructureDetailCode
                  )?.type || "NONE";
                const preDepDeactiveCode =
                  MemberRestructureCodeEnum.find(
                    (code) => code.type === preDepDeactiveType
                  )?.code || "HRS03030205";
                return { preDep, preDepDeactiveType, preDepDeactiveCode };
              };

              let originUserTemp =
                state.tempStorage.reqRestructureUserDTO || [];

              // 임시저장 데이터 생성
              members.map((member) => {
                if (
                  originUserTemp.some(
                    (temp) => temp.userInfoIdx === member.userInfoIdx
                  )
                ) {
                  // 임시저장 데이터에 유저의 변경 이력이 있는 경우 (직책변경이 일어난 경우) 데이터 수정
                  originUserTemp = originUserTemp.map((temp) =>
                    member.userInfoIdx === temp.userInfoIdx
                      ? {
                          ...temp,
                          newDepartmentTempIdx: Number(targetGroup.id),
                          newDepartmentTitleCode: temp.newTitleCode,
                          newTitleCode: null,
                        }
                      : temp
                  );
                } else {
                  // 임시저장 데이터에 유저의 변경 이력이 없는 경우 새로운 temp데이터 생성
                  originUserTemp = [
                    ...originUserTemp,
                    {
                      userName: member.name,
                      departmentUserRelationTempIdx:
                        member.departmentUserRelationTempIdx,
                      newDepartmentTempIdx: Number(targetGroup.id),
                      newDepartmentTitleCode: member.titleCode,
                      newTitleCode: null,
                      preDepartmentTempIdx: member.departmentTempIdx,
                      preTitleCode: member.titleCode,
                      restructureCode:
                        getPrevDepartmentInfo(member).preDep?.data
                          ?.activeType === "N"
                          ? getPrevDepartmentInfo(member).preDepDeactiveCode
                          : "HRS03030205",
                      userInfoIdx: Number(member.userInfoIdx),
                      regDate: `${formatUTC(new Date())}`,
                    },
                  ];
                }
              });

              // 구성원 부서 정보 업데이트
              const updatedMemberGroup = state.memberGroup.map((member) => {
                // 업데이트 대상이 아닌 구성원 제외
                if (member.departmentTempIdx === targetGroup.id) return member;
                if (
                  !members.some(
                    (selectedMember) =>
                      selectedMember.userInfoIdx === member.userInfoIdx
                  )
                )
                  return member;

                // 구성원의 이전 이력이 남아있는 경우 기존의 이력을 덮어씀
                if (
                  newHistories.some(
                    (history) => history.userInfoIdx === member.userInfoIdx
                  )
                ) {
                  newHistories = newHistories.map((history) =>
                    history.userInfoIdx === member.userInfoIdx
                      ? {
                          ...history,
                          newDepartmentTempIdx: Number(targetGroup.id),
                          newDepartmentName: targetGroup.text,
                        }
                      : history
                  );
                  // 구성원 이전 이력이 남아있지 않은 경우 신규 이력 생성
                } else {
                  const newHistory: MemberHistoryType = {
                    userInfoIdx: Number(member.userInfoIdx),
                    userName: member.name,
                    restructureCode:
                      getPrevDepartmentInfo(member).preDep?.data?.activeType ===
                      "N"
                        ? getPrevDepartmentInfo(member).preDepDeactiveCode
                        : "HRS03030205",
                    newDepartmentTitleCode: member.titleCode,
                    newDepartmentTempIdx: Number(targetGroup.id),
                    newDepartmentName: targetGroup.text,
                    newTitleCode: null,
                    preTitleCode: member.titleCode,
                    preDepartmentTempIdx: member.departmentTempIdx,
                    preDepartmentName: member.departmentName,
                    departmentUserRelationTempIdx:
                      member.departmentUserRelationTempIdx,
                    regDate: `${formatUTC(new Date())}`,
                  };
                  newHistories.unshift(newHistory);
                }
                return {
                  ...member,
                  departmentTempIdx: Number(targetGroup.id),
                  departmentName: targetGroup.text,
                  restructureCode:
                    getPrevDepartmentInfo(member).preDep?.data?.activeType ===
                    "N"
                      ? getPrevDepartmentInfo(member).preDepDeactiveCode
                      : "HRS03030205",
                };
              });
              return {
                isSaved: { dept: state.isSaved.dept, user: false },
                memberGroup: updatedMemberGroup,
                memberHistory: newHistories,
                tempStorage: {
                  ...state.tempStorage,
                  reqRestructureUserDTO:
                    originUserTemp.length === 0 ? null : originUserTemp,
                },
              };
            }),
          updatePosition: (member, position) =>
            set((state) => {
              let newHistories: MemberHistoryType[] = [];
              const prevHistory = state.memberHistory.find(
                (history) => history.userInfoIdx === member.userInfoIdx
              );

              // 구성원 직책 정보 업데이트
              let members = state.memberGroup.map((origin) =>
                origin.userInfoIdx === member.userInfoIdx
                  ? {
                      ...origin,
                      titleCode: position.commonCode,
                      titleCodeName: position.commonCodeName,
                      restructureCode: "HRS03030205",
                    }
                  : origin
              );

              // 이력 생성
              if (prevHistory?.newDepartmentTempIdx) {
                // 구성원의 부서 이동이 있는 경우 기존 이력 수정
                newHistories = state.memberHistory.map((history) =>
                  history.userInfoIdx === member.userInfoIdx
                    ? {
                        ...history,
                        newDepartmentTitleCode: position.commonCode,
                      }
                    : history
                );
              } else if (prevHistory?.preTitleCode === position.commonCode) {
                // 기존의 직책과 같은 직책을 가지는 경우 기존의 직책 변경 이력을 삭제
                newHistories = state.memberHistory.filter(
                  (history) => history.userInfoIdx !== member.userInfoIdx
                );
                members = members.map((origin) =>
                  origin.userInfoIdx === member.userInfoIdx
                    ? {
                        ...origin,
                        restructureCode: null,
                      }
                    : origin
                );
              } else if (prevHistory) {
                // 이전의 직책 변경 이력이 있는 경우 기존의 이력을 덮어씀
                newHistories = state.memberHistory.map((history) =>
                  history.userInfoIdx === member.userInfoIdx
                    ? {
                        ...history,
                        newTitleCode: position.commonCode,
                      }
                    : history
                );
              } else {
                // 이전의 직책 변경 이력이 없는 경우 신규 이력 생성
                newHistories = [
                  {
                    userInfoIdx: Number(member.userInfoIdx),
                    userName: member.name,
                    restructureCode: "HRS03030205",
                    preTitleCode: member.titleCode,
                    preDepartmentTempIdx: member.departmentTempIdx,
                    preDepartmentName: member.departmentName,
                    newDepartmentTitleCode: null,
                    newDepartmentTempIdx: null,
                    newDepartmentName: null,
                    newTitleCode: position.commonCode,
                    departmentUserRelationTempIdx:
                      member.departmentUserRelationTempIdx,
                    regDate: `${formatUTC(new Date())}`,
                  },
                  ...state.memberHistory,
                ];
              }

              return {
                isSaved: { dept: state.isSaved.dept, user: false },
                memberGroup: members,
                memberHistory: newHistories,
                tempStorage: {
                  ...state.tempStorage,
                  reqRestructureUserDTO: newHistories,
                },
              };
            }),
          deleteCreationHistory: (histories) => {
            let idxs: number[] | null = null;
            set((state) => {
              let updatedMemberGroup: MemberType[] | null = null;
              let updatedMemberHistory = state.memberHistory;
              let prevs: number[] = [];

              histories.forEach((history) => {
                if (history.previousDepartmentInfo) {
                  history.previousDepartmentInfo.forEach((prevDep) => {
                    if (
                      !state.creationHistory.some(
                        (originHistory) =>
                          originHistory.id !== history.id &&
                          originHistory.previousDepartmentInfo?.some(
                            (originPrev) => originPrev === prevDep
                          )
                      )
                    ) {
                      // 기존 신설이력의 이전부서 목록 중 현재 삭제하려는 이력의 이전부서가 포함되어있는 경우 해당 이전부서 삭제하지 않음
                      prevs = [...prevs, prevDep];
                    }
                  });
                }
              });

              const mapping = (node: NodeModel<TreeDataType>) =>
                prevs.some((prev) => prev === node.id)
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        activeType: "Y",
                        restructureCode: null,
                        restructureDetailCode: null,
                        restructureIdx: null,
                      },
                    }
                  : node;

              // 조직도에 폐지 된 부서 정보 리셋 및 신규 부서 삭제
              const originTree = state.tree
                .map(mapping)
                .filter(
                  (node) =>
                    !(
                      node.data?.activeType === "Y" &&
                      node.data.restructureIdx !== null
                    )
                );
              const updatedTree = state.updatedTree
                .map(mapping)
                .filter(
                  (node) =>
                    !(
                      node.data?.activeType === "Y" &&
                      node.data.restructureIdx !== null
                    )
                );

              // 생성 이력 삭제
              const filteredCreationHistory = state.creationHistory.filter(
                (origin) =>
                  !histories.some((history) => origin.id === history.id)
              );

              // 폐지 된 이전부서 이력 삭제 (( 부서 생성 이력에서 폐지부서 이력의 id값을 찾을 방법이 없어 주먹구구식으로 해결...개선필요 ))
              const filterdAbolitionHistory = state.abolitionHistory.filter(
                (history) =>
                  !history.departmentInfoList.some((deletedDep) =>
                    prevs.some((prev) => prev === deletedDep.departmentTempIdx)
                  )
              );

              state.memberGroup.forEach((member) => {
                if (
                  histories.some(
                    (history) =>
                      history.departmentTempIdx === member.departmentTempIdx
                  )
                ) {
                  const prevIdxs = idxs || [];
                  idxs = [...prevIdxs, Number(member.userInfoIdx)];
                }
              });

              return {
                isSaved: { dept: false, user: state.isSaved.user },
                tree: originTree,
                updatedTree: updatedTree,
                memberGroup: updatedMemberGroup
                  ? updatedMemberGroup
                  : state.memberGroup,
                creationHistory: filteredCreationHistory,
                abolitionHistory: filterdAbolitionHistory,
                memberHistory: updatedMemberHistory,
                tempStorage: {
                  reqRestructureDepartmentDTO: {
                    deleteDepartmentList: filterdAbolitionHistory,
                    newDepartmentList: filteredCreationHistory,
                  },
                  reqRestructureUserDTO:
                    state.tempStorage.reqRestructureUserDTO,
                },
              };
            });
            return idxs;
          },
          deleteAbolitionHistory: (histories) =>
            set((state) => {
              const mapping = (node: NodeModel<TreeDataType>) =>
                histories.some((history) =>
                  history.departmentInfoList.some(
                    (dep) => dep.departmentTempIdx === node.id
                  )
                )
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        activeType: "Y",
                        restructureIdx: null,
                        restructureCode: null,
                        restructureDetailCode: null,
                      },
                    }
                  : node;

              // 조직도에 폐지 된 부서 정보 리셋
              const originTree = state.tree.map(mapping);
              // 변경 조직도에 폐지 된 부서 정보 리셋 및 신규 부서 삭제
              const updatedTree = state.updatedTree.map(mapping);

              // 폐지 이력 삭제
              const filterdAbolitionHistory = state.abolitionHistory.filter(
                (origin) =>
                  !histories.some((history) => origin.id === history.id)
              );

              return {
                isSaved: { dept: false, user: state.isSaved.user },
                tree: originTree,
                updatedTree: updatedTree,
                abolitionHistory: filterdAbolitionHistory,
                tempStorage: {
                  reqRestructureDepartmentDTO: {
                    deleteDepartmentList: filterdAbolitionHistory,
                    newDepartmentList:
                      state.tempStorage.reqRestructureDepartmentDTO
                        .newDepartmentList,
                  },
                  reqRestructureUserDTO:
                    state.tempStorage.reqRestructureUserDTO,
                },
              };
            }),
          deleteMemberHistory: (histories) =>
            set((state) => {
              // 구성원 데이터 복구
              const updatedMemberGroup = state.memberGroup.map((member) => {
                const currentHistory = histories.find(
                  (history) => history.userInfoIdx === member.userInfoIdx
                );
                if (currentHistory) {
                  return {
                    ...member,
                    restructureCode: null,
                    departmentName: currentHistory.preDepartmentName,
                    departmentTempIdx: currentHistory.preDepartmentTempIdx,
                    titleCode: currentHistory.preTitleCode,
                    titleCodeName: getDepartmentTitleNameByCode(
                      currentHistory.preTitleCode
                    ),
                  };
                }
                return member;
              });

              // 이력 삭제
              const updatedMemberHistory = state.memberHistory.filter(
                (history) =>
                  !histories.some(
                    (selected) => selected.userInfoIdx === history.userInfoIdx
                  )
              );

              // tmp 데이터 삭제
              const originUserTemp =
                state.tempStorage.reqRestructureUserDTO || [];

              const filterRelationTemp = originUserTemp.filter(
                (prev) =>
                  !histories.some(
                    (history) => history.userInfoIdx === prev.userInfoIdx
                  )
              );

              return {
                isSaved: { dept: state.isSaved.dept, user: false },
                memberGroup: updatedMemberGroup,
                memberHistory: updatedMemberHistory,
                tempStorage: {
                  ...state.tempStorage,
                  reqRestructureUserDTO: filterRelationTemp,
                },
              };
            }),
          deleteMemberHistoryByDeletedDepartments: (members) =>
            set((state) => {
              let updatedMemberHistory = state.memberHistory;

              const updatedMemberGroup = state.memberGroup.map((member) => {
                if (
                  members.some((memberId) => memberId === member.userInfoIdx)
                ) {
                  //해당 구성원의 부서 이동/직책 변경 이력 삭제
                  updatedMemberHistory = updatedMemberHistory.filter(
                    (history) => history.userInfoIdx !== member.userInfoIdx
                  );

                  const currentHistory = state.memberHistory.find(
                    (history) => history.userInfoIdx === member.userInfoIdx
                  );
                  // 구성원의 부서 이동/직책 변경 사항 복구
                  return {
                    ...member,
                    restructureCode: null,
                    departmentTempIdx: currentHistory?.preDepartmentTempIdx,
                    departmentName: `${currentHistory?.preDepartmentName}`,
                    titleCode: `${currentHistory?.preTitleCode}`,
                    titleCodeName: getDepartmentTitleNameByCode(
                      currentHistory?.preTitleCode
                    ),
                  };
                } else return member;
              });

              return {
                isSaved: { dept: false, user: false },
                memberGroup: updatedMemberGroup,
                memberHistory: updatedMemberHistory,
                tempStorage: {
                  ...state.tempStorage,
                  reqRestructureUserDTO: updatedMemberHistory,
                },
              };
            }),
        },
      }),
      {
        name: "restructure-storage",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          step: state.step,
        }),
      }
    )
  )
);

export const useIsSaved = () =>
  useStore(useRestructureStore, (state) => state.isSaved);
export const useStep = () =>
  useStore(useRestructureStore, (state) => state.step);
export const useTree = () =>
  useStore(useRestructureStore, (state) => state.tree);
export const useUpdatedTree = () =>
  useStore(useRestructureStore, (state) => state.updatedTree);
export const useCreationHistory = () =>
  useStore(useRestructureStore, (state) => state.creationHistory);
export const useAbolitionHistory = () =>
  useStore(useRestructureStore, (state) => state.abolitionHistory);
export const useMemberHistory = () =>
  useStore(useRestructureStore, (state) => state.memberHistory);
export const useMemberGroup = () =>
  useStore(useRestructureStore, (state) => state.memberGroup);
export const useTempStorage = () =>
  useStore(useRestructureStore, (state) => state.tempStorage);
export const useRestructureActions = () =>
  useRestructureStore((state) => state.actions);
