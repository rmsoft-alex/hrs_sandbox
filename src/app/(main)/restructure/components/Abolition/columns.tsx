import { ColumnDef } from "@tanstack/react-table";
import { AbolishCodeEnum, AbolitioinHistoryType } from "../../types";
import { Checkbox } from "@/components/ui/checkbox";
import { renderSortableHeader } from "../../../../../components/common/table/renderSortableHeader";
import { formatKST } from "@/utils/format";
import TooltipIcon from "@/components/ui/TooltipIcon";
const disables = ["HRS0303010201", "HRS0303010202", "HRS0303010203"];

export const columns: ColumnDef<AbolitioinHistoryType>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => {
      const isChecked = table.getIsAllPageRowsSelected();
      return (
        <Checkbox
          checked={isChecked}
          onClick={() => {
            table.toggleAllPageRowsSelected(!isChecked);
          }}
        />
      );
    },
    cell: ({ row }) => {
      const isChecked = row.getIsSelected();
      const disable = disables.some(
        (code) => code === row.original.cmmnCodeDetail
      );
      return (
        <Checkbox
          checked={isChecked}
          onClick={() => {
            row.toggleSelected(!isChecked);
          }}
          className={`${disable ? "bg-slate-50" : ""}`}
        ></Checkbox>
      );
    },
  },
  {
    accessorKey: "name",
    header: (props) => renderSortableHeader(props, "부서명"),
    cell: ({ row }) => {
      const disable = disables.some(
        (code) => code === row.original.cmmnCodeDetail
      );
      return (
        <div
          className={`flex justify-center items-center ${
            disable ? "text-slate-400" : ""
          }`}
        >
          <span className="cursor-default">
            {row.original.departmentInfoList[0].departmentName || ""}
          </span>
          {row.original.departmentInfoList.length > 1 && (
            <TooltipIcon
              className="bg-slate-50 rounded"
              icon={
                <div className="cursor-pointer ml-2 text-orange-500">
                  외 {row.original.departmentInfoList.length - 1}
                </div>
              }
              content={
                <div>
                  {row.original.departmentInfoList.map((dep) => (
                    <div key={dep.departmentTempIdx}>
                      • {dep.departmentName}
                    </div>
                  ))}
                </div>
              }
              orange
            />
          )}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const aLabel = a.original.departmentInfoList[0].departmentName;
      const bLabel = b.original.departmentInfoList[0].departmentName;
      return aLabel.localeCompare(bLabel);
    },
  },
  {
    accessorKey: "cmmnCodeDetail",
    header: (props) => renderSortableHeader(props, "유형"),
    cell: ({ row }) => {
      const disable = disables.some(
        (code) => code === row.original.cmmnCodeDetail
      );
      const typeLabel =
        AbolishCodeEnum.find(
          (code) => code.code === row.original.cmmnCodeDetail
        )?.label || row.original.cmmnCodeDetail;
      return (
        <div
          className={`text-center cursor-default ${
            disable ? "text-slate-400" : ""
          }`}
        >
          {typeLabel}
        </div>
      );
    },
    sortingFn: (a, b) => {
      const aLabel =
        AbolishCodeEnum.find((code) => code.code === a.original.cmmnCodeDetail)
          ?.label || a.original.cmmnCodeDetail;
      const bLabel =
        AbolishCodeEnum.find((code) => code.code === b.original.cmmnCodeDetail)
          ?.label || b.original.cmmnCodeDetail;
      return aLabel.localeCompare(bLabel);
    },
  },
  {
    accessorKey: "regDate",
    header: (props) => renderSortableHeader(props, "변경일시"),
    cell: ({ row }) => {
      const disable = disables.some(
        (code) => code === row.original.cmmnCodeDetail
      );
      return (
        <div
          className={`text-center cursor-default ${
            disable ? "text-slate-400" : ""
          }`}
        >
          {formatKST(new Date(row.original.regDate))
            ?.slice(0, 19)
            .replace("T", " ")
            .replaceAll("-", ".")}
        </div>
      );
    },
  },
];