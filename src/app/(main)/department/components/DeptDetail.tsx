/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable, useTableState } from "@/components/common/table/table";
interface IntrinsicAttributes {
  selectedNodes: NodeModel[];
}
import { columns } from "./DeptColumns";
import { useModal } from "@/hooks/modals/useModal";
import { getDeptDetail } from "../../../../api/department.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DepartmentStore } from "../store/useDepartmentStore";
import { DeptModalStore } from "../store/useModalStore";
import TooltipIcon from "@/components/ui/TooltipIcon";
import { HelpCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const DeptDetail: React.FC<IntrinsicAttributes> = ({ selectedNodes }) => {
  const [isSubInclude, setIsSubInclude] = useState<string>("N");
  const tableState = useTableState();
  const { onOpen } = useModal();
  const departmentIdx = Number(selectedNodes[0]?.id);
  const { setDepartmentIdx } = DepartmentStore();
  const { setRegulationOrder } = DeptModalStore();
  const params = useSearchParams();
  const paramsId = params.get("selected");
  useEffect(() => {
    setDepartmentIdx(departmentIdx);
  }, [departmentIdx, setDepartmentIdx]);

  //하위포함 데이터
  const tabsChange = (tabValue: string) => {
    if (tabValue === "isSubInclude") {
      setIsSubInclude("Y");
    } else {
      setIsSubInclude("N");
    }
  };

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["getDeptDetail", departmentIdx, isSubInclude],
    queryFn: () => getDeptDetail(departmentIdx, isSubInclude),
    placeholderData: keepPreviousData,
    enabled: !!departmentIdx,
  });

  if (selectedNodes[0] !== undefined && isPending)
    return <p className="px-5 text-2xl font-bold">로딩중입니다.</p>;

  const DeptOpen = () => {
    setRegulationOrder(data.regulationOrder);
    onOpen("department");
  };

  return selectedNodes[0] !== undefined ? (
    <>
      <div className="">
        <div className="flex items-center	gap-[10px]">
          <h2 className="text-2xl font-bold">{data.name}</h2>
          {data.deactivationStatus === "Y" ? (
            <p className="w-[48px] h-[28px] leading-[28px] text-center text-sm rounded-full border border-red-600 text-red-600">
              폐지
            </p>
          ) : null}
        </div>
        <div className="mt-[20px] min-h-[163px] text-slate-600">
          {data.parentDepartmentName ? (
            <p className="flex gap-[10px]">
              <img src="/images/department.svg" alt="부서아이콘" />
              상위부서 {data.parentDepartmentName}
            </p>
          ) : (
            <p className="flex gap-[10px]">
              <img src="/images/department.svg" alt="부서아이콘" />
              상위부서가 존재하지 않습니다.
            </p>
          )}
        </div>
      </div>
      <div>
        <div className="flex gap-2 items-baseline	">
          <b className="text-base">구성원 {data.size}</b>
          <p className="text-sm text-slate-600">
            (주 부서원:
            {data.userList?.filter(
              (userList: { mainDepartment: string | null | undefined }) =>
                userList.mainDepartment === "Y"
            ).length || 0}
            , 부 부서원:
            {data.userList?.filter(
              (userList: { mainDepartment: string | null | undefined }) =>
                userList.mainDepartment === "N"
            ).length || 0}
            )
          </p>
        </div>

        <Tabs
          defaultValue={isSubInclude === "Y" ? "isSubInclude" : "NonSubInclude"}
          className="relative"
          onValueChange={tabsChange}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-end mt-3 mb-[13px] ">
              {isSubInclude === "N" ? (
                <button
                  className="w-[106px] h-[36px] text-sm rounded-md border border-slate-300"
                  onClick={DeptOpen}
                >
                  부 부서원 관리
                </button>
              ) : (
                <button className="pointer-events-none cursor-not-allowed w-[106px] h-[36px] text-sm rounded-md border border-slate-300 opacity-30">
                  부 부서원 관리
                </button>
              )}
              <TooltipIcon
                icon={
                  <HelpCircle className="w-5 h-5 ml-1 cursor-pointer text-white fill-orange-200" />
                }
                content={"해당 부서의 소속멤버만 관리할 수 있습니다."}
                className="max-w-xs "
                orange
              />
            </div>
            <TabsList>
              <TabsTrigger value="NonSubInclude">소속멤버</TabsTrigger>
              <TabsTrigger value="isSubInclude">하위포함</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="NonSubInclude">
            <DataTable
              className="max-h-[321px]"
              columns={columns}
              totalCount={data.length}
              data={data.userList}
              selectedCountView={false}
              pageSizeView={false}
              pageIndexView={false}
              paginationBtn={false}
              {...tableState}
            />
          </TabsContent>
          <TabsContent value="isSubInclude">
            <DataTable
              className="max-h-[321px]"
              columns={columns}
              totalCount={data.length}
              data={data.userList}
              selectedCountView={false}
              pageSizeView={false}
              pageIndexView={false}
              paginationBtn={false}
              {...tableState}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  ) : paramsId !== null ? (
    <div>로딩중입니다.</div>
  ) : (
    <div className="px-5 text-2xl font-bold">부서를 선택해주세요 :)</div>
  );
};

export default DeptDetail;
