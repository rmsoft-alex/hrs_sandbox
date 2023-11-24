"use client";

import { ColumnDef } from "@tanstack/react-table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { deptDetailUserListType } from "@/api/department.api.schema";

export const columns: ColumnDef<deptDetailUserListType>[] = [
  {
    accessorKey: "mainDepartment",
    header: (props) => renderSortableHeader(props, "분류"),
    cell: ({ row }) => {
      return (
        <div>
          {row.original.mainDepartment === "Y" ? (
            <p className="w-[22px] h-[22px] mx-auto text-center rounded-full border border-orange-500 border-opacity-50 text-orange-500 text-sm font-normal leading-[21px]">
              주
            </p>
          ) : (
            <p className="w-[22px] h-[22px] mx-auto text-center rounded-full border border-slate-800 border-opacity-50 text-slate-800 text-sm font-normal leading-[21px]">
              부
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: (props) => renderSortableHeader(props, "이름"),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "titleCodeName",
    header: (props) => renderSortableHeader(props, "직위"),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.titleCodeName}</div>;
    },
  },
  {
    accessorKey: "departmentTitleCodeName",
    header: (props) => renderSortableHeader(props, "직책"),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.departmentTitleCodeName}
        </div>
      );
    },
  },
];
