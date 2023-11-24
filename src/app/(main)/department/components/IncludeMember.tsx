"use client";

import React, { useEffect } from "react";
import { columns } from "./DeptMemberColumns";
import { DataTable, useTableState } from "@/components/common/table/table";
import { DeptModalStore } from "../store/useModalStore";

const IncludeMember = (subMemberTable: any) => {
  const { removeMember, setRemoveMember } = DeptModalStore();
  const tableState = useTableState();
  const rowsMap = tableState.selectedRows.map((item: any) => item.original);
  const subMemberList = subMemberTable.subMemberTable;

  useEffect(() => {
    if (rowsMap) {
      // 이전 userInfoIdx 배열
      const prevUserInfoIdxArray = removeMember;
      // 현재 rowsMap 배열
      const userInfoIdxArray = rowsMap.map((row) => row.userInfoIdx);

      const prevUserInfoIdxString = JSON.stringify(prevUserInfoIdxArray);
      const currentUserInfoIdxString = JSON.stringify(userInfoIdxArray);

      // 이전 userInfoIdx 배열과 현재 userInfoIdx 배열이 다를 경우에만 업데이트
      if (prevUserInfoIdxString !== currentUserInfoIdxString) {
        setRemoveMember(userInfoIdxArray);
      }
    }
  }, [removeMember, rowsMap, setRemoveMember]);

  return (
    <div>
      <DataTable
        columns={columns}
        totalCount={subMemberList?.length}
        data={subMemberList}
        selectedCountView={false}
        pageSizeView={false}
        pageIndexView={false}
        paginationBtn={false}
        className="w-[33.625rem] h-[18.375rem] "
        {...tableState}
      />
    </div>
  );
};

export default IncludeMember;
