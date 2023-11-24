import React, { useEffect, useState } from "react";
import CreateForm from "./CreateForm";
import CreationHistory from "./CreationHistory";
import { useTree } from "../../store/useRestructureStore";
import { TreeDataType } from "../../types";
import { NodeModel } from "@minoru/react-dnd-treeview";
import TreeView from "@/components/tree/TreeView";

interface Props {
  refresh: () => void;
  isPending: boolean;
}

const StepCreation = ({ refresh, isPending }: Props) => {
  const tree = useTree();
  const [selectedNode, setSelectedNode] = useState<NodeModel<TreeDataType>[]>(
    []
  );

  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[auto_1fr] h-[746px] gap-4">
      <div className="row-span-2 border pb-2 h-[746px] relative">
        <TreeView
          tree={tree || []}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          treeName={"조직도"}
          disable
        />
      </div>
      <CreateForm refresh={refresh} />
      <CreationHistory isPending={isPending} />
    </div>
  );
};

export default StepCreation;
