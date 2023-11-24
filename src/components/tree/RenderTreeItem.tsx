import React from "react";
import { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { Plus, Minus, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { AbolishCodeEnum } from "@/app/(main)/restructure/types";

interface Props {
  node: NodeModel<any>;
  params: RenderParams;
  selectedNode: NodeModel<any>[];
  handleClick: (
    e: React.MouseEvent<HTMLDivElement>,
    node: NodeModel<any>,
    params: RenderParams
  ) => void;
  disable: boolean;
}

const RenderTreeItem = ({
  node,
  params,
  selectedNode,
  handleClick,
  disable = false,
}: Props) => {
  const { isOpen, hasChild, depth, onToggle } = params;
  const isSelected =
    selectedNode && selectedNode.some((n) => n?.id === node.id);
  const isAbolished =
    node.data.activeType === "N" ||
    node.data.deactivationStatus === "Y" ||
    false;
  const isNew =
    (node.data.activeType === "Y" && node.data.restructureIdx) || false;
  const abolishLabel =
    AbolishCodeEnum.find(
      (code) => code.code === node.data?.restructureDetailCode
    )?.label || "폐지";

  const style = {
    container: "flex items-center gap-1.5 h-[28px] relative",
    title: `text-slate-800 ${isAbolished ? "text-slate-400" : ""} ${
      isNew ? "text-teal-500" : ""
    }
  ${isSelected ? "text-orange-500" : ""}`,
    toggleTip: "h-2 w-2 text-slate-500",
    toggleBtn:
      "flex justify-center items-center cursor-pointer border w-4 h-4 rounded-sm bg-white z-10",
    abolishBadge:
      "bg-slate-50 text-[10px] text-center text-slate-400 px-2 py-0",
    newBadge:
      "text-[10px] text-center text-teal-500 px-2 py-0 border-teal-500 bg-teal-50 border-opacity-50",
    childLine: `${
      hasChild || node.parent === 0 ? "border-none" : "border-l border-b"
    }  w-[30px] h-[28px] absolute left-[-22.5px] top-[-13.3px]`,
  };
  return (
    <div
      style={{ marginLeft: depth * 30 }}
      className={style.container}
      onClick={(e) => handleClick(e, node, params)}
    >
      <div className={style.childLine}></div>
      {hasChild ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={style.toggleBtn}
        >
          {isOpen ? (
            <Minus className={style.toggleTip} />
          ) : (
            <Plus className={style.toggleTip} />
          )}
        </div>
      ) : (
        <div className="z-10">
          <Dot className={cn(`w-4 h-4 ${style.title}`)} />
        </div>
      )}
      <div
        className={cn(
          `w-full flex items-center gap-1 ${style.title} ${
            disable ? "cursor-default" : "cursor-pointer"
          }`
        )}
      >
        <span>
          {node.text}{" "}
          {node.data.departmentSize ? `(${node.data.departmentSize})` : ""}
        </span>
        {isAbolished && (
          <Badge variant={"outline"} className={style.abolishBadge}>
            {abolishLabel}
          </Badge>
        )}
        {isNew && (
          <Badge variant={"outline"} className={style.newBadge}>
            신규
          </Badge>
        )}
      </div>
    </div>
  );
};

export default RenderTreeItem;
