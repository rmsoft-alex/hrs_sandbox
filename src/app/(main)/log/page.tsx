"use client";

import React, { useMemo, useState } from "react";
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { getDegree, getLogs } from "@/api/log.api";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { DataTable, useTableState } from "@/components/common/table/table";
import { Degree, Logs, LogsRes } from "./type";
import { formatKST } from "@/utils/format";
import useDegree from "./hook/useDegree";
import Modals from "./components/Modals";
import { ErrorType } from "@/types/type";

import { ListPlus, ListRestart, MinusCircle, PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast, useToast } from "@/components/ui/use-toast";

export default function LogPage() {
  const router = useRouter();
  const table = useTableState();
  const { degree } = useDegree();

  const {
    data,
  }: UseQueryResult<LogsRes, ErrorType<object>> = useQuery({
    queryKey: ["logs", table.pageIndex, table.pageSize],
    queryFn: () =>
      getLogs(table.pageIndex, table.pageSize)
        .then((res) => res.data ?? {})
        .catch(() => {}),
    refetchInterval: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: table.pageIndex !== undefined,
  });
  const itemList = useMemo(() => data?.itemList ?? [], [data]);
  const itemCnt = useMemo(() => data?.itemCnt ?? 0, [data]);

  const [isFirstAssignModalOpen, setIsFirstAssignModalOpen] = useState(false);
  const [isSecondAssignModalOpen, setIsSecondAssignModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSelectedResetModalOpen, setIsSelectedResetModalOpen] =
    useState(false);
  const [selectedLogs, setSelectedLogs] = useState<Array<number>>([]);

  const onRowClick = (data: Logs) => {
    return toast({
      variant: "destructive",
      title: "페이지 이동",
      description: "상세페이지 API 생성 중입니다.",
      duration: 3000,
    });
    // router.push(`log/${data.logType.toLowerCase()}/${data.logInfoIdx}`);
  };

  const onReset = () => {
    setIsResetModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col flex-1 gap-8 px-10 py-8 text-sm text-slate-800">
      <LocationHeader firstTitle="통합 변경 이력" />
      <div className="h-full flex flex-1 justify-end items-center">
        <Button onClick={onReset} disabled={!degree} className="h-9 px-4">
          차수 초기화
        </Button>
      </div>
      <Modals
        isResetModalOpen={isResetModalOpen}
        setIsResetModalOpen={setIsResetModalOpen}
        isFirstAssignModalOpen={isFirstAssignModalOpen}
        setIsFirstAssignModalOpen={setIsFirstAssignModalOpen}
        selectedLogs={selectedLogs}
        setSelectedLogs={setSelectedLogs}
        isSelectedResetModalOpen={isSelectedResetModalOpen}
        setIsSelectedResetModalOpen={setIsSelectedResetModalOpen}
        isSecondAssignModalOpen={isSecondAssignModalOpen}
        setIsSecondAssignModalOpen={setIsSecondAssignModalOpen}
      />
      <div className="w-full border-t-[1px] h-[500px] flex flex-col flex-1 pb-8">
        <DataTable
          columns={columns}
          data={itemList}
          totalCount={itemCnt}
          onRowClick={onRowClick}
          headRender={
            <HeadRenderIcons
              setIsAssignModalOpen={setIsFirstAssignModalOpen}
              setSelectedLogs={setSelectedLogs}
              setIsSelectedResetModalOpen={setIsSelectedResetModalOpen}
            />
          }
          placeholder="변경 이력이 없습니다."
          {...table}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<Logs>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <CheckBoxCell
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        row={row.original}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "logType",
    header: () => <div className="text-center">분류</div>,
    cell: ({ row }) => <LogTypeCell logType={row.getValue("logType")} />,
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
    header: () => <div className="text-center">담당자</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("regBy")}</div>
    ),
  },
  {
    accessorKey: "degree",
    header: () => <div className="text-center">차수</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("degree") ?? "-"}</div>
    ),
  },
];

const CheckBoxCell = ({
  checked,
  onCheckedChange,
  row,
}: {
  checked: CheckedState | undefined;
  onCheckedChange: (checked: CheckedState) => void;
  row: Logs;
}) => {
  const { degree } = useDegree();

  const isDisabled = !!(row.degree && row.degree !== degree);
  return (
    <Checkbox
      checked={checked}
      onClick={(e) => e.stopPropagation()}
      onCheckedChange={onCheckedChange}
      aria-label="Select row"
      disabled={isDisabled}
    />
  );
};

const LogTypeCell = ({ logType }: { logType: string }) => {
  const type =
    logType === "DEPARTMENT"
      ? "부서 정보 변경"
      : logType === "USER"
      ? "사용자 정보 변경"
      : "부서 개편";

  return <div className="text-center">{type}</div>;
};

const HeadRenderIcons = ({
  rows,
  setIsAssignModalOpen,
  setSelectedLogs,
  setIsSelectedResetModalOpen,
}: {
  rows?: Row<Logs>[];
  setIsAssignModalOpen: (value: boolean) => void;
  setSelectedLogs: (value: Array<number>) => void;
  setIsSelectedResetModalOpen: (value: boolean) => void;
}) => {
  const { toast } = useToast();
  const { latestAssignedLogInfoIdx, mustAssignedLogInfoIdx } = useDegree();
  const selectedLog = rows!.map((row) => row.original);
  const selectedLogIndex = rows!.map((row) => row.index);
  const isIncludesDegree = !!selectedLog.find((el) => el.degree);
  const isIncludesNullDegree = !!selectedLog.find((el) => !el.degree);
  const calSelectedIdx = selectedLogIndex?.map((el, idx) => el - idx);
  const isSelectedIdxInLine = calSelectedIdx.find(
    (el) => calSelectedIdx[0] !== el
  );

  const onAssign = () => {
    return toast({
      variant: "destructive",
      title: "차수 등록",
      description: "해당 API를 수정하고 있습니다.",
      duration: 3000,
    });
    if (selectedLog.reverse()[0].logInfoIdx !== mustAssignedLogInfoIdx) {
      toast({
        variant: "destructive",
        title: "차수 등록",
        description: "아직 차수를 등록하지 않은 이전 이력이 있습니다.",
        duration: 3000,
      });
    } else if (isSelectedIdxInLine) {
      toast({
        variant: "destructive",
        title: "차수 등록",
        description:
          "차수 등록은 변경일자가 오래된 이력부터 순서대로 등록 가능합니다.",
        duration: 3000,
      });
    } else {
      setSelectedLogs(selectedLogIndex);
      setIsAssignModalOpen(true);
    }
  };

  const onReset = () => {
    if (!selectedLog.find((el) => el.logInfoIdx == latestAssignedLogInfoIdx)) {
      toast({
        variant: "destructive",
        title: "차수 취소",
        description: "아직 차수 취소를 하지 않은 최신 이력이 있습니다.",
        duration: 3000,
      });
    } else if (isSelectedIdxInLine) {
      toast({
        variant: "destructive",
        title: "차수 취소",
        description: "차수 취소는 최신 이력부터 순서대로 등록 가능합니다.",
        duration: 3000,
      });
    } else {
      setSelectedLogs(selectedLogIndex);
      setIsSelectedResetModalOpen(true);
    }
  };

  return (
    <TooltipProvider>
      {!!selectedLog[0] && (
        <div className="flex pl-0 pr-3">
          <Tooltip>
            <TooltipTrigger asChild disabled={isIncludesDegree}>
              <Button
                variant={"ghost"}
                className="hover:bg-inherit p-1"
                onClick={onAssign}
                disabled={isIncludesDegree}
              >
                <ListPlus
                  className={`${
                    isIncludesDegree
                      ? "cursor-not-allowed opacity-50"
                      : "hover:cursor-pointer hover:text-orange-500"
                  }`}
                  size={18}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>차수 등록</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              disabled={!isIncludesDegree || isIncludesNullDegree}
            >
              <Button
                variant={"ghost"}
                className={`hover:bg-inherit ${
                  !isIncludesDegree || isIncludesNullDegree
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={onReset}
                disabled={!isIncludesDegree || isIncludesNullDegree}
              >
                <ListRestart
                  className={`${
                    !isIncludesDegree || isIncludesNullDegree
                      ? "cursor-not-allowed opacity-50"
                      : "hover:cursor-pointer hover:text-orange-500"
                  }`}
                  size={18}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>차수 등록 취소</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </TooltipProvider>
  );
};
