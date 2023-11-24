import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modals/useModal";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { putSystemEdit } from "@/api/system.api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const SystemEditModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "systemEdit";
  const { toast } = useToast();
  const router = useRouter();
  const sessionData = sessionStorage.getItem("systemData");
  const systemAddData =
    sessionData !== null ? JSON.parse(sessionData) : undefined;

  const sessionSystemIdx = sessionStorage.getItem("systemIdx");
  const systemIdx = Number(sessionSystemIdx);

  const mutation = useMutation({
    mutationFn: ({
      systemIdx,
      systemName,
      systemDomain,
      active,
      description,
    }: {
      systemIdx: number;
      systemName: string;
      systemDomain: string;
      active: string;
      description: string;
    }) =>
      putSystemEdit({
        systemIdx,
        systemName,
        systemDomain,
        active,
        description,
      }),
    onSuccess: (result) => {
      if (result.code === 100) {
        onClose();
        toast({
          description: "수정성공했습니다!",
          duration: 3000,
        });
        router.push(`/system/${systemIdx}`);
      }
    },
    onError: (error) => {
      onClose();
      toast({
        description: "시스템 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  console.log("systemIdx", systemIdx);
  const success = () => {
    if (isNaN(systemIdx)) {
      toast({
        description: "잘못된 접근입니다. 새로고침 후 다시 시도해 주세요.",
        duration: 3000,
      });
      router.push(`/system`);
    }
    mutation.mutate({
      systemName: systemAddData?.systemName?.trim(),
      systemDomain: systemAddData?.systemDomain.trim(),
      active: systemAddData?.active,
      description: systemAddData?.description,
      systemIdx: systemIdx,
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title="저장"
      description="변경 사항을 저장하시겠습니까?"
    >
      <div>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={success}>확인</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SystemEditModal;
