import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modals/useModal";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMember,
  getIncludeMember,
  putMemberChange,
} from "@/api/department.api";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  TrainFrontTunnelIcon,
} from "lucide-react";
import IncludeMember from "./IncludeMember";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search } from "lucide-react";
import { DataTable, useTableState } from "@/components/common/table/table";
import { columns } from "./AllMemberColumns";
import { cn } from "@/lib/utils";
import { DepartmentStore } from "../store/useDepartmentStore";
import { DeptModalStore } from "../store/useModalStore";
import {
  reqFinalMemberType,
  getAllMemberType,
  getIncludetType,
} from "@/api/department.api.schema";
import { ConfirmModal } from "@/components/common/modals/confirm/confirmModal";
import { useToast } from "@/components/ui/use-toast";
import { Modal } from "@/components/common/modals/confirm/defaultModal";

const DeptModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "department";
  const tableState = useTableState();
  const rowsMap = tableState.selectedRows.map((item: any) => item.original);
  const { removeMember, regulationOrder, deptTitleCode, resetDeptTitleCode } =
    DeptModalStore();
  //부서 구성원
  const { departmentIdx } = DepartmentStore();

  //전체구성원 데이터받아오기
  const {
    data: allMemberData,
    isPending: allMemberIsPending,
    isFetching,
  } = useQuery({
    queryKey: ["DeptAllMember"],
    queryFn: () => getAllMember(),
    enabled: isOpen,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  //소속구성원 테이터 받아오기
  const { data: subMemberData, isPending: includeMemberIsPending } = useQuery({
    queryKey: ["getIncludeMember", departmentIdx],
    queryFn: () =>
      getIncludeMember(departmentIdx).then((subMemberDataRep) =>
        setDefaultData(subMemberDataRep)
      ),
    enabled: !!departmentIdx && isOpen && !!allMemberData,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // isSuccess (subMemberDataRep: { departmentIdx: number; departmentName: string; departmentTitleCode: string; departmentTitleCodeName: string; name: string; titleCode: string; titleCodeName: string | null; userInfoIdx: number; mainDepartment: string; relationIdx: number; }) => {
    //   setDefaultData(subMemberDataRep);
    // },
  });
  //검색어
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("title");
  //취소재확인모달
  const [cancelConfirmModalOpen, setCancelConfirmModalOpen] = useState(false);
  //저장재확인모달
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);

  //전체리스트
  const [list, setList] = useState<reqFinalMemberType[]>([]);
  //전체구성원
  const [allMemberTable, setAllMemberTable] = useState<reqFinalMemberType[]>(
    []
  );
  //전체구성원 검색어필터처리
  const [filteredData, setFilteredData] =
    useState<reqFinalMemberType[]>(allMemberTable);
  //기존구성원
  const [subMemberTable, setSubMemberTable] = useState<any[]>([]);

  const setDefaultData = (subMemberDataRep: getIncludetType) => {
    const list = allMemberData
      .filter((el: getAllMemberType) => el.departmentIdx !== departmentIdx)
      .map((el: getAllMemberType) => {
        if (Array.isArray(subMemberDataRep)) {
          const sub = subMemberDataRep.find(
            (_el: getIncludetType) => _el.userInfoIdx === el.userInfoIdx
          );
          if (sub) {
            return {
              ...el,
              subDepartmentIdx: sub.departmentIdx,
              subDepartmentName: sub.departmentName,
              mainDepartment: "N",
              subTitleCode: sub.titleCode,
              subTitleCodeName: sub.titleCodeName,
              relationIdx: sub.relationIdx,
              subDepartmentTitleCode: sub.departmentTitleCode,
              subDepartmentTitleCodeName: sub.departmentTitleCodeName,
              crudOperationType: "DEFAULT",
            };
          }
        }
        return {
          ...el,
          crudOperationType: "",
        };
      });
    setList(list);
  };
  useEffect(() => {
    if (isModalOpen) {
      setSearchType("title");
      setSearchValue("");
    }
  }, [isModalOpen]);

  /**
   * 왼쪽에 보여야할거 : '', 'delete'
   * 오른쪽에 보여야할거 : 'default', 'add', 'update'
   */
  useEffect(() => {
    if (list) {
      const allMembers: React.SetStateAction<any[]> = [];
      const subMembers: React.SetStateAction<any[]> = [];

      list.forEach((member) => {
        if (
          member.crudOperationType === "" ||
          member.crudOperationType === "DELETE"
        ) {
          allMembers.push(member);
        } else {
          subMembers.push(member);
        }
      });
      setSubMemberTable(subMembers);
      setAllMemberTable(allMembers);
    }
  }, [list]);

  //전체구성원 검색어 필터
  useEffect(() => {
    if (!allMemberTable) {
      setFilteredData([]);
      return;
    }

    const list = allMemberTable.filter(
      ({ name, departmentName }: { name: string; departmentName: string }) =>
        searchType === "title"
          ? departmentName.includes(searchValue)
          : name.includes(searchValue)
    );

    setFilteredData(list);
  }, [searchValue, allMemberTable, searchType]);

  //오른쪽화살표버튼
  const onClickRightBtn = () => {
    if (rowsMap) {
      const updatedAddMembersList = list.map((item) => {
        const isToAdd = rowsMap.some(
          (member) => member.userInfoIdx === item.userInfoIdx
        );
        if (isToAdd) {
          return {
            ...item,
            crudOperationType:
              item.crudOperationType === "DELETE" ? "DEFAULT" : "INSERT",
          };
        }

        return item;
      });

      // setList로 업데이트
      setList(updatedAddMembersList);
    }
  };

  //왼쪽화살표 버튼
  const onClickLeftBtn = () => {
    if (removeMember) {
      const updatedDeleteMembersList = list.map((item) => {
        const isToRemove = removeMember.some(
          (removeItem) => Number(removeItem) === item.userInfoIdx
        );
        // userInfoIdx가 removeMember에 포함되어 있다면
        if (isToRemove) {
          // crudOperationType이 "default"면 "defaultDelete", 그 외면 "delete" 부여
          return {
            ...item,
            crudOperationType:
              item.crudOperationType === "DEFAULT" ? "DELETE" : "",
          };
        }
        return item;
      });
      setList(updatedDeleteMembersList);
    }
  };
  // useEffect(() => {
  //   if (deptTitleCode.length > 0) {
  //     const isDifferent = deptTitleCode.some((item, index) => {
  //       // deptTitleCode와 prevDeptTitleCode의 각 요소를 비교
  //       return item.userInfoIdx !== prevDeptTitleCode[index]?.userInfoIdx;
  //     });
  //     if (isDifferent) {
  //       const updatedTitleCode = list.map((member) => {
  //         const isUpdated = deptTitleCode.find(
  //           (titleCode) => titleCode.userInfoIdx === member.userInfoIdx
  //         );
  //         if (isUpdated) {
  //           return {
  //             ...member,
  //             crudOperationType:
  //               member.crudOperationType === "DEFAULT"
  //                 ? "UPDATE"
  //                 : member.crudOperationType,
  //             subDepartmentTitleCode: isUpdated.changeTitleCode,
  //           };
  //         }

  //         return member;
  //       });
  //       setList(updatedTitleCode);
  //     }
  //   }
  // }, [deptTitleCode, list]);

  const success = () => {
    if (deptTitleCode.length > 0) {
      const updatedTitleCode = list.map((member) => {
        const isUpdated = deptTitleCode.find(
          (titleCode) => titleCode.userInfoIdx === member.userInfoIdx
        );
        if (isUpdated) {
          return {
            ...member,
            crudOperationType:
              member.crudOperationType === "DEFAULT"
                ? "UPDATE"
                : member.crudOperationType,
            subDepartmentTitleCode: isUpdated.changeTitleCode,
          };
        }

        return member;
      });
      setList(updatedTitleCode);
      setSaveConfirmModalOpen(true);
    } else {
      setSaveConfirmModalOpen(true);
    }
  };

  const recloseModal = () => {
    if (deptTitleCode.length > 0) {
      const updatedTitleCode = list.map((member) => {
        const isUpdated = deptTitleCode.find(
          (titleCode) => titleCode.userInfoIdx === member.userInfoIdx
        );
        if (isUpdated) {
          return {
            ...member,
            crudOperationType:
              member.crudOperationType === "DEFAULT"
                ? "UPDATE"
                : member.crudOperationType,
            subDepartmentTitleCode: isUpdated.changeTitleCode,
          };
        }

        return member;
      });
      setList(updatedTitleCode);
      setCancelConfirmModalOpen(true);
    } else {
      const unchanged = list.every(
        (member) =>
          member.crudOperationType === "DEFAULT" ||
          member.crudOperationType === ""
      );

      if (unchanged) {
        onClose();
      } else {
        setCancelConfirmModalOpen(true);
      }
    }
  };

  //취소재확인모달확인버튼
  const onCancelConfirm = () => {
    setCancelConfirmModalOpen(false);
    onClose();
    resetDeptTitleCode();
  };

  //저장재확인모달확인버튼
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      departmentIdx,
      regulationOrder,
      udateDepartmentUserList,
    }: {
      departmentIdx: number;
      regulationOrder: any;
      udateDepartmentUserList: {
        userInfoIdx: number;
        relationIdx: number;
        titleCode: string;
        mainDepartment: string;
        crudOperationType: string;
      }[];
    }) =>
      putMemberChange({
        departmentIdx,
        regulationOrder,
        udateDepartmentUserList,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getDeptDetail"] });
      if (res.code === 100) {
        setSaveConfirmModalOpen(false);
        onClose();
        toast({
          title: "수정 성공했습니다.",
          duration: 3000, // 3초 동안 표시
        });
      }
    },
    onError: (error) => {
      setSaveConfirmModalOpen(false);
      onClose();
      toast({
        description: "잘못된 접근입니다.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const onSaveConfirm = () => {
    const reqFinalMembers = list.filter(
      (finalmember: { crudOperationType: string }) =>
        finalmember.crudOperationType !== "" &&
        finalmember.crudOperationType !== "DEFAULT"
    );
    if (reqFinalMembers.length > 0) {
      const udateDepartmentUserList = reqFinalMembers.map(
        (finalmember: any) => ({
          userInfoIdx: finalmember.userInfoIdx,
          relationIdx: finalmember.relationIdx || null,
          titleCode:
            finalmember.subDepartmentTitleCode ||
            finalmember.departmentTitleCode,
          mainDepartment: finalmember.mainDepartment || "N",
          crudOperationType: finalmember.crudOperationType,
        })
      );

      mutation.mutate({
        departmentIdx: Number(departmentIdx),
        regulationOrder: null,
        udateDepartmentUserList,
      });
      resetDeptTitleCode();
      queryClient.invalidateQueries({ queryKey: ["getDeptDetail"] });
    } else {
      setSaveConfirmModalOpen(false);
      onClose();
      toast({
        title: "변경사항이 없습니다.",
        variant: "destructive",
        duration: 3000, // 3초 동안 표시
      });
    }
  };

  return (
    <>
      <AlertDialog open={isModalOpen}>
        <AlertDialogContent
          className={cn(
            "h-[553px] bg-white rounded-lg shadow max-w-[76rem] w-[76rem] overflow-auto	"
          )}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>부 부서원 관리</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex gap-[10px] mb-5">
            <Select defaultValue={"title"} onValueChange={setSearchType}>
              <SelectTrigger className="w-[102px] h-9 border-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title" className="hover:bg-orange-50">
                  부서명
                </SelectItem>
                <SelectItem value="name" className="hover:bg-orange-50">
                  이름
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="w-[286px] h-9 px-[10px] bg-white rounded-md border border-slate-400 flex justify-between items-center ">
              <input
                type="text"
                placeholder="검색"
                className="w-full hover:border-none text-black text-sm font-normal placeholder:text-black focus:outline-0"
                defaultValue=""
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  setSearchValue(e.currentTarget.value.trim())
                }
              />

              <Search size={16} color="#94A3B8" />
            </div>
          </div>
          {!allMemberIsPending && !isFetching && !includeMemberIsPending ? (
            <>
              <p className="text-right text-slate-400	text-sm mr-1">
                부 부서원 수 : {subMemberTable ? subMemberTable.length : "0"}명
              </p>

              <div className="flex justify-between items-center gap-[26px]">
                <DataTable
                  className="w-[538px] h-[294px]"
                  columns={columns}
                  totalCount={filteredData?.length}
                  data={filteredData}
                  selectedCountView={false}
                  pageSizeView={false}
                  pageIndexView={false}
                  paginationBtn={false}
                  {...tableState}
                />

                <div className="flex flex-col	gap-2">
                  <Button
                    variant={"outline"}
                    className="w-8 h-8 p-0"
                    onClick={onClickRightBtn}
                  >
                    <ChevronRight className="text-slate-400" />
                  </Button>

                  <Button
                    variant={"outline"}
                    className="w-8 h-8 p-0"
                    onClick={onClickLeftBtn}
                  >
                    <ChevronLeft className="text-slate-400" />
                  </Button>
                </div>

                <div>
                  <IncludeMember subMemberTable={subMemberTable} />
                </div>
              </div>
            </>
          ) : (
            <div className="h-[335px] flex justify-center items-center">
              Loading
            </div>
          )}

          <div className="space-x-2 flex items-center justify-end w-full">
            <Button
              className="px-[13px]"
              variant={"outline"}
              type="button"
              // onClick={() => setDefaultData(subMemberData)}
            >
              초기화
              <RefreshCcw size={14} className="text-slate-500 ml-[3px]" />
            </Button>
            <Button variant="outline" onClick={recloseModal}>
              취소
            </Button>
            <Button onClick={success}>확인</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <Modal
        isOpen={cancelConfirmModalOpen}
        onClose={() => setCancelConfirmModalOpen(false)}
        title="취소"
        description="변경 사항이 저장되지 않습니다. 그래도 취소 하시겠습니까?"
      >
        <div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setCancelConfirmModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={onCancelConfirm}>확인</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={saveConfirmModalOpen}
        onClose={() => setSaveConfirmModalOpen(false)}
        title="저장"
        description="변경 사항을 저장하시겠습니까?"
      >
        <div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setSaveConfirmModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={onSaveConfirm}>확인</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeptModal;
