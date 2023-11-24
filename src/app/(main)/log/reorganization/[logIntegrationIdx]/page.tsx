"use client";

import React, { useEffect, useMemo, useState } from "react";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import NewDeptLogTable from "../../components/NewDeptLogTable";
import DeleteDeptLogTable from "../../components/DeleteDeptLogTable";
import UserLogListTable from "../../components/UserLogListTable";
import TreeView from "@/components/tree/TreeView";
import { formatKST } from "@/utils/format";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { TreeDataType } from "@/app/(main)/restructure/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReorganizationLogById } from "@/api/log.api";

type Props = {
  params: { logInfoIdx: number };
};

export default function ReorganizationLogPage({
  params: { logInfoIdx },
}: Props) {
  const { data } = useQuery({
    queryKey: ["reorganizationLog"],
    queryFn: () =>
      getReorganizationLogById(logInfoIdx)
        .then((res) => res.data ?? {})
        .catch(() => {}),
    refetchInterval: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: logInfoIdx !== undefined,
  });

  // 하이드레이션 에러 해결
  const [isClient, setIsClient] = useState(false);
  const [selectedPreDept, setSelectedPreDept] = useState<
    NodeModel<TreeDataType>[]
  >([]);
  const [selectedDept, setSeslectedDept] = useState<NodeModel<TreeDataType>[]>(
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const deleteDepartmentLogList = useMemo(
    () => data?.deleteDepartmentLogList ?? [],
    [data]
  );
  const departmentChart = useMemo(() => data?.departmentChart ?? [], [data]);
  const newDepartmentLogList = useMemo(
    () => data?.newDepartmentLogList ?? [],
    [data]
  );
  const preDepartmentChart = useMemo(
    () => data?.preDepartmentChart ?? [],
    [data]
  );
  const restructureInfo = useMemo(() => data?.restructureInfo, [data]);
  const userLogList = useMemo(() => data?.userLogList ?? [], [data]);

  return (
    <>
      {isClient && (
        <div className="flex flex-1 flex-col gap-10 h-full text-sm px-10 py-8 text-slate-800 font-normal">
          <LocationHeader
            firstTitle="통합 변경 이력"
            firstPath="/log"
            secondTitle="부서 개편 이력 조회"
          />
          <div className="flex flex-col gap-[60px]">
            <div className="flex gap-10">
              <header className="w-[705px] flex flex-col gap-[74px] pt-[33px]">
                <div className="flex flex-col gap-10">
                  <dl className="flex flex-col gap-[10px]">
                    <dt>변경 일시</dt>
                    <dd className="border-t-[1px] border-slate-200 pt-[10px] text-slate-700">
                      {formatKST(restructureInfo?.regDate)}
                    </dd>
                  </dl>
                  <dl className="flex flex-col gap-[10px]">
                    <dt>담당자</dt>
                    <dd className="border-t pt-[10px] text-slate-700">
                      {restructureInfo?.regBy}
                    </dd>
                  </dl>
                  <dl className="flex flex-col gap-[10px]">
                    <dt>사유</dt>
                    <dd className="border-t pt-[10px] text-slate-700">
                      {restructureInfo?.description}
                    </dd>
                  </dl>
                </div>
                <div className="w-full h-[120px] flex justify-evenly items-center border-[1px] border-slate-200 font-medium">
                  <div className="flex flex-col gap-4 items-center">
                    <p>부서 신설 개수</p>
                    <p>{restructureInfo?.newDepartmentCnt}</p>
                  </div>
                  <div className="flex flex-col gap-4 items-center">
                    <p>부서 폐지 개수</p>
                    <p>{restructureInfo?.deleteDepartmentCnt}</p>
                  </div>
                  <div className="flex flex-col gap-4 items-center">
                    <p>구성원 변경 개수</p>
                    <p>{restructureInfo?.changeUserCnt}</p>
                  </div>
                </div>
              </header>
              <div className="flex gap-5">
                <div className="w-[280px] h-[487px] border-[1px] border-slate-200">
                  <h3 className="font-medium px-[30px] py-3 border-b-[1px] border-slate-200">
                    원본 조직도
                  </h3>
                  {/* <TreeView
                  tree={
                    preDepartmentChart?.filter(
                      (node) =>
                        !(
                          node.data?.activeType === "Y" &&
                          node.data?.restructureIdx
                        )
                    ) || []
                  }
                  selectedNode={selectedPreDept}
                  setSelectedNode={setSelectedPreDept}
                  canSearch={true}
                /> */}
                </div>
                <div className="w-[280px] h-[487px] border-[1px] border-slate-200">
                  <h3 className="font-medium px-[30px] py-3 border-b-[1px] border-slate-200">
                    예정 조직도
                  </h3>
                  {/* <TreeView
                  tree={
                    departmentChart?.filter(
                      (node) =>
                        !(
                          node.data?.activeType === "Y" &&
                          node.data?.restructureIdx
                        )
                    ) || []
                  }
                  selectedNode={selectedDept}
                  setSelectedNode={setSeslectedDept}
                  canSearch={true}
                /> */}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <NewDeptLogTable newDepartmentLogList={newDepartmentLogList} />
              <DeleteDeptLogTable
                deleteDepartmentLogList={deleteDepartmentLogList}
              />
              <UserLogListTable userLogList={userLogList} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
