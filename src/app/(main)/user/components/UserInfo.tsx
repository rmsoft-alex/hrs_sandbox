"use client";
import React, { useMemo } from "react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getUsrByIdx } from "@/api/user.api";
import { UsrDtlRes } from "../type";
import UserInfoDetail from "./UserInfoDetail";
import UserDepartmentDetail from "./UserDepartmentDetail";
import { ErrorType } from "@/types/type";

import { Separator } from "@/components/ui/separator";
import TooltipIcon from "@/components/ui/TooltipIcon";
import { HelpCircle } from "lucide-react";

type Props = {
  userId: number;
};

export default function UserInfo({ userId }: Props) {
  const {
    data,
  }: UseQueryResult<UsrDtlRes, ErrorType<object>> = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUsrByIdx(userId).then((res) => res.data),
    refetchInterval: 1000 * 60 * 5,
    enabled: userId !== undefined,
  });

  const userDepartment = useMemo(
    () => data?.departmentUserRelations ?? [],
    [data]
  );

  return (
    <div className="px-5">
      {data ? (
        <div className="flex gap-20">
          <UserInfoDetail userDetail={data} />
          <div className="flex gap-10">
            <Separator orientation="vertical" />
            <div>
              <div className="flex items-center gap-1 mb-[15px]">
                <h3>부서 정보</h3>
                <TooltipIcon
                  icon={
                    <HelpCircle className="w-4 h-4 cursor-pointer text-white fill-orange-200" />
                  }
                  content={
                    "부서 이름을 클릭하면 해당 부서 조회 페이지로 이동합니다."
                  }
                  className="max-w-xs"
                  orange
                />
              </div>
              {userDepartment && (
                <UserDepartmentDetail userDepartment={userDepartment} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>데이터가 존재하지 않습니다.</div>
      )}
    </div>
  );
}
