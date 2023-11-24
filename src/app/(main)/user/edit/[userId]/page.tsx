"use client";
import React from "react";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import UserForm from "../../components/UserForm";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getUsrByIdx } from "@/api/user.api";
import { ErrorType } from "@/types/type";
import { UsrDtlRes } from "../../type";

export default function UserEditPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = +params.userId;
  const {
    data,
  }: UseQueryResult<UsrDtlRes, ErrorType<object>> = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUsrByIdx(userId).then((res) => res.data),
    refetchInterval: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: userId !== undefined,
  });

  return (
    <div className="h-full flex flex-col flex-1 px-10 py-8 text-sm text-slate-800">
      <LocationHeader
        firstTitle="사용자 관리"
        firstPath="/user"
        secondTitle="사용자 수정"
      />
      {data && <UserForm mode="edit" userInfo={data} />}
    </div>
  );
}
