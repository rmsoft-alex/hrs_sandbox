import { DataTable, useTableState } from "@/components/common/table/table";
import React from "react";
import { MemberType, TreeDataType } from "../../types";
import { originMemberGroupColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import TargetGroupMembers from "./TargetGroupMembers";
import {
  useMemberGroup,
  useRestructureActions,
} from "../../store/useRestructureStore";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Original {
  original: MemberType;
}

interface Props {
  originGroupMembers: MemberType[];
  targetGroupMembers: MemberType[];
  originGroup: NodeModel<TreeDataType>[];
  targetGroup: NodeModel<TreeDataType>;
  handleRerender: (members: MemberType[]) => void;
}

const TransLotation = ({
  originGroupMembers,
  targetGroupMembers,
  originGroup,
  targetGroup,
  handleRerender,
}: Props) => {
  const { toast } = useToast();
  const table = useTableState();
  const memberGroup = useMemberGroup();
  const { translocationDepartment } = useRestructureActions();

  const handleTransLocation = () => {
    if (originGroup.length === 0)
      return toast({
        description: "원본 조직도에서 부서를 선택해주십시오.",
        variant: "destructive",
        duration: 3000,
      });
    if (table.selectedRows.length === 0)
      return toast({
        description:
          "선택 부서 구성원 중 부서 이동을 원하는 구성원을 선택해주십시오.",
        variant: "destructive",
        duration: 3000,
      });

    if (!targetGroup)
      return toast({
        description: "예정 조직도에서 이동 대상 부서를 선택해주십시오.",
        variant: "destructive",
        duration: 3000,
      });
    const members =
      memberGroup?.map((member) => {
        if (member.departmentTempIdx === targetGroup.id) return member;
        return table.selectedRows.some(
          (row) => (row as Original).original.userInfoIdx === member.userInfoIdx
        )
          ? {
              ...member,
              departmentTempIdx: Number(targetGroup?.id),
              departmentTempName: targetGroup?.text,
            }
          : member;
      }) || [];

    translocationDepartment(
      table.selectedRows.map((row) => (row as Original).original),
      targetGroup
    );
    handleRerender(members);
    table.reset();
  };

  return (
    <>
      <div className="grow flex flex-col shrink-0">
        <h3 className="semi-title px-2 mb-2">선택 부서 구성원</h3>
        <div className={cn("border border-b-0")}>
          <DataTable
            data={originGroupMembers || []}
            columns={originMemberGroupColumns}
            totalCount={originGroupMembers?.length || 0}
            pageSizeView={false}
            pageIndexView={false}
            paginationBtn={false}
            selectedCountView={false}
            className="h-[260px]"
            placeholder={
              originGroup.length === 0 ? (
                <div>원본 조직도에서 부서를 선택해주세요.</div>
              ) : (
                <div>선택 된 부서에 배치 된 구성인원이 없습니다.</div>
              )
            }
            {...table}
          />
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          variant={"outline"}
          className="h-8 p-2"
          onClick={handleTransLocation}
        >
          <ChevronDown className="text-orange-500 w-4 h-4" />
        </Button>
      </div>
      <div className="grow flex flex-col shrink-0">
        <h3 className="semi-title px-2 mb-2">이동 대상 부서</h3>
        <TargetGroupMembers
          groupName={targetGroup?.text}
          selectedGroup={targetGroupMembers}
          originGroup={originGroup}
        />
      </div>
    </>
  );
};

export default TransLotation;
