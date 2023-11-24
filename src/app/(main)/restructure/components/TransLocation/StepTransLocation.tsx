import React, { useEffect, useState } from "react";
import { useMemberGroup, useTree } from "../../store/useRestructureStore";
import { TreeDataType, MemberType } from "../../types";
import { NodeModel } from "@minoru/react-dnd-treeview";
import UpdatedTree from "./UpdatedTree";
import MemberHistory from "./MemberHistory";
import TreeView from "@/components/tree/TreeView";
import TransLotation from "./TransLotation";
import TooltipIcon from "@/components/ui/TooltipIcon";
import { HelpCircle } from "lucide-react";
import Description from "./Description";

interface Props {
  isPending: boolean;
}

const StepTransLocation = ({ isPending }: Props) => {
  const memberGroup = useMemberGroup();
  const tree = useTree();

  const [selectedNode, setSelectedNode] = useState<NodeModel<TreeDataType>[]>(
    []
  );
  const [selectedTargetNode, setSelectedTargetNode] = useState<
    NodeModel<TreeDataType>[]
  >([]);
  const [selectedOriginGroupMembers, setSelectedOriginGroupMembers] = useState<
    MemberType[]
  >([]);
  const [selectedUpdateGroupMembers, setSelectedUpdateGroupMembers] = useState<
    MemberType[]
  >([]);

  const handleSelectOrigin = (selectedNodes: NodeModel<TreeDataType>[]) => {
    renderOriginMemberTable(memberGroup || [], selectedNodes);
  };

  const handleSelectUpdate = (selectedNodes: NodeModel<TreeDataType>[]) => {
    renderUpdatedMemberTable(memberGroup || [], selectedNodes);
  };

  const handleRerender = (members: MemberType[]) => {
    renderOriginMemberTable(members, selectedNode);
    renderUpdatedMemberTable(members, selectedTargetNode);
  };

  const renderOriginMemberTable = (
    members: MemberType[],
    selectedNodes: NodeModel<TreeDataType>[]
  ) => {
    setSelectedOriginGroupMembers(
      members.filter(
        (member) =>
          selectedNodes.some((node) => node.id === member.departmentTempIdx) &&
          !member.restructureCode
      ) || []
    );
  };
  const renderUpdatedMemberTable = (
    members: MemberType[],
    selectedNodes: NodeModel<TreeDataType>[]
  ) => {
    setSelectedUpdateGroupMembers(
      members.filter((member) =>
        selectedNodes.some((node) => node.id === member.departmentTempIdx)
      ) || []
    );
  };

  useEffect(() => {
    if (memberGroup) {
      renderOriginMemberTable(memberGroup, selectedNode);
      renderUpdatedMemberTable(memberGroup, selectedTargetNode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberGroup, selectedNode, selectedTargetNode]);
  return (
    <>
      <div className="grid grid-cols-3 gap-x-[30px] gap-y-[30px] pb-5">
        <div className="relative h-6">
          <Description />
        </div>
        <div className="col-start-1 row-start-2">
          <h3 className="semi-title px-2 mb-2">원본 조직도</h3>
          <div className="border pb-2 h-[600px] relative">
            <TreeView
              tree={
                tree?.filter(
                  (node) =>
                    !(
                      node.data?.activeType === "Y" && node.data?.restructureIdx
                    )
                ) || []
              }
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              multiSelection={true}
              onClick={handleSelectOrigin}
              canSearch={true}
            />
          </div>
        </div>
        <div className="col-start-2 row-start-2">
          <h3 className="semi-title px-2 mb-2 flex items-center">
            예정 조직도{" "}
            <TooltipIcon
              icon={
                <HelpCircle className="w-4 h-4 ml-1 cursor-pointer text-white fill-orange-200" />
              }
              content={
                "최종 반영 시 적용 될 예정 조직도 입니다. 드래그 앤 드랍하여 부서의 관제순서를 변경 할 수 있습니다."
              }
              className="max-w-xs "
              orange
            />
          </h3>
          <UpdatedTree
            selectedNode={selectedTargetNode}
            setSelectedNode={setSelectedTargetNode}
            onClick={handleSelectUpdate}
          />
        </div>
        <div className="col-start-3 row-start-2 flex flex-col h-full">
          <TransLotation
            originGroupMembers={selectedOriginGroupMembers}
            targetGroupMembers={selectedUpdateGroupMembers}
            originGroup={selectedNode}
            targetGroup={selectedTargetNode[0]}
            handleRerender={handleRerender}
          />
        </div>
        <div className="col-start-1 row-start-3 col-span-3">
          <MemberHistory isPending={isPending} />
        </div>
      </div>
    </>
  );
};

export default StepTransLocation;
