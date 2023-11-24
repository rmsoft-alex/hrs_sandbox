"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SystemForm from "@/components/common/system/systemForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSystem, getSystemData } from "@/api/system.api";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { Button } from "@/components/ui/button";

const SystemDetailPage = () => {
  const params = useParams();
  const systemIdx = useMemo(
    () => parseInt(params.idx as string, 10),
    [params.idx]
  );
  const { toast } = useToast();
  const router = useRouter();
  //삭제재확인모달
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: [systemIdx],
    queryFn: () => getSystemData(systemIdx),
    enabled: !!systemIdx,
  });

  useEffect(() => {
    sessionStorage.setItem("systemIdx", JSON.stringify(systemIdx));
  }, [systemIdx]);

  const mutation = useMutation({
    mutationFn: ({ reqSystemIdx }: { reqSystemIdx: number[] }) =>
      deleteSystem(reqSystemIdx),
    onSuccess: (res) => {
      if (res.code === 100) {
        queryClient.invalidateQueries({ queryKey: ["system"] });
        router.push("/system");
        toast({
          title: "삭제 되었습니다.",
          duration: 3000, // 3초 동안 표시
        });
        setDeleteConfirmModalOpen(false);
      }
    },
    onError: (error) => {
      toast({
        description: "시스템 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
        duration: 3000,
      });
      setDeleteConfirmModalOpen(false);
    },
  });

  const onDeleteConfirm = () => {
    if (systemIdx) {
      mutation.mutate({
        reqSystemIdx: [systemIdx],
      });
    }
  };

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
    <>
      <div className="flex flex-1 flex-col gap-8 h-full px-10 py-8">
        <LocationHeader
          firstTitle="시스템 조회"
          firstPath="/system"
          secondTitle="시스템 상세"
        />
        <div className="w-[37.5rem]">
          {isPending ? (
            <div className="py-[12.5rem] text-center">로딩중입니다.</div>
          ) : (
            <SystemForm
              systemName={data?.systemName}
              systemDomain={data?.systemDomain}
              active={data?.active}
              description={data?.description}
              okButton=""
              modalName="systemAdd"
              readOnlyYN={true}
              cancelButton=""
            />
          )}
          <div className="flex align-center justify-end text-center">
            <Link href="/system">
              <div className="w-[65px] h-[36px] align-top leading-[35px] inline-block mr-2 text-sm rounded-md border border-slate-300 cursor-pointer">
                목록
              </div>
            </Link>
            <div
              className="w-[65px] h-[36px] align-top leading-[35px] inline-block mr-2 text-sm rounded-md border border-slate-300 cursor-pointer"
              onClick={() => setDeleteConfirmModalOpen(true)}
            >
              삭제
            </div>
            <Link href={`/system/edit/${systemIdx}`}>
              <div className="w-[65px] h-[36px] align-top leading-[35px] inline-block text-sm text-white bg-orange-500 rounded-md">
                수정
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Modal
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
        title="삭제"
        description="삭제하시겠습니까?"
      >
        <div>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={onDeleteConfirm}>확인</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SystemDetailPage;
