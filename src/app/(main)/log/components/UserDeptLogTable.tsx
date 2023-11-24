"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, useTableState } from "@/components/common/table/table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";

import { MoveRight } from "lucide-react";
import { UsrDeptRltChangeInfo } from "../type";

type Props = {
  deptList: UsrDeptRltChangeInfo;
};

export default function UserDeptLogTable({ deptList }: Props) {
  const table = useTableState();

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <h2 className="font-nomal">부서 정보 변경 이력</h2>
      <div className="flex flex-col overflow-hidden border-t-[1px]">
        {/* <DataTable
          data={deptList}
          columns={columns}
          totalCount={0}
          pageSizeView={false}
          pageIndexView={false}
          paginationBtn={false}
          selectedCountView={false}
          placeholder="부서 정보 변경 이력이 없습니다."
          {...table}
        /> */}
      </div>
    </div>
  );
}

const columns: ColumnDef<UsrDeptRltChangeInfo>[] = [
  {
    accessorKey: "departmentIdx",
    header: (column) => renderSortableHeader(column, "부서명"),
    cell: ({ row }) => (
      <DepartmentIdxCell departmentIdx={row.getValue("departmentIdx")} />
    ),
  },
  {
    accessorKey: "crudOperationType",
    header: (column) => renderSortableHeader(column, "유형"),
    cell: ({ row }) => (
      <CrudOperationTypeCell
        crudOperationType={row.getValue("crudOperationType")}
      />
    ),
  },
  {
    accessorKey: "preDepartmentTitleCode",
    header: () => <div className="text-center">변경 전</div>,
    cell: ({ row }) => (
      <DeptTitleCodeCell titleCode={row.getValue("preDepartmentTitleCode")} />
    ),
  },
  {
    id: "arrow",
    header: () => (
      <div className="flex justify-center">
        <MoveRight size={14} />
      </div>
    ),
    cell: () => (
      <div className="flex justify-center">
        <MoveRight size={14} />
      </div>
    ),
  },
  {
    accessorKey: "departmentTitleCode",
    header: () => <div className="text-center">변경 후</div>,
    cell: ({ row }) => (
      <DeptTitleCodeCell titleCode={row.getValue("departmentTitleCode")} />
    ),
  },
];

const DepartmentIdxCell = ({ departmentIdx }: { departmentIdx: number }) => {
  // 부서명 변경
  const deptName = departmentIdx;

  return <div className="text-center">{deptName}</div>;
};

const CrudOperationTypeCell = ({
  crudOperationType,
}: {
  crudOperationType: string;
}) => {
  const type =
    crudOperationType === "INSERT"
      ? "생성"
      : crudOperationType === "UPDATE"
      ? "변경"
      : "삭제";

  return <div className="text-center">{type}</div>;
};

const DeptTitleCodeCell = ({ titleCode }: { titleCode: string }) => {
  // TODO: 직위코드 -> 직책 코드
  const titleName = titleCode || "-";

  return <div className="text-center">{titleName}</div>;
};
