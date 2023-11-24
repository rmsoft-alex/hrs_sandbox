"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import DeptModalSelect from "./DeptModalSelect";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { reqFinalMemberType } from "@/api/department.api.schema";
import { useTitle } from "@/hooks/useCommon";

export const columns: ColumnDef<reqFinalMemberType>[] = [
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
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "subDepartmentName" ? "subDepartmentName" : "departmentName",
    header: () => {
      return <div className="flex justify-center">부서</div>;
    },
    cell: ({ row }) => {
      return (
        <div className={`text-center`}>
          {row.original.subDepartmentName
            ? row.original.subDepartmentName
            : row.original.departmentName}
        </div>
      );
    },
  },
  {
    accessorKey: "titleCodeName",
    header: (props) => renderSortableHeader(props, "직위"),
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { getTitleName } = useTitle();

      return (
        <div className="text-center">
          {getTitleName(row.original.titleCode)}
        </div>
      );
    },
  },
  {
    accessorKey: "subDepartmentTitleCodeName",
    header: (props) => renderSortableHeader(props, "직책"),
    cell: ({ row }) => {
      const subDepartmentTitleCode = row.original.subDepartmentTitleCode
        ? row.original.subDepartmentTitleCode
        : row.original.departmentTitleCode;
      const userInfoIdx = row.original.userInfoIdx;

      return (
        <div className="mx-auto">
          <DeptModalSelect
            subDepartmentTitleCode={subDepartmentTitleCode}
            userInfoIdx={userInfoIdx}
          />
        </div>
      );
    },
  },
];
