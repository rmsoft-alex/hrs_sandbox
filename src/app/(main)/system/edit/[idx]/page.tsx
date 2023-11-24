"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SystemForm from "@/components/common/system/systemForm";
import { useQuery } from "@tanstack/react-query";
import { getSystemData } from "@/api/system.api";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { useToast } from "@/components/ui/use-toast";

const SystemEditPage = () => {
  const params = useParams();
  const systemIdx = useMemo(
    () => parseInt(params.idx as string, 10),
    [params.idx]
  );
  const { toast } = useToast();
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: [systemIdx],
    queryFn: () => getSystemData(systemIdx),
    enabled: !!systemIdx,
    // onSuccess: () => {
    //   setIsLoading(false);
    // },
    // isError: () => {
    //   toast({
    //     description: "잘못된 접근입니다.",
    //     variant: "destructive",
    //     duration: 3000,
    //   });
    //   router.push("/system");
    // },
  });

  useEffect(() => {
    sessionStorage.setItem("systemIdx", JSON.stringify(systemIdx));
  }, [systemIdx]);

  useEffect(() => {
    if (isNaN(systemIdx)) {
      toast({
        description: "잘못된 접근입니다.",
        variant: "destructive",
        duration: 3000,
      });
      router.push(`/system`);
    }
  }, [router, systemIdx, toast]);

  return (
    <div className="flex flex-1 flex-col gap-8 h-full px-10 py-8">
      <LocationHeader
        firstTitle="시스템 조회"
        firstPath="/system"
        secondTitle="시스템 수정"
      />
      <div className="w-[37.5rem]">
        {isPending ? (
          <div className="pt-[12.5rem] text-center">로딩중입니다.</div>
        ) : (
          <SystemForm
            systemName={data?.systemName}
            systemDomain={data?.systemDomain}
            active={data?.active}
            description={data?.description}
            okButton={"수정"}
            cancelButton={"취소"}
            modalName={"systemEdit"}
            readOnlyYN={false}
          />
        )}
      </div>
    </div>
  );
};

export default SystemEditPage;
