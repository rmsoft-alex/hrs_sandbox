import React from "react";
import { MemberType, TreeDataType } from "../../types";
import TargetMemberItem from "./TargetMemberItem";
import { NodeModel } from "@minoru/react-dnd-treeview";
import ScrollEvent from "@/components/common/scrollbar/scrollEvent";
import { useDeptTitle } from "@/hooks/useCommon";

interface Props {
  groupName: string;
  selectedGroup: MemberType[];
  originGroup: NodeModel<TreeDataType>[];
}

const TargetGroupMembers = ({
  groupName,
  selectedGroup,
  originGroup,
}: Props) => {
  const { deptTitleList } = useDeptTitle();

  return (
    <div className="border select-none h-[260px] shrink-0 relative">
      <ScrollEvent className="overflow-auto">
        <div className="px-4 h-12 bg-slate-50 sticky top-0 left-0 text-sm text-slate-500 flex items-center font-semibold z-10">
          {groupName || "부서명"}
        </div>
        {!groupName && selectedGroup.length === 0 ? (
          <div className="flex justify-center items-center h-[96px] text-sm p-4 break-keep text-center">
            예정 조직도에서 부서를 선택 해주세요.
          </div>
        ) : groupName && selectedGroup.length === 0 ? (
          <div className="h-[96px] flex justify-center items-center text-sm p-4  break-keep text-center">
            부서에 배치 된 구성인원이 없습니다.
          </div>
        ) : (
          selectedGroup.map((member) => (
            <TargetMemberItem
              key={member.userInfoIdx}
              member={member}
              originGroup={originGroup}
              options={deptTitleList || []}
            />
          ))
        )}
      </ScrollEvent>
    </div>
  );
};

export default TargetGroupMembers;
