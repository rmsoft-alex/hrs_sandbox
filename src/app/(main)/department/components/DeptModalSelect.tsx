"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Listschema } from "../../../../api/department.api.schema";
import { z } from "zod";
import { DeptModalStore } from "../store/useModalStore";
import { useDeptTitle } from "@/hooks/useCommon";

const DeptModalSelect = ({
  subDepartmentTitleCode,
  userInfoIdx,
}: {
  subDepartmentTitleCode: string;
  userInfoIdx: number;
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof Listschema>>({
    resolver: zodResolver(Listschema),
    mode: "onChange",
  });
  const { setDeptTitleCode } = DeptModalStore();

  const { deptTitleList } = useDeptTitle();
  const changeTitleCode = watch("listFilter");

  useEffect(() => {
    if (changeTitleCode) {
      setDeptTitleCode(userInfoIdx, changeTitleCode);
    }
  }, [changeTitleCode, setDeptTitleCode, userInfoIdx]);

  return (
    <div>
      <Controller
        control={control}
        name="listFilter"
        render={({ field }) => (
          <Select
            onValueChange={(selectedValue: string) => {
              field.onChange(selectedValue);
            }}
            value={changeTitleCode ? changeTitleCode : subDepartmentTitleCode}
          >
            <SelectTrigger className="w-[8.4375rem] mx-[auto]">
              <SelectValue placeholder="전체보기" />
            </SelectTrigger>
            <SelectContent>
              {deptTitleList?.map(
                ({
                  commonCode,
                  commonCodeName,
                }: {
                  commonCode: string;
                  commonCodeName: string;
                }) => (
                  <SelectItem
                    key={commonCode}
                    value={commonCode}
                    className="hover:bg-orange-50"
                  >
                    {commonCodeName}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default DeptModalSelect;
