"use client";
import React, { useMemo } from "react";
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { getUsrLogById } from "@/api/log.api";
import { UsrLogsRes } from "../../type";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import dayjs from "dayjs";
import UserLogTable from "../../components/UserLogTable";
import UserDeptLogTable from "../../components/UserDeptLogTable";
import { useTitle } from "@/hooks/useCommon";
import { ErrorType } from "@/types/type";

type Props = {
  params: { logInfoIdx: number };
};

type UsrChangeList = {
  type: string;
  prev: string;
  current: string;
};

export default function UserLogPage({ params: { logInfoIdx } }: Props) {
  const {
    data,
  }: UseQueryResult<UsrLogsRes, ErrorType<object>> = useQuery({
    queryKey: ["usrLog"],
    queryFn: () =>
      getUsrLogById(logInfoIdx)
        .then((res) => res?.data ?? {})
        .catch(() => {}),
    refetchInterval: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: logInfoIdx !== undefined,
  });

  const userInfo = useMemo(() => data?.resUserInfo, [data]);
  const userChangeInfo = useMemo(() => data?.resUserChangeInfo, [data]);
  const userDeptRltChangeInfo = useMemo(
    () => data?.resUserDepartmentRelationChangeInfo,
    [data]
  );

  const { getTitleName } = useTitle();
  const userChangeList: UsrChangeList[] = [];

  if (!!userChangeInfo) {
    if (userChangeInfo.preName) {
      userChangeList.push({
        type: "이름",
        prev: userChangeInfo.preName,
        current: userChangeInfo.name,
      });
    }
    if (userChangeInfo.preNickname) {
      userChangeList.push({
        type: "닉네임",
        prev: userChangeInfo.preNickname,
        current: userChangeInfo.nickname!,
      });
    }
    if (userChangeInfo.preEmployeeNumber) {
      userChangeList.push({
        type: "사번",
        prev: userChangeInfo.preEmployeeNumber,
        current: userChangeInfo.employeeNumber!,
      });
    }
    if (userChangeInfo.preTitleCode) {
      userChangeList.push({
        type: "직위",
        prev: getTitleName(userChangeInfo.preTitleCode),
        current: getTitleName(userChangeInfo.titleCode!),
      });
    }
  }

  return (
    <div className="flex flex-col gap-14 h-full text-sm px-10 py-8 text-slate-800">
      <LocationHeader
        firstTitle="통합 변경 이력"
        firstPath="/log"
        secondTitle="부서 정보 변경 이력 조회"
      />
      <div className="flex flex-col h-full gap-14 overflow-hidden">
        <header className="flex items-center">
          <dl className="w-40 flex flex-col items-start">
            <dt className="font-medium pb-3">이름</dt>
            <dd className="w-full border-t font-normal pt-2">
              {userInfo?.name!}
            </dd>
          </dl>
          <dl className="w-60 flex flex-col items-start">
            <dt className="font-medium pb-3">변경 일자</dt>
            <dd className="w-full border-t font-normal pt-2">
              {dayjs(userInfo?.regDate! || "").format("YYYY.MM.DD")}
            </dd>
          </dl>
          <dl className="flex flex-col flex-1 items-start">
            <dt className="font-medium pb-3">담당자</dt>
            <dd className="w-full border-t font-normal pt-2">
              {userInfo?.regBy!}
            </dd>
          </dl>
        </header>
        <UserLogTable usrList={userChangeList} />
        <UserDeptLogTable deptList={userDeptRltChangeInfo!} />
      </div>
    </div>
  );
}
