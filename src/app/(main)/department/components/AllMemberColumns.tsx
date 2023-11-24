"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { getAllMemberType } from "@/api/department.api.schema";

export const columns: ColumnDef<getAllMemberType>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => {
      const isChecked = table.getIsAllPageRowsSelected();
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onClick={() => {
            table.toggleAllPageRowsSelected(!isChecked);
          }}
        />
      );
    },
    cell: ({ row }) => {
      const isChecked = row.getIsSelected();
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={() => {
            row.toggleSelected(!isChecked);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: (props) => renderSortableHeader(props, "이름"),
    cell: ({ row }) => {
      return <div className={`text-center`}>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "departmentName",
    header: (props) => renderSortableHeader(props, "부서"),
    cell: ({ row }) => {
      return <div className={`text-center`}>{row.original.departmentName}</div>;
    },
  },
  {
    accessorKey: "titleCodeName",
    header: (props) => renderSortableHeader(props, "직위"),
    cell: ({ row }) => {
      return <div className={`text-center`}>{row.original.titleCodeName}</div>;
    },
  },
  {
    accessorKey: "departmentTitleCodeName",
    header: (props) => renderSortableHeader(props, "직책"),
    cell: ({ row }) => {
      return (
        <div className={`text-center`}>
          {row.original.departmentTitleCodeName}
        </div>
      );
    },
  },
];
