"use client";

import LocationHeader from "@/components/common/layout/header/locationHeader";
import { DataTable, useTableState } from "@/components/common/table/table";
import { useModal } from "@/hooks/modals/useModal";
import React, { useEffect, useMemo } from "react";
import { columns } from "../sync/components/SyncColumns";
import { Button } from "@/components/ui/button";
import { SyncListType } from "../sync/schema";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getSyncList } from "@/api/sync.api";
import SyncComboBox from "./components/SyncComboBox";
import { useSyncFilterStore, useSyncStatusAction } from "./store/useSyncStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Synchronization = () => {
  const table = useTableState();
  const { onOpen } = useModal();
  const { reset } = useSyncStatusAction();
  const { success, regBy, regDate } = useSyncFilterStore();
  const isSelected = !!(success[0] || regBy[0] || regDate?.from || regDate?.to);
  const { regByForm } = useSyncForm();

  //다른 페이지 갔다가 오면 검색조건 초기화
  useEffect(() => {
    reset();
    regByForm.reset();
  }, [reset]);

  const { data, isLoading, error }: UseQueryResult<SyncListType> = useQuery({
    queryKey: [
      "sync",
      table.pageIndex,
      table.pageSize,
      success,
      regBy,
      regDate,
      table.sorting,
    ],
    queryFn: () =>
      getSyncList(
        table.pageIndex,
        table.pageSize,
        success,
        regBy,
        regDate,
        table.sorting[0]
      ),
    onError: () => {
      !!data;
    },
    keepPreviousData: true,
  });

  const itemList = useMemo(() => data?.itemList ?? [], [data]);
  const itemCnt = useMemo(() => data?.itemCnt ?? 0, [data]);

  const onClickBtn = () => {
    onOpen("sync");
  };

  if (isLoading) {
    <div>loading...</div>;
  }
  if (error) {
    <div>에러가 발생했습니다. 잠시후 시도해주십시오.</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-8 h-full px-10 py-8">
      <LocationHeader firstTitle="동기화" />

      <div className="flex justify-between z-20">
        <SyncComboBox
          isSelected={isSelected}
          resetPageIndex={table.resetPageIndex}
        />

        <div className="flex justify-end">
          <Button onClick={onClickBtn} className="ml-5 w-[65px] h-9">
            등록
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full h-full min-h-[26rem] z-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={itemList}
          totalCount={itemCnt}
          selectedCountView={false}
          {...table}
          className="h-fit"
          placeholder={
            isLoading ? (
              <div>로딩중입니다.</div>
            ) : isSelected ? (
              <div>검색된 정보가 없습니다.</div>
            ) : (
              <div></div>
            )
          }
        />
      </div>
    </div>
  );
};

export default Synchronization;

export const useSyncForm = () => {
  const regByFormSchema = z.object({
    regBy: z.string(),
  });

  const regByForm = useForm<z.infer<typeof regByFormSchema>>({
    resolver: zodResolver(regByFormSchema),
    defaultValues: { regBy: "" },
  });

  return { regByFormSchema, regByForm };
};
