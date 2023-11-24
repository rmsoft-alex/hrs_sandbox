"use client";
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getUsrLog } from "@/api/user.api";
import { UsrLog, UsrLogRes } from "../type";
import { DataTable, useTableState } from "@/components/common/table/table";
import { useUsrLogLabel } from "@/hooks/useCommon";
import { ErrorType } from "@/types/type";
import { formatKST } from "@/utils/format";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  userId: number;
};

export default function UserChangeHistory({ userId }: Props) {
  const {
    data,
  }: UseQueryResult<UsrLogRes, ErrorType<object>> = useQuery({
    queryKey: ["userChangeHistory", userId],
    queryFn: () => getUsrLog(userId).then((res) => res.data),
    refetchInterval: 1000 * 60 * 5,
    enabled: userId !== undefined,
  });

  // 최신순으로 정렬
  const list = useMemo(
    () =>
      !!data
        ? data.itemList.sort(
            (a, b) =>
              new Date(b.regDate).getTime() - new Date(a.regDate).getTime()
          )
        : [],
    [data]
  );
  const table = useTableState();

  return (
    <div className="border-t-[1px] h-full">
      <DataTable
        data={list}
        columns={columns}
        totalCount={0}
        pageSizeView={false}
        pageIndexView={false}
        paginationBtn={false}
        selectedCountView={false}
        placeholder={"변경 작업 이력이 없습니다."}
        className="w-full"
        {...table}
      />
    </div>
  );
}

const columns: ColumnDef<UsrLog>[] = [
  {
    accessorKey: "logLabelCode",
    header: () => <div className="text-center">작업명</div>,
    cell: ({ row }) => (
      <LogLabelCodeCell logLabelCode={row.getValue("logLabelCode")} />
    ),
  },
  {
    accessorKey: "crudOperation",
    header: () => <div className="text-center">분류</div>,
    cell: ({ row }) => {
      const crudOprt = row.getValue("crudOperation");
      return (
        <div className="text-center">
          {crudOprt === "INSERT"
            ? "생성"
            : crudOprt === "UPDATE"
            ? "수정"
            : "삭제"}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">변경 내용</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "userDescription",
    header: () => <div className="pl-6">변경 사유</div>,
    cell: ({ row }) => (
      <>
        {row.getValue("userDescription") ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="pl-6">
                <p className="w-40 truncate text-start">
                  {row.getValue("userDescription")}
                </p>
              </TooltipTrigger>
              <TooltipContent className="ml-3" align="start">
                <p>{row.getValue("userDescription")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="pl-8">-</div>
        )}
      </>
    ),
  },
  {
    accessorKey: "regDate",
    header: () => <div className="text-center">변경 일시</div>,
    cell: ({ row }) => (
      <div className="text-center">{formatKST(row.getValue("regDate"))}</div>
    ),
  },
  {
    accessorKey: "regBy",
    header: () => <div className="text-center">작업자</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("regBy")}</div>
    ),
  },
];

const LogLabelCodeCell = ({ logLabelCode }: { logLabelCode: string }) => {
  const { getUsrLogLabelName } = useUsrLogLabel();
  return <div className="text-center">{getUsrLogLabelName(logLabelCode)}</div>;
};
