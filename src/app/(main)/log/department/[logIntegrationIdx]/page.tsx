"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { getDeptLogById } from "@/api/log.api";
import { DeptLogsRes } from "../../type";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { DataTable, useTableState } from "@/components/common/table/table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import dayjs from "dayjs";

import { MoveRight } from "lucide-react";
import { ErrorType } from "@/types/type";

type Props = {
  params: { logInfoIdx: number };
};

export default function DepartmentLogPage({ params: { logInfoIdx } }: Props) {
  // 하이드레이션 에러 해결
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data,
  }: UseQueryResult<DeptLogsRes, ErrorType<object>> = useQuery({
    queryKey: ["deptLogs"],
    queryFn: () =>
      getDeptLogById(logInfoIdx)
        .then((res) => res?.data ?? {})
        .catch(() => {}),
    refetchInterval: 1000 * 5,
    placeholderData: keepPreviousData,
    enabled: logInfoIdx !== undefined,
  });

  const deptInfo = useMemo(() => data?.resDepartmentInfo, [data]);
  const userDeptRltInfo = useMemo(
    () => data?.resUserDepartmentRelationChangeInfo,
    [data]
  );
  const table = useTableState();

  return (
    <>
      {isClient && (
        <div className="flex flex-col gap-14 h-full text-sm px-10 py-8 text-slate-800">
          <LocationHeader
            firstTitle="통합 변경 이력"
            firstPath="/log"
            secondTitle="부서 정보 변경 이력 조회"
          />
          <div className="flex flex-col h-full gap-14 overflow-hidden">
            <div className="flex items-center">
              <dl className="w-40 flex flex-col items-start">
                <dt className="font-medium pb-3">부서명</dt>
                <dd className="w-full border-t font-normal pt-2">
                  {deptInfo?.departmentName!}
                </dd>
              </dl>
              <dl className="w-60 flex flex-col items-start">
                <dt className="font-medium pb-3">변경 일자</dt>
                <dd className="w-full border-t font-normal pt-2">
                  {dayjs(deptInfo?.regDate! || "").format(
                    "YYYY.MM.DD HH:mm:ss"
                  )}
                </dd>
              </dl>
              <dl className="flex flex-col flex-1 items-start">
                <dt className="font-medium pb-3">담당자</dt>
                <dd className="w-full border-t font-normal pt-2">
                  {deptInfo?.regBy!}
                </dd>
              </dl>
            </div>
            <div className="flex flex-col h-full gap-4 overflow-hidden">
              <h2 className="font-nomal">부서 정보 변경 이력</h2>
              <div className="flex flex-col overflow-hidden border-t-[1px]">
                {/* <DataTable
                  data={userDeptRltInfo}
                  columns={columns}
                  totalCount={0}
                  pageSizeView={false}
                  pageIndexView={false}
                  paginationBtn={false}
                  selectedCountView={false}
                  {...table}
                /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// const columns: ColumnDef<UsrDeptRltInfo>[] = [
//   {
//     accessorKey: "userName",
//     header: (column) => renderSortableHeader(column, "이름"),
//     cell: ({ row }) => (
//       <div className="text-center">{row.getValue("userName")}</div>
//     ),
//   },
//   {
//     accessorKey: "operationType",
//     header: (column) => renderSortableHeader(column, "유형"),
//     cell: ({ row }) => (
//       <OperationTypeCell operationType={row.getValue("operationType")} />
//     ),
//   },
//   {
//     accessorKey: "preTitleCode",
//     header: () => <div className="text-center">변경 전</div>,
//     cell: ({ row }) => (
//       <DeptTitleCodeCell titleCode={row.getValue("preTitleCode")} />
//     ),
//   },
//   {
//     id: "arrow",
//     header: () => (
//       <div className="flex justify-center">
//         <MoveRight size={14} />
//       </div>
//     ),
//     cell: () => (
//       <div className="flex justify-center">
//         <MoveRight size={14} />
//       </div>
//     ),
//   },
//   {
//     accessorKey: "titleCode",
//     header: () => <div className="text-center">변경 후</div>,
//     cell: ({ row }) => (
//       <DeptTitleCodeCell titleCode={row.getValue("titleCode")} />
//     ),
//   },
// ];

// const OperationTypeCell = ({ operationType }: { operationType: string }) => {
//   const type =
//     operationType === "UPDATE"
//       ? "수정"
//       : operationType === "INSERT"
//       ? "추가"
//       : "삭제";

//   return <div className="text-center">{type}</div>;
// };

// const DeptTitleCodeCell = ({ titleCode }: { titleCode: string }) => {
//   // TODO: 직위코드 -> 직책 코드
//   const titleName = titleCode || "-";

//   return <div className="text-center">{titleName}</div>;
// };
