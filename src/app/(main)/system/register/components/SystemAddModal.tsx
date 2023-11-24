import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modals/useModal";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { postSystemAdd } from "@/api/system.api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const SystemAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "systemAdd";
  const { toast } = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: ({
      systemName,
      systemDomain,
      active,
      description,
    }: {
      systemName: string;
      systemDomain: string;
      active: string;
      description: string;
    }) => postSystemAdd({ systemName, systemDomain, active, description }),
    onSuccess: (result) => {
      if (result.code === 100) {
        onClose();
        toast({
          description: "저장 성공했습니다.",
          duration: 3000,
        });
        router.push("/system");
      }
    },
    onError: (error) => {
      onClose();
      toast({
        description: "시스템 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const sessionData = sessionStorage.getItem("systemData");
  const systemAddData =
    sessionData !== null ? JSON.parse(sessionData) : undefined;

  const success = () => {
    mutation.mutate({
      systemName: systemAddData?.systemName?.trim(),
      systemDomain: systemAddData?.systemDomain?.trim(),
      active: systemAddData?.active,
      description: systemAddData?.description,
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title="등록"
      description="새로운 시스템을 등록하시겠습니까?"
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

export default SystemAddModal;
