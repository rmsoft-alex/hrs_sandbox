"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useUsrDeptAction, useUsrDeptState } from "../store/useUserDeptStore";
import { UserDept, UsrDtlRes } from "../type";
import DeptTree from "./DeptTree";
import { DataTable, useTableState } from "@/components/common/table/table";
import { useDept, useDeptTitle } from "@/hooks/useCommon";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TooltipIcon from "@/components/ui/TooltipIcon";
import { HelpCircle, X } from "lucide-react";

type Props = {
  userInfo?: UsrDtlRes;
  mode?: "edit" | "register";
};

export default function SelectedDept({ userInfo, mode }: Props) {
  const { deptList } = useDept();
  const userDept = useUsrDeptState();

  const table = useTableState();

  return (
    <div className="h-[480px] flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <h3>부서 / 직책</h3>
        {mode === "edit" && (
          <TooltipIcon
            icon={
              <HelpCircle className="w-4 h-4 cursor-pointer text-white fill-orange-200" />
            }
            content={"주 부서는 삭제, 수정이 불가능합니다."}
            className="max-w-xs "
            orange
          />
        )}
      </div>
      <div className="h-full flex gap-6">
        <DeptTree userInfo={userInfo} tree={deptList} />
        <div className="w-[460px] h-fit border-t-[1px]">
          <DataTable
            data={userDept}
            columns={columns}
            totalCount={0}
            pageSizeView={false}
            pageIndexView={false}
            paginationBtn={false}
            selectedCountView={false}
            placeholder={"등록된 부서가 없습니다."}
            {...table}
          />
        </div>
      </div>
    </div>
  );
}

const columns: ColumnDef<UserDept>[] = [
  {
    accessorKey: "departmnetIdx",
    header: () => <div className="w-10"></div>,
    cell: ({ row }) => (
      <DeleteBtn idx={row.getValue("departmentIdx")} row={row.original} />
    ),
  },
  {
    accessorKey: "departmentIdx",
    header: () => <div className="w-32 text-center">부서</div>,
    cell: ({ row }) => (
      <DepartmentSelect departmentIdx={row.getValue("departmentIdx")} />
    ),
  },
  {
    accessorKey: "departmentTitleCode",
    header: () => <div className="w-24 text-center">직책</div>,
    cell: ({ row }) => (
      <TitleSelect idx={row.getValue("departmentIdx")} row={row.original} />
    ),
  },
  {
    accessorKey: "mainDepartmentYn",
    header: () => <div className="w-16 text-center">주 부서</div>,
    cell: ({ row }) => (
      <MainDepartment idx={row.getValue("departmentIdx")} row={row.original} />
    ),
  },
];

const DepartmentSelect = ({ departmentIdx }: { departmentIdx: number }) => {
  const { getDeptName } = useDept();

  return <div className="w-32 text-center">{getDeptName(departmentIdx)}</div>;
};

const TitleSelect = ({
  idx,
  row: { mainDepartmentYn, relationIdx },
}: {
  idx: number;
  row: {
    mainDepartmentYn: string | undefined;
    relationIdx: number | undefined;
  };
}) => {
  const { deptTitleList } = useDeptTitle();
  const userDept = useUsrDeptState();
  const { setTitle } = useUsrDeptAction();
  const isDisabled = !!(mainDepartmentYn === "Y" && relationIdx);

  return (
    <Select
      onValueChange={(departmentTitleCode) =>
        setTitle(departmentTitleCode, idx)
      }
      value={
        userDept.find(
          ({ departmentIdx }: { departmentIdx: number | undefined }) =>
            departmentIdx === idx
        )?.departmentTitleCode || undefined
      }
      disabled={isDisabled}
    >
      <SelectTrigger className="w-24 text-center border-slate-300">
        <SelectValue placeholder="직책" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {deptTitleList?.map(
            ({
              commonCode,
              commonCodeName,
            }: {
              commonCode: string;
              commonCodeName: string;
            }) => (
              <SelectItem key={commonCode} value={commonCode}>
                {commonCodeName}
              </SelectItem>
            )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const MainDepartment = ({
  idx,
  row: { mainDepartmentYn, relationIdx },
}: {
  idx: number;
  row: {
    mainDepartmentYn: string | undefined;
    relationIdx: number | undefined;
  };
}) => {
  const userDept = useUsrDeptState();
  const { setMainDepartmentYn } = useUsrDeptAction();
  const isDisabled = !!(mainDepartmentYn === "Y" && relationIdx);

  return (
    <div className="flex justify-end">
      <Select
        onValueChange={(value) => setMainDepartmentYn(value, idx)}
        defaultValue={
          userDept.find(
            ({ departmentIdx }: { departmentIdx: number | undefined }) =>
              departmentIdx === idx
          )?.mainDepartmentYn || undefined
        }
        disabled={isDisabled}
      >
        <SelectTrigger className="w-16 text-center border border-slate-300">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="Y">
              <p className="text-orange-500">주</p>
            </SelectItem>
            <SelectItem value="N">
              <p className="text-slate-900">부</p>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const DeleteBtn = ({
  idx,
  row: { mainDepartmentYn, relationIdx },
}: {
  idx: number;
  row: {
    mainDepartmentYn: string | undefined;
    relationIdx: number | undefined;
  };
}) => {
  const { deleteRow } = useUsrDeptAction();
  const isDisabled = !!(mainDepartmentYn === "Y" && relationIdx);

  return (
    <Button
      className="w-10 px-2 py-1 border border-slate-100"
      type="button"
      variant={"ghost"}
      onClick={() => deleteRow(idx)}
      disabled={isDisabled}
    >
      <X className="text-red-500" size={16} />
    </Button>
  );
};
