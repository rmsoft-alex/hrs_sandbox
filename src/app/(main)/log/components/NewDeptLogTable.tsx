"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, useTableState } from "@/components/common/table/table";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { NewDeptLogList } from "../type";
import { useNewDeptLogLabel } from "@/hooks/useCommon";

type Props = {
  newDepartmentLogList: NewDeptLogList[];
};

export default function NewDeptLogTable({ newDepartmentLogList }: Props) {
  const table = useTableState();

  return (
    <div className="flex flex-col gap-[15px]">
      <h2>부서 신설 이력</h2>
      <div className="border-t-[1px]">
        <DataTable
          data={newDepartmentLogList}
          columns={columns}
          totalCount={0}
          pageSizeView={false}
          pageIndexView={false}
          paginationBtn={false}
          selectedCountView={false}
          placeholder="부서 신설 이력이 없습니다."
          {...table}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<NewDeptLogList>[] = [
  {
    accessorKey: "departmentName",
    header: (column) => renderSortableHeader(column, "부서명"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("departmentName")}</div>
    ),
  },
  {
    accessorKey: "parentDepartmentName",
    header: (column) => renderSortableHeader(column, "상위부서"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("parentDepartmentName")}</div>
    ),
  },
  {
    accessorKey: "departmentSize",
    header: () => <div className="text-center">구성원</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("departmentSize") || "-"}</div>
    ),
  },
  {
    accessorKey: "restructureDetailCode",
    header: () => <div className="text-center">유형</div>,
    cell: ({ row }) => (
      <RestructureDetailCodeCell
        restructureDetailCode={row.getValue("restructureDetailCode")}
      />
    ),
  },
  {
    accessorKey: "preDepartmentInfoList",
    header: () => <div className="text-center">이전부서</div>,
    cell: ({ row }) => (
      <DeptNameCell deptInfoList={row.getValue("preDepartmentInfoList")} />
    ),
  },
  // TODO_ZENA: 이전 상위부서가 없음
  // {
  //   accessorKey: "parentDepartmentName",
  //   header: () => <div className="text-center">이전상위부서</div>,
  //   cell: ({ row }) => (
  //     <div className="text-center">
  //       {row.getValue("parentDepartmentName") || "-"}
  //     </div>
  //   ),
  // },
];

const RestructureDetailCodeCell = ({
  restructureDetailCode,
}: {
  restructureDetailCode: string;
}) => {
  const { getNewDeptLogLabelName } = useNewDeptLogLabel();

  return (
    <div className="center">
      {getNewDeptLogLabelName(restructureDetailCode)}
    </div>
  );
};

const DeptNameCell = ({
  deptInfoList,
}: {
  deptInfoList: Array<{ preDepartmentName: string }>;
}) => {
  const deptNameList = deptInfoList.map((el) => el.preDepartmentName);
  const deptListSize = deptNameList.length;

  return (
    <div className="text-center">
      {deptListSize === 1
        ? deptNameList[0]
        : `${deptNameList[0]}외 ${deptListSize - 1}`}
    </div>
  );
};
