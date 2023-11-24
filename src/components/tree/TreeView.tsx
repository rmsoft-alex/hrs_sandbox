"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Tree,
  NodeModel,
  TreeMethods,
  DropOptions,
  Classes,
  RenderParams,
  SortCallback,
} from "@minoru/react-dnd-treeview";
import { DragSourceMonitor } from "react-dnd";
import RenderTreeItem from "./RenderTreeItem";
import RenderPlacehorder from "./RenderPlacehorder";
import { OptionState } from "@/app/(main)/restructure/types";
import Combobox from "./ComboBox";
import ScrollEvent from "../common/scrollbar/scrollEvent";

interface Props {
  tree: NodeModel<any>[];
  selectedNode: NodeModel<any>[];
  setSelectedNode: React.Dispatch<React.SetStateAction<NodeModel<any>[]>>;
  multiSelection?: boolean; // 다중선택 여부 (기본값 false)
  canDrag?: boolean | undefined; // 드래그앤드랍 여부 (기본값 false)
  treeName?: string | undefined; // 트리 헤더에 들어갈 이름 (기본값 "조직도")
  classes?: Classes;
  dropTargetOffset?: number;
  sort?: boolean | SortCallback<any> | undefined;
  onDragStart?: (
    node: NodeModel<unknown>,
    monitor: DragSourceMonitor<unknown, unknown>
  ) => void;
  onDrop?: (tree: NodeModel<unknown>[], options: DropOptions<unknown>) => void;
  canDrop?: (
    tree: NodeModel<unknown>[],
    options: DropOptions<unknown>
  ) => boolean | void;
  onClick?: (nodes: NodeModel<any>[], params: RenderParams) => void;
  canSearch?: boolean;
  onSearch?: (value: NodeModel<any>) => void;
  disable?: boolean;
}

const TreeView = ({
  tree,
  selectedNode,
  setSelectedNode,
  treeName,
  multiSelection = false,
  canDrag = false,
  canSearch = false,
  disable = false,
  classes,
  sort = false,
  onDrop = () => {},
  onClick = () => {},
  onSearch = () => {},
  ...props
}: Props) => {
  const ref = useRef<TreeMethods>(null);
  const [searchOptions, setSearchOptions] = useState<OptionState[]>([]);
  const [openAll, setOpenAll] = useState(true);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    node: NodeModel,
    params: RenderParams
  ) => {
    if (disable) return;
    let updatedSelctedNodes = selectedNode;

    if (!e.ctrlKey || !multiSelection) {
      updatedSelctedNodes = [node];
      setSelectedNode(updatedSelctedNodes);
      onClick(updatedSelctedNodes, params);
      return;
    }

    // ctrl + click 시 다중선택가능
    if (selectedNode.some((n) => n.id === node.id)) {
      updatedSelctedNodes = selectedNode.filter((n) => n.id !== node.id);
    } else {
      updatedSelctedNodes = [...selectedNode, node];
    }

    setSelectedNode(updatedSelctedNodes);
    onClick(updatedSelctedNodes, params);
  };

  const handleDragStart = (node: NodeModel) => {
    const isExistOnSelectedNode = selectedNode.some((n) => n.id === node.id);
    if (!isExistOnSelectedNode) {
      setSelectedNode([node]);
    }
  };

  const handleSearch = (value: OptionState) => {
    const result = tree.find((node) => node.id === value.value);
    if (result) {
      setSelectedNode([result]);
      onSearch(result);
    }
  };

  const handleOpenAll = () => {
    if (openAll) {
      setOpenAll(false);
      ref.current?.closeAll();
    } else {
      setOpenAll(true);
      ref.current?.openAll();
    }
  };

  useEffect(() => {
    setSearchOptions(
      tree?.map((item) => ({ value: item.id, label: item.text }))
    );
  }, [tree]);
  return (
    <div className="flex flex-1 flex-col h-full min-w-max shrink-0 select-none text-sm max-h-full overflow-hidden">
      <div className="sticky top-0 left-0 bg-white z-20">
        {canSearch && (
          <div className="flex items-center justify-between gap-2  border-b">
            <Combobox options={searchOptions} onSelect={handleSearch} />
          </div>
        )}
        {treeName && (
          <h2 className="flex items-center justify-between px-4 text-slate-800 h-11 cursor-default font-semibold bg-slate-50">
            {treeName}
          </h2>
        )}

        <div className="px-4 py-2 flex justify-between items-center mb-1 border-b">
          <div className="text-slate-600 text-sm leading-[30px] cursor-default">
            전체 ({tree?.length || 0})
          </div>
          <div
            className=" text-slate-500 text-xs leading-[30px] cursor-pointer"
            onClick={handleOpenAll}
          >
            {openAll ? "모두 접기" : "모두 펼치기"}
          </div>
        </div>
      </div>
      <ScrollEvent className="overflow-auto">
        {tree && tree.length ? (
          <Tree
            ref={ref}
            tree={tree}
            rootId={0}
            initialOpen={true}
            enableAnimateExpand={true}
            sort={sort}
            classes={{
              ...classes,
              root: `font-pre px-4 py-2 ${classes?.root}`,
              container: `font-pre ${classes?.container}`,
              placeholder: `relative ${classes?.placeholder}`,
              dropTarget: `bg-slate-50 ${classes?.dropTarget}`,
            }}
            canDrag={() => canDrag}
            onDrop={onDrop}
            onDragStart={handleDragStart}
            render={(node, params) => (
              <RenderTreeItem
                node={node}
                params={params}
                selectedNode={selectedNode}
                handleClick={handleClick}
                disable={disable}
              />
            )}
            placeholderRender={() => <RenderPlacehorder />}
            {...props}
          />
        ) : (
          <div className="text-center h-full">조직 데이터가 없습니다.</div>
        )}
      </ScrollEvent>
    </div>
  );
};

export default TreeView;
