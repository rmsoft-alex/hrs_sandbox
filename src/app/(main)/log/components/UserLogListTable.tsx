"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, useTableState } from "@/components/common/table/table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { UsrLogList } from "../type";

import { MoveRight } from "lucide-react";
import { useDeptUsrLogLabel } from "@/hooks/useCommon";

type Props = {
  userLogList: UsrLogList[];
};

export default function UserLogListTable({ userLogList }: Props) {
  const table = useTableState();

  return (
    <div className="flex flex-col gap-[15px] pb-8">
      <h2>구성원 변경 이력</h2>
      <div className="border-t-[1px]">
        <DataTable
          data={userLogList}
          columns={columns}
          totalCount={0}
          pageSizeView={false}
          pageIndexView={false}
          paginationBtn={false}
          selectedCountView={false}
          placeholder="구성원 변경 이력이 없습니다."
          {...table}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<UsrLogList>[] = [
  {
    accessorKey: "userName",
    header: (column) => renderSortableHeader(column, "이름"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("userName")}</div>
    ),
  },
  {
    accessorKey: "restructureCode",
    header: (column) => renderSortableHeader(column, "유형"),
    cell: ({ row }) => (
      <RestructureDetailCodeCell
        restructureDetailCode={row.getValue("restructureDetailCode")}
      />
    ),
  },
  {
    accessorKey: "preDepartmentName",
    header: () => <div className="text-center">변경 전</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("preDepartmentName") || "-"}
      </div>
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
    accessorKey: "departmentName",
    header: () => <div className="text-center">변경 후</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("departmentName") || "-"}</div>
    ),
  },
];

const RestructureDetailCodeCell = ({
  restructureDetailCode,
}: {
  restructureDetailCode: string;
}) => {
  const { getDeptUsrLogLabelName } = useDeptUsrLogLabel();

  return (
    <div className="center">
      {getDeptUsrLogLabelName(restructureDetailCode)}
    </div>
  );
};
