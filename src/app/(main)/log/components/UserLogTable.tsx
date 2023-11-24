"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, useTableState } from "@/components/common/table/table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";

import { MoveRight } from "lucide-react";

type UsrList = {
  type: string;
  prev: string;
  current: string;
};

type Props = {
  usrList: UsrList[];
};

export default function UserLogTable({ usrList }: Props) {
  const table = useTableState();

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <h2 className="font-nomal">사용자 정보 변경 이력</h2>
      <div className="flex flex-col overflow-hidden border-t-[1px]">
        <DataTable
          data={usrList}
          columns={columns}
          totalCount={0}
          pageSizeView={false}
          pageIndexView={false}
          paginationBtn={false}
          selectedCountView={false}
          placeholder="사용자 정보 변경 이력이 없습니다."
          {...table}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<UsrList>[] = [
  {
    accessorKey: "type",
    header: (column) => renderSortableHeader(column, "유형"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "prev",
    header: () => <div className="text-center">변경 전</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("prev")}</div>
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
    accessorKey: "current",
    header: () => <div className="text-center">변경 후</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("current")}</div>
    ),
  },
];
