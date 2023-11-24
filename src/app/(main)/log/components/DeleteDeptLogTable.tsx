"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, useTableState } from "@/components/common/table/table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { DeleteDeptLogList } from "../type";
import { useDeleteDeptLogLabel } from "@/hooks/useCommon";

type Props = {
  deleteDepartmentLogList: DeleteDeptLogList[];
};

export default function DeleteDeptLogTable({ deleteDepartmentLogList }: Props) {
  const table = useTableState();

  return (
    <div className="flex flex-col gap-[15px]">
      <h2>부서 폐지 이력</h2>
      <div className="border-t-[1px]">
        <DataTable
          data={deleteDepartmentLogList}
          columns={columns}
          totalCount={0}
          pageSizeView={false}
          pageIndexView={false}
          paginationBtn={false}
          selectedCountView={false}
          placeholder="부서 폐지 이력이 없습니다."
          {...table}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<DeleteDeptLogList>[] = [
  {
    accessorKey: "departmentIdx",
    header: (column) => renderSortableHeader(column, "부서명"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("departmentIdx")}</div>
    ),
  },
  {
    accessorKey: "parentDepartmentName",
    header: (column) => renderSortableHeader(column, "상위부서"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("parentDepartmentName")}</div>
    ),
  },
  {
    accessorKey: "restructureDetailCode",
    header: () => <div className="text-center">유형</div>,
    cell: ({ row }) => (
      <RestructureDetailCodeCell
        restructureDetailCode={row.getValue("restructureDetailCode")}
      />
    ),
  },
];

const RestructureDetailCodeCell = ({
  restructureDetailCode,
}: {
  restructureDetailCode: string;
}) => {
  const { getDeleteDeptLogLabelName } = useDeleteDeptLogLabel();

  return (
    <div className="center">
      {getDeleteDeptLogLabelName(restructureDetailCode)}
    </div>
  );
};
