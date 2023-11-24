import { ColumnDef } from "@tanstack/react-table";
import { SyncState } from "../schema";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { formatKST, formatUTC } from "@/utils/format";

export const columns: ColumnDef<SyncState, unknown>[] = [
  {
    accessorKey: "success",
    header: () => {
      return <div className="flex justify-center w-[12.375rem] ">상태</div>;
    },
    cell: ({ row }) => {
      const statusColors = () => {
        if (row.original.success === "Y") {
          return (
            <div className="flex justify-center w-[12.375rem]">
              <p className="bg-green-200 w-[3.125rem] rounded-md p-1 text-green-500 text-xs font-medium text-center">
                완료
              </p>
            </div>
          );
        } else if (row.original.success === "N") {
          return (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-center w-[12.375rem]">
                      <p className="bg-red-200 w-[3.125rem] rounded-md  p-1 text-red-500 text-xs font-medium text-center cursor-pointer">
                        실패
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    <p className="text-xs font-medium text-center">
                      사유: {row.original?.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          );
        }
      };
      return statusColors();
    },
  },
  // {
  //   accessorKey: "syncTitle",
  //   header: (props) =>
  //     renderSortableHeader(props, "이력", "flex justify-center w-[25rem]"),
  //   cell: ({ row }) => {
  //     return (
  //       <p className="text-center truncate w-[25rem]">
  //         {row.original.syncTitle}
  //       </p>
  //     );
  //   },
  // },
  {
    accessorKey: "regBy",
    header: (props) =>
      renderSortableHeader(
        props,
        "등록자",
        "flex justify-center w-[35.125rem]"
      ),
    cell: ({ row }) => {
      return <p className="text-center w-[35.125rem]">{row.original.regBy}</p>;
    },
  },
  {
    accessorKey: "regDate",
    header: (props) =>
      renderSortableHeader(props, "등록일시", "w-[14.375rem] text-end"),
    cell: ({ row }) => {
      const regDateWithout = formatKST(new Date(row.original?.regDate));

      return <p className="text-center w-[14.375rem]">{regDateWithout}</p>;
    },
  },
];
