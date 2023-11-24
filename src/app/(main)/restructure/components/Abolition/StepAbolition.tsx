import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AbolitionHistory from "./AbolitionHistory";
import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { TreeDataType } from "../../types";
import TreeView from "@/components/tree/TreeView";
import {
  useRestructureActions,
  useTempStorage,
  useTree,
} from "../../store/useRestructureStore";
import { useToast } from "@/components/ui/use-toast";
import { getAllChildsByParent } from "../../util/getAllChildsByParent";
import useSaveTempData from "../../hooks/useSaveTempData";

interface Props {
  refresh: () => void;
  isPending: boolean;
}

const StepAbolition = ({ refresh, isPending }: Props) => {
  const { toast } = useToast();

  const tree = useTree();
  const tempStorage = useTempStorage();
  const { abolishDepartment } = useRestructureActions();
  const { mutate: tempMutate } = useSaveTempData(refresh);

  const [selectedNode, setSelectedNode] = useState<NodeModel<TreeDataType>[]>(
    []
  );
  const [isAbolished, setIsAbolished] = useState(false);

  const onClick = (nodes: NodeModel<TreeDataType>[], params: RenderParams) => {
    if (nodes.some((node) => node.data?.activeType !== "Y")) {
      setSelectedNode(selectedNode);
    }
    if (selectedNode[0]?.id === nodes[0]?.id) {
      setSelectedNode([]);
    }
  };

  const handleAbolish = () => {
    if (selectedNode.length === 0) {
      return toast({
        description: "선택 된 부서가 없습니다",
        variant: "destructive",
        duration: 3000,
      });
    }
    const prevs = getAllChildsByParent(tree || [], [
      selectedNode[0].id as number,
    ]);
    if (
      prevs.some(
        (node) => node.data?.activeType === "Y" && node.data?.restructureIdx
      )
    ) {
      return toast({
        description: "신설부서가 포함 된 부서는 폐지할 수 없습니다.",
        variant: "destructive",
        duration: 3000,
      });
    }
    abolishDepartment(prevs);
    setSelectedNode([]);
    setIsAbolished(true);
  };

  useEffect(() => {
    if (tempStorage && isAbolished) {
      tempMutate("DEPARTMENT", tempStorage);
      setIsAbolished(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempStorage]);
  return (
    <div className="grid grid-cols-[280px_1fr] gap-4">
      <div>
        <div className="border pb-2 h-[calc(100vh-280px)] min-h-[420px] relative">
          <TreeView
            tree={tree || []}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            treeName={"조직도"}
            multiSelection={false}
            onClick={onClick}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAbolish}
            className={`${
              selectedNode.length > 0
                ? "bg-orange-500 hover:bg-primary/90"
                : "bg-slate-400 hover:bg-slate-500 cursor-default"
            } `}
          >
            선택 부서 폐지
          </Button>
        </div>
      </div>
      <AbolitionHistory isPending={isPending} />
    </div>
  );
};

export default StepAbolition;
