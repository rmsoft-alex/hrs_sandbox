"use client";
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUsrs, putUsrActState } from "@/api/user.api";
import { Usrs, UsrsRes } from "./type";
import { useRouter } from "next/navigation";
import {
  useUserFilteringState,
  useUsrFilteringAction,
} from "./store/useUserFilterStore";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { DataTable, useTableState } from "@/components/common/table/table";
import UserFilteringBtns from "./components/UserFilteringBtns";
import { ErrorType } from "@/types/type";
import { formatKST } from "@/utils/format";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, AlarmClockOff, AlarmCheck } from "lucide-react";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";
import { useToast } from "@/components/ui/use-toast";

export default function UserPage() {
  const router = useRouter();
  const { name, userId, departmentNameList, activeStatus, regDate } =
    useUserFilteringState();
  const table = useTableState();
  const { pageIndex, pageSize, sorting } = table;
  const { reset } = useUsrFilteringAction();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data,
  }: UseQueryResult<UsrsRes, ErrorType<object>> = useQuery({
    queryKey: [
      "users",
      pageIndex,
      pageSize,
      sorting,
      name,
      userId,
      departmentNameList,
      activeStatus,
      regDate,
    ],
    queryFn: () =>
      getUsrs(
        pageIndex,
        pageSize,
        sorting[0],
        name,
        userId,
        departmentNameList,
        activeStatus,
        regDate
      )
        .then((res) => res?.data ?? {})
        .catch(() => {}),
    refetchInterval: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const onRowClick = (data: Usrs) => {
    if (!!data) {
      router.push(`/user/detail/${data.userInfoIdx}`);
    }
  };

  const list = useMemo(() => data?.itemList ?? [], [data]);
  const totalCnt = useMemo(() => data?.itemCnt ?? 0, [data]);

  return (
    <div className="flex flex-col flex-1 gap-8 h-full md:flex text-sm px-10 py-8 text-slate-800">
      <LocationHeader firstTitle="사용자 관리" />
      <div className="flex justify-between">
        <UserFilteringBtns resetPageIndex={table.resetPageIndex} />
        <Button className="w-[65px] h-9">
          <Link href="/user/register" prefetch={false}>
            등록
          </Link>
        </Button>
      </div>
      <div className="flex flex-col overflow-auto">
        <DataTable
          columns={columns}
          data={list}
          totalCount={totalCnt}
          rowRender={<RowRenderIcons />}
          headRender={<HeadRenderIcons />}
          onRowClick={onRowClick}
          placeholder={"유저 정보가 없습니다."}
          {...table}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<Usrs>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userInfoIdx",
    header: () => <div className="text-center">사용자 코드</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("userInfoIdx")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: (column) => renderSortableHeader(column, "이름"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "userId",
    header: (column) => renderSortableHeader(column, "아이디"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "departmentName",
    header: (column) => renderSortableHeader(column, "부서명"),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("departmentName")}</div>
    ),
  },
  {
    accessorKey: "activeStatus",
    header: () => <div className="text-center">활성화 상태</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("activeStatus")}</div>
    ),
  },
  {
    accessorKey: "regDate",
    header: (column) => renderSortableHeader(column, "등록일시"),
    cell: ({ row }) => (
      <div className="text-center">{formatKST(row.getValue("regDate"))}</div>
    ),
  },
];

const RowRenderIcons = ({ row }: { row?: Row<Usrs[]> }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const changeUsrActiveState = (userId: number, activeType: string) => {
    const userIdxList = [userId];
    const type = activeType === "Y" ? "N" : "Y";
    return putUsrActState(userIdxList, type);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userId,
      activeType,
    }: {
      userId: number;
      activeType: string;
    }) => changeUsrActiveState(userId, activeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "활성화 상태 변경",
        description: "성공적으로 변경되었습니다.",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "활성화 상태 변경",
        description: "오류가 발생했습니다. 다시 시도해주십시오.",
        duration: 3000,
      });
    },
  });

  return (
    <TooltipProvider>
      {row && (
        <div className="flex items-center ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} className="hover:bg-inherit p-2">
                <Link
                  href={`/user/edit/${row.getValue("userInfoIdx")}`}
                  prefetch={false}
                >
                  <Pencil size={16} className="text-slate-800" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>사용자 수정</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-inherit p-2"
                disabled={isPending}
              >
                <svg
                  className="cursor-pointer"
                  onClick={() => {
                    mutate({
                      userId: row.getValue("userInfoIdx"),
                      activeType: row.getValue("activeStatus"),
                    });
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g mask="url(#mask0_1593_5496)">
                    <path
                      d="M5.33324 9.33356C5.52213 9.33356 5.68046 9.26967 5.80824 9.14189C5.93601 9.01412 5.9999 8.85578 5.9999 8.66689C5.9999 8.47801 5.93601 8.31967 5.80824 8.19189C5.68046 8.06412 5.52213 8.00023 5.33324 8.00023C5.14435 8.00023 4.98601 8.06412 4.85824 8.19189C4.73046 8.31967 4.66657 8.47801 4.66657 8.66689C4.66657 8.85578 4.73046 9.01412 4.85824 9.14189C4.98601 9.26967 5.14435 9.33356 5.33324 9.33356ZM7.9999 9.33356C8.18879 9.33356 8.34713 9.26967 8.4749 9.14189C8.60268 9.01412 8.66657 8.85578 8.66657 8.66689C8.66657 8.47801 8.60268 8.31967 8.4749 8.19189C8.34713 8.06412 8.18879 8.00023 7.9999 8.00023C7.81101 8.00023 7.65268 8.06412 7.5249 8.19189C7.39713 8.31967 7.33324 8.47801 7.33324 8.66689C7.33324 8.85578 7.39713 9.01412 7.5249 9.14189C7.65268 9.26967 7.81101 9.33356 7.9999 9.33356ZM10.6666 9.33356C10.8555 9.33356 11.0138 9.26967 11.1416 9.14189C11.2693 9.01412 11.3332 8.85578 11.3332 8.66689C11.3332 8.47801 11.2693 8.31967 11.1416 8.19189C11.0138 8.06412 10.8555 8.00023 10.6666 8.00023C10.4777 8.00023 10.3193 8.06412 10.1916 8.19189C10.0638 8.31967 9.9999 8.47801 9.9999 8.66689C9.9999 8.85578 10.0638 9.01412 10.1916 9.14189C10.3193 9.26967 10.4777 9.33356 10.6666 9.33356ZM7.9999 14.6669C7.16657 14.6669 6.38601 14.5086 5.65824 14.1919C4.93046 13.8752 4.29712 13.4474 3.75824 12.9086C3.21935 12.3697 2.79157 11.7363 2.4749 11.0086C2.15824 10.2808 1.9999 9.50023 1.9999 8.66689C1.9999 7.83356 2.15824 7.05301 2.4749 6.32523C2.79157 5.59745 3.21935 4.96412 3.75824 4.42523C4.29712 3.88634 4.93046 3.45856 5.65824 3.14189C6.38601 2.82523 7.16657 2.66689 7.9999 2.66689C8.83324 2.66689 9.61379 2.82523 10.3416 3.14189C11.0693 3.45856 11.7027 3.88634 12.2416 4.42523C12.7805 4.96412 13.2082 5.59745 13.5249 6.32523C13.8416 7.05301 13.9999 7.83356 13.9999 8.66689C13.9999 9.50023 13.8416 10.2808 13.5249 11.0086C13.2082 11.7363 12.7805 12.3697 12.2416 12.9086C11.7027 13.4474 11.0693 13.8752 10.3416 14.1919C9.61379 14.5086 8.83324 14.6669 7.9999 14.6669ZM3.73324 1.56689L4.66657 2.50023L1.83324 5.33356L0.899902 4.40023L3.73324 1.56689ZM12.2666 1.56689L15.0999 4.40023L14.1666 5.33356L11.3332 2.50023L12.2666 1.56689ZM7.9999 13.3336C9.2999 13.3336 10.4027 12.8808 11.3082 11.9752C12.2138 11.0697 12.6666 9.96689 12.6666 8.66689C12.6666 7.36689 12.2138 6.26412 11.3082 5.35856C10.4027 4.45301 9.2999 4.00023 7.9999 4.00023C6.6999 4.00023 5.59713 4.45301 4.69157 5.35856C3.78601 6.26412 3.33324 7.36689 3.33324 8.66689C3.33324 9.96689 3.78601 11.0697 4.69157 11.9752C5.59713 12.8808 6.6999 13.3336 7.9999 13.3336Z"
                      fill="#1E293B"
                    />
                  </g>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>활성화 상태 변경</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </TooltipProvider>
  );
};

const HeadRenderIcons = ({ rows }: { rows?: Row<Usrs>[] }) => {
  const { toast } = useToast();
  const selectedUsr = rows!.map((row) => row.original);
  const selectedUsrIdx = selectedUsr!.map((usr) => usr.userInfoIdx);
  const selectedActiveStatus = selectedUsr!.map((usr) => usr.activeStatus);
  const isAllActive = !selectedActiveStatus.find((el) => el === "N");
  const isAllDeactive = !selectedActiveStatus.find((el) => el === "Y");

  const queryClient = useQueryClient();

  const changeUsrActiveState = (
    userIdxList: Array<number>,
    activeType: string
  ) => {
    return putUsrActState(userIdxList, activeType);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (activeType: string) =>
      changeUsrActiveState(selectedUsrIdx, activeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "활성화 상태 변경",
        description: "성공적으로 변경되었습니다.",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "활성화 상태 변경",
        description: "오류가 발생했습니다. 다시 시도해주십시오.",
        duration: 3000,
      });
    },
  });

  return (
    <TooltipProvider>
      {!!selectedUsrIdx[0] && (
        <div className="flex pl-0 pr-3">
          <Tooltip>
            <TooltipTrigger asChild disabled={isPending || isAllDeactive}>
              <Button
                variant={"ghost"}
                className="hover:bg-inherit p-1"
                disabled={isPending || isAllDeactive}
              >
                <AlarmClockOff
                  className="hover:text-orange-500"
                  size={18}
                  onClick={() => mutate("N")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>전체 비활성화</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild disabled={isPending || isAllActive}>
              <Button
                variant={"ghost"}
                className="hover:bg-inherit"
                disabled={isPending || isAllActive}
              >
                <AlarmCheck
                  className="hover:text-orange-500"
                  size={18}
                  onClick={() => mutate("Y")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>전체 활성화</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </TooltipProvider>
  );
};
