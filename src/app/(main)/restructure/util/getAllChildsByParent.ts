import { NodeModel } from "@minoru/react-dnd-treeview";
import { TreeDataType } from "../types";

/**
 * 부모요소의 id배열을 통해 모든 자식 요소를 탐색
 * @param tree 전체 부서조직도
 * @param parents 하위 요소까지 포함하고자 하는 부모요소 id 배열
 * @param merged 부모 id와 자식id가 합쳐진 최종 배열
 * @returns 자식부서데이터
 */

export const getAllChildsByParent = (
  tree: NodeModel[],
  parents: (number | string)[],
  merged: (number | string)[] = parents
): NodeModel<TreeDataType>[] => {
  const childs = tree
    .filter((node) => parents.some((parentNode) => parentNode === node.parent))
    .map((node) => node.id);

  if (childs && childs.length > 0) {
    return getAllChildsByParent(
      tree,
      childs,
      Array.from(new Set([...merged, ...childs]))
    );
  }

  const finalChild = Array.from(new Set([...merged, ...childs]));
  return tree.filter((node) =>
    finalChild.some((id) => id === node.id)
  ) as NodeModel<TreeDataType>[];
};
