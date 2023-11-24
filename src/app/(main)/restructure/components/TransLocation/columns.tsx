import { ColumnDef, Row } from "@tanstack/react-table";
import {
  MemberHistoryType,
  MemberRestructureCodeEnum,
  MemberType,
} from "../../types";
import { Checkbox } from "@/components/ui/checkbox";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { ArrowRight } from "lucide-react";
import { getDepartmentTitleNameByCode } from "../../util/getDepartmentTitleNameByCode";
import { formatKST, formatUTC } from "@/utils/format";

export const columns: ColumnDef<MemberHistoryType>[] = [
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
        ></Checkbox>
      );
    },
  },
  {
    accessorKey: "userName",
    header: (props) => renderSortableHeader(props, "이름"),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.userName}</div>;
    },
  },
  {
    accessorKey: "restructureCode",
    header: (props) => renderSortableHeader(props, "유형"),
    cell: ({ row }) => {
      const label =
        MemberRestructureCodeEnum.find(
          (code) => code.code === row.original.restructureCode
        )?.label || "알 수 없음";
      const isDepChange = !!row.original.newDepartmentTempIdx;
      return (
        <div className="text-center">
          {isDepChange ? `부서이동(${label})` : "직책변경"}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const getLabel = (row: Row<MemberHistoryType>) => {
        const label =
          MemberRestructureCodeEnum.find(
            (code) => code.code === row.original.restructureCode
          )?.label || "알 수 없음";
        const isDepChange = !!row.original.newDepartmentTempIdx;
        return isDepChange ? `부서이동(${label})` : "직책변경";
      };
      return getLabel(a).localeCompare(getLabel(b));
    },
  },
  {
    accessorKey: "before",
    header: (props) => renderSortableHeader(props, "변경전"),
    cell: ({ row }) => {
      const isDepChange = !!row.original.newDepartmentTempIdx;
      return (
        <div className="text-center">
          {isDepChange
            ? row.original.preDepartmentName
            : getDepartmentTitleNameByCode(row.original.preTitleCode)}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const getName = (row: Row<MemberHistoryType>) => {
        const isDepChange = !!row.original.newDepartmentTempIdx;
        return isDepChange
          ? row.original.preDepartmentName
          : getDepartmentTitleNameByCode(row.original.preTitleCode);
      };
      return getName(a).localeCompare(getName(b));
    },
  },
  {
    accessorKey: "none",
    header: () => {
      return (
        <div className="flex justify-center">
          <ArrowRight className="w-3 h-3" />
        </div>
      );
    },
    cell: () => {
      return (
        <div className="flex justify-center">
          <ArrowRight className="w-3 h-3" />
        </div>
      );
    },
  },
  {
    accessorKey: "after",
    header: (props) => renderSortableHeader(props, "변경후"),
    cell: ({ row }) => {
      const isDepChange = !!row.original.newDepartmentTempIdx;
      return (
        <div className="text-center">
          {isDepChange
            ? row.original.newDepartmentName
            : getDepartmentTitleNameByCode(row.original.newTitleCode)}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const getName = (row: Row<MemberHistoryType>) => {
        const isDepChange = !!row.original.newDepartmentTempIdx;
        return isDepChange
          ? `${row.original.newDepartmentName}`
          : getDepartmentTitleNameByCode(row.original.newTitleCode); // 이름으로 수정 필요
      };
      return getName(a).localeCompare(getName(b));
    },
  },
  {
    accessorKey: "regDate",
    header: (props) => renderSortableHeader(props, "변경일시"),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {formatKST(new Date(row.original.regDate))
            ?.slice(0, 19)
            .replace("T", " ")
            .replaceAll("-", ".")}
        </div>
      );
    },
  },
];

export const originMemberGroupColumns: ColumnDef<MemberType>[] = [
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
        ></Checkbox>
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
    accessorKey: "departmentName",
    header: (props) => renderSortableHeader(props, "부서"),
    cell: ({ row }) => {
      const original = row.original;
      return <div className="text-center">{original.departmentName}</div>;
    },
    sortingFn: (a, b) => {
      const aName = a.original.departmentName;
      const bName = b.original.departmentName;
      return aName.localeCompare(bName);
    },
  },
  {
    accessorKey: "originPositionName",
    header: (props) => renderSortableHeader(props, "직책"),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.titleCodeName}</div>;
    },
  },
];