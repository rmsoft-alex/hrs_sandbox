import React, { useState, useEffect } from "react";
import TreeView from "@/components/tree/TreeView";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { UserDept, UsrDtlRes } from "../type";
import { useUsrDeptAction } from "../store/useUserDeptStore";
import { TreeDataType } from "../../restructure/types";
import { useDeptTitle } from "@/hooks/useCommon";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type Props = {
  userInfo?: UsrDtlRes;
  tree: any;
};

export default function DeptTree({ userInfo, tree }: Props) {
  const { deptTitleList } = useDeptTitle();

  const [selectedDept, setSelectedDept] = useState<NodeModel<TreeDataType>[]>(
    []
  );
  const { addDept, initializeDept } = useUsrDeptAction();

  const initialDept: UserDept[] | undefined = userInfo?.departmentUserRelations
    ? userInfo?.departmentUserRelations.map(
        ({
          relationIdx,
          mainDepartment,
          departmentTitleCode,
          departmentIdx,
        }) => {
          return {
            crudOperationType: undefined,
            relationIdx: relationIdx || undefined,
            departmentIdx: departmentIdx || undefined,
            departmentTitleCode: departmentTitleCode || undefined,
            mainDepartmentYn: mainDepartment,
          };
        }
      )
    : undefined;

  useEffect(() => {
    if (initialDept) {
      initializeDept(initialDept);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree, deptTitleList]);

  return (
    <div className="h-full flex gap-6">
      <div className="w-64 h-[480px] flex felx-col flex-1 border border-slate-200">
        <TreeView
          tree={tree}
          selectedNode={selectedDept}
          setSelectedNode={setSelectedDept}
          treeName="조직도"
          canSearch
        />
      </div>
      <Button
        className="px-3 py-2"
        variant={"iconBtn"}
        type="button"
        disabled={!selectedDept[0]}
        onClick={() => addDept(+selectedDept[0].id)}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
