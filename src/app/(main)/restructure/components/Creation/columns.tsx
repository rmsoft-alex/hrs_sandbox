import { ColumnDef } from "@tanstack/react-table";
import { CreateCodeEnum, CreationHistoryType } from "../../types";
import { Checkbox } from "@/components/ui/checkbox";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { formatKST } from "@/utils/format";
import TooltipIcon from "@/components/ui/TooltipIcon";

export const columns: ColumnDef<CreationHistoryType>[] = [
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
    accessorKey: "departmentName",
    header: (props) => renderSortableHeader(props, "부서명"),
    cell: ({ row }) => {
      return <div className="text-center">{row.original.departmentName}</div>;
    },
  },
  {
    accessorKey: "cmmnCodeDetail",
    header: (props) => renderSortableHeader(props, "신설유형"),
    cell: ({ row }) => {
      const typeLabel =
        CreateCodeEnum.find((code) => code.code === row.original.cmmnCodeDetail)
          ?.label || row.original.cmmnCodeDetail;
      return <div className="text-center">{typeLabel}</div>;
    },
    sortingFn: (a, b) => {
      const aLabel =
        CreateCodeEnum.find((code) => code.code === a.original.cmmnCodeDetail)
          ?.label || a.original.cmmnCodeDetail;
      const bLabel =
        CreateCodeEnum.find((code) => code.code === b.original.cmmnCodeDetail)
          ?.label || b.original.cmmnCodeDetail;
      return aLabel.localeCompare(bLabel);
    },
  },
  {
    accessorKey: "parentDepartmentName",
    header: (props) => renderSortableHeader(props, "상위부서"),
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.parentDepartmentTempIdx}
        </div>
      );
    },
  },
  {
    accessorKey: "previousDepartments",
    header: (props) => renderSortableHeader(props, "이전부서"),
    cell: ({ row }) => (
      <div className={`flex justify-center items-center`}>
        <span className="cursor-default">
          {row.original.previousDepartmentInfo
            ? row.original.previousDepartmentInfo[0]
            : "-"}
        </span>
        {row.original.previousDepartmentInfo &&
          row.original.previousDepartmentInfo.length > 1 && (
            <TooltipIcon
              className="bg-slate-50 rounded"
              icon={
                <div className="cursor-pointer ml-2 text-orange-500">
                  외 {row.original.previousDepartmentInfo.length - 1}
                </div>
              }
              content={
                <div>
                  {row.original.previousDepartmentInfo.map((dep) => (
                    // <div key={dep.departmentTempIdx}>
                    //   • {dep.departmentName}
                    // </div>
                    <div key={dep}>• {dep}</div>
                  ))}
                </div>
              }
              orange
            />
          )}
      </div>
    ),
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