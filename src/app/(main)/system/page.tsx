"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { putUsrActState } from "@/api/user.api";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { DataTable, useTableState } from "@/components/common/table/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import SystemFilterBtn from "./components/SystemFilterBtn";
import { useRouter } from "next/navigation";
import { SystemItemType, SystemListType } from "@/api/system.api.schema";
import { deleteSystem, getSystemList } from "@/api/system.api";
import { DataTableColumnHeader } from "./components/SystemColumnsHeader";
import {
  useSystemFieldState,
  useSystemFilterAction,
} from "./store/useSystemFilterStore";
import { useToast } from "@/components/ui/use-toast";
import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { formatKST } from "@/utils/format";
import { renderSortableHeader } from "@/components/common/table/renderSortableHeader";

export default function SystemPage() {
  const router = useRouter();
  const { systemCode, systemName, systemDomain } = useSystemFieldState();
  const { reset } = useSystemFilterAction();
  const {
    pageIndex,
    pageSize,
    setPagination,
    setSorting,
    sorting,
    setRowSelection,
    rowSelection,
    resetPageIndex,
  } = useTableState();
  const { data, isPending }: UseQueryResult<SystemListType> = useQuery({
    queryKey: [
      "system",
      pageIndex,
      pageSize,
      sorting,
      systemCode,
      systemName,
      systemDomain,
    ],
    queryFn: () =>
      getSystemList(
        pageIndex,
        pageSize,
        sorting[0],
        systemCode,
        systemName,
        systemDomain
      )
        .then((res) => res?.data ?? {})
        .catch(() => {}),
    placeholderData: keepPreviousData,
  });

  const onRowClick = (data: SystemItemType) => {
    router.push(`/system/${data?.systemIdx}`);
  };

  const list = useMemo(() => data?.itemList ?? [], [data]);
  const totalCnt = useMemo(() => data?.itemCnt ?? 0, [data]);

  //다른 페이지 갔다가 오면 검색조건 초기화
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="flex flex-1 flex-col gap-8 h-full px-10 py-8 min-h-[96px] ">
      <LocationHeader firstTitle="시스템 조회" />
      <div className="flex justify-between items-center">
        <SystemFilterBtn resetPageIndex={resetPageIndex} />
        <Link href="/system/register">
          <Button className="self-end w-[65px] h-9">등록</Button>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DataTable
          columns={columns}
          data={list}
          totalCount={totalCnt}
          setPagination={setPagination}
          pageIndex={pageIndex}
          pageSize={pageSize}
          sorting={sorting}
          setSorting={setSorting}
          setRowSelection={setRowSelection}
          rowSelection={rowSelection}
          rowRender={<RowRenderIcons />}
          headRender={<HeadRenderIcons />}
          onRowClick={onRowClick}
          placeholder={isPending ? "로딩중입니다" : "검색된 정보가 없습니다."}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<SystemItemType>[] = [
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
    accessorKey: "systemCode",
    header: (column) => renderSortableHeader(column, "시스템 코드", "w-[7rem]"),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            {row.original.systemCode.length > 6 ? (
              <>
                <TooltipContent>
                  <div>{row.getValue("systemCode")}</div>
                </TooltipContent>
              </>
            ) : (
              <></>
            )}
            <div className="w-[7rem] truncate text-center">
              {row.getValue("systemCode")}
            </div>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "systemName",
    header: (column) => renderSortableHeader(column, "시스템 명", "w-[6rem]"),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            {row.original.systemName.length > 6 ? (
              <>
                <TooltipContent>
                  <div>{row.getValue("systemName")}</div>
                </TooltipContent>
              </>
            ) : (
              <></>
            )}
            <div className="w-[6rem] truncate text-center">
              {row.getValue("systemName")}
            </div>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "systemDomain",
    header: (column) =>
      renderSortableHeader(column, "시스템 도메인", "w-[16rem]"),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            {row.original.systemDomain.length > 12 ? (
              <>
                <TooltipContent>
                  <div>{row.getValue("systemDomain")}</div>
                </TooltipContent>
              </>
            ) : (
              <></>
            )}
            <div className="w-[16rem] truncate text-center">
              {row.getValue("systemDomain")}
            </div>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "active",
    header: (column) => renderSortableHeader(column, "사용 여부", "w-[6rem]"),
    cell: ({ row }) => (
      <div className="w-[6rem] text-center">{row.getValue("active")}</div>
    ),
  },
  {
    accessorKey: "regDate",
    header: (column) => renderSortableHeader(column, "등록일시", "w-[6rem]"),
    cell: ({ row }) => {
      return (
        <div className="text-center w-[6rem]">
          {formatKST(new Date(row.original.regDate))}
        </div>
      );
    },
  },
  {
    accessorKey: "regBy",
    header: (column) => renderSortableHeader(column, "등록자", "w-[6rem]"),
    cell: ({ row }) => {
      return <p className="w-[6rem] text-center">{row.getValue("regBy")}</p>;
    },
  },
  {
    accessorKey: "updtDate",
    header: (column) => renderSortableHeader(column, "수정일시", "w-[6rem]"),
    cell: ({ row }) => {
      if (row.original?.updtDate) {
        return (
          <p className="w-[6rem] text-center">
            {formatKST(new Date(row.original.updtDate))}
          </p>
        );
      } else {
        return <p className="w-[6rem] text-center">-</p>;
      }
    },
  },
  {
    accessorKey: "updtBy",
    header: (column) => renderSortableHeader(column, "수정자", "w-[6rem]"),
    cell: ({ row }) => {
      return <p className="w-[6rem] text-center">{row.getValue("updtBy")}</p>;
    },
  },
];

const RowRenderIcons = ({ row }: { row?: Row<SystemItemType> }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  //삭제재확인모달
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: ({ reqSystemIdx }: { reqSystemIdx: number }) =>
      deleteSystem([reqSystemIdx]),

    onSuccess: (res) => {
      if (res.code === 100) {
        queryClient.invalidateQueries({ queryKey: ["system"] });
        toast({
          title: "삭제 되었습니다.",
          duration: 3000, // 3초 동안 표시
        });
        setDeleteConfirmModalOpen(false);
      }
    },
    onError: (error) => {
      toast({
        description: "시스템 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  const onDeleteConfirm = () => {
    if (row) {
      mutation.mutate({
        reqSystemIdx: row.original.systemIdx,
      });
    }
  };
  return (
    <>
      <TooltipProvider>
        {row && (
          <div className="flex gap-5 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/system/edit/${row.original.systemIdx}`}>
                  <Pencil size={16} className="text-slate-800" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>수정</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Trash2
                  className="w-[18px] cursor-pointer"
                  onClick={() => setDeleteConfirmModalOpen(true)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>삭제</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </TooltipProvider>
      <Modal
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
        title="삭제"
        description="삭제하시겠습니까?"
      >
        <div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={onDeleteConfirm}>확인</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const HeadRenderIcons = ({ rows }: { rows?: Row<SystemItemType>[] }) => {
  const selectedSystem = rows!.map((row) => row.original);
  const selectedSystemIdx = selectedSystem!.map((usr) => usr.systemIdx);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  //삭제재확인모달
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: ({ reqSystemIdx }: { reqSystemIdx: number[] }) =>
      deleteSystem(reqSystemIdx),
    onSuccess: (res) => {
      if (res.code === 100) {
        queryClient.invalidateQueries({ queryKey: ["system"] });
        toast({
          title: "삭제 되었습니다.",
          duration: 3000, // 3초 동안 표시
        });
        setDeleteConfirmModalOpen(false);
      }
    },
    onError: (error) => {
      toast({
        description: "시스템 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const toEdit = () => {
    router.push(`/system/edit/${selectedSystem[0]?.systemIdx}`);
  };

  const onDeleteConfirm = () => {
    if (selectedSystemIdx) {
      mutateAsync({
        reqSystemIdx: selectedSystemIdx,
      });
    }
  };

  return (
    <>
      <TooltipProvider>
        {!!selectedSystemIdx[0] && (
          <div className="flex gap-2 pl-0 pr-3">
            <Tooltip>
              <TooltipTrigger asChild>
                {selectedSystem.length > 1 ? (
                  <Pencil className="w-[18px] cursor-not-allowed	opacity-30" />
                ) : (
                  <Pencil
                    className="w-[18px] cursor-pointer"
                    onClick={toEdit}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>수정</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Trash2
                  className="w-[18px] cursor-pointer"
                  onClick={() => setDeleteConfirmModalOpen(true)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>삭제</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </TooltipProvider>
      <Modal
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
        title="삭제"
        description="삭제하시겠습니까?"
      >
        <div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={onDeleteConfirm}>확인</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
