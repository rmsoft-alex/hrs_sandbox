"use client";
import React from "react";
import { DataTable, useTableState } from "@/components/common/table/table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { UsrDep } from "../type";
import { useDept, useDeptTitle } from "@/hooks/useCommon";
import { formatKST } from "@/utils/format";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type Props = {
  userDepartment: UsrDep[];
};

export default function UserDepartmentDetail({ userDepartment }: Props) {
  const table = useTableState();

  return (
    <div className="border-t-[1px]">
      <DataTable
        columns={columns}
        data={userDepartment}
        totalCount={0}
        pageSizeView={false}
        pageIndexView={false}
        paginationBtn={false}
        selectedCountView={false}
        placeholder={"부서 정보가 없습니다."}
        {...table}
      />
    </div>
  );
}

const columns: ColumnDef<UsrDep>[] = [
  {
    accessorKey: "mainDepartment",
    header: () => <div className="w-20 text-center">분류</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <div className="w-6 h-6">
          {row.getValue("mainDepartment") === "Y" ? (
            <div>
              <p className="w-5 h-5 flex justify-center items-center ring-2 ring-orange-300 rounded-full text-center text-orange-500 text-xs pt-1 p-1">
                주
              </p>
            </div>
          ) : (
            <div>
              <p className="w-5 h-5 flex justify-center items-center ring-2 ring-slate-500 rounded-full text-center text-slate-800 text-xs pt-1 p-0.5">
                부
              </p>
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "departmentIdx",
    header: () => <div className="w-40 text-center">부서 이름</div>,
    cell: ({ row }) => (
      <DeptCodeCell departmentIdx={row.getValue("departmentIdx")} />
    ),
  },
  {
    accessorKey: "departmentTitleCode",
    header: () => <div className="w-32 text-center">직책</div>,
    cell: ({ row }) => (
      <DeptTitleCodeCell
        departmentTitleCode={row.getValue("departmentTitleCode")}
      />
    ),
  },
  {
    accessorKey: "updtDate",
    header: () => <div className="w-28 text-center">기준일시</div>,
    cell: ({ row }) => <BaseDateCell rowData={row.original} />,
  },
];

const DeptCodeCell = ({ departmentIdx }: { departmentIdx: number }) => {
  const { getDeptName } = useDept();
  return (
    <Link
      className="flex justify-center"
      href={{
        pathname: "/department",
        query: { selected: departmentIdx },
      }}
      prefetch={false}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="hover:font-bold duration-150 transition-all hover:bg-inherit"
            >
              {getDeptName(departmentIdx)}
            </Button>
          </TooltipTrigger>
          <TooltipContent align="start">
            <p>클릭 시 부서 조회 페이지로 이동합니다.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
};

const DeptTitleCodeCell = ({
  departmentTitleCode,
}: {
  departmentTitleCode: string;
}) => {
  const { getDeptTitleName } = useDeptTitle();

  return (
    <div>
      <p className="text-center">{getDeptTitleName(departmentTitleCode)}</p>
    </div>
  );
};

const BaseDateCell = ({
  rowData: { regDate, updtDate },
}: {
  rowData: { regDate: string; updtDate: string | null };
}) => {
  return (
    <div>
      <p className="text-center">{formatKST(new Date(updtDate || regDate))}</p>
    </div>
  );
};
