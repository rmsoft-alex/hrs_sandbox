"use client";
import React, { useState } from "react";
import Link from "next/link";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import UserInfo from "../../components/UserInfo";
import UserChangeHistory from "../../components/UserChangeHistory";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = +params.userId;
  const [value, setValue] = useState("userInfo");

  return (
    <div className="h-full flex flex-col flex-1 gap-8 px-10 py-8 text-sm text-slate-800">
      <LocationHeader
        firstTitle="사용자 관리"
        firstPath="/user"
        secondTitle="사용자 상세"
      />
      <Tabs
        onValueChange={setValue}
        className="flex flex-col gap-8 overflow-hidden"
        defaultValue="userInfo"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger className="py-[6px] px-[15px]" value="userInfo">
              사용자 정보
            </TabsTrigger>
            <TabsTrigger value="userChangeHistory">정보 변경 이력</TabsTrigger>
          </TabsList>
          {value === "userInfo" && (
            <Button>
              <Link href={`/user/edit/${userId}`} prefetch={false}>
                수정
              </Link>
            </Button>
          )}
        </div>
        <TabsContent className="mt-0" value="userInfo">
          <UserInfo userId={userId} />
        </TabsContent>
        <TabsContent
          className="mt-0 h-full overflow-hidden"
          value="userChangeHistory"
        >
          <UserChangeHistory userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
