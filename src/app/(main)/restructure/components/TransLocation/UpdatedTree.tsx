import TreeView from "@/components/tree/TreeView";
import React from "react";
import {
  useRestructureActions,
  useUpdatedTree,
} from "../../store/useRestructureStore";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { TreeDataType } from "../../types";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  selectedNode: NodeModel<TreeDataType>[];
  setSelectedNode: React.Dispatch<
    React.SetStateAction<NodeModel<TreeDataType>[]>
  >;
  onClick?: (nodes: NodeModel<TreeDataType>[]) => void;
}

const UpdatedTree = ({ selectedNode, setSelectedNode, onClick }: Props) => {
  const tree = useUpdatedTree();
  const { toast } = useToast();
  const { setUpdatedTree } = useRestructureActions();

  return (
    <div className="border pb-2 h-[600px] relative">
      <TreeView
        tree={tree?.filter((node) => node.data?.activeType === "Y") || []}
        canDrag={true}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        onClick={onClick}
        dropTargetOffset={50}
        canDrop={(node, options) =>
          options.dragSource?.parent === options.dropTargetId
        }
        onDrop={(node, options) => {
          setUpdatedTree(node as NodeModel<TreeDataType>[]);
          toast({
            description: "관제순서 변경은 현재 지원되지 않습니다.",
            variant: "destructive",
          });
        }}
        canSearch
      />
    </div>
  );
};

export default UpdatedTree;
