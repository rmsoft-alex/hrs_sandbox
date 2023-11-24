import { postSyncList } from "@/api/sync.api";
import { ConfirmModal } from "@/components/common/modals/confirm/confirmModal";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/modals/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

function SyncModal() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "sync";
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => postSyncList(data),
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ["sync"] });
      if (responseData === 1) {
        toast({
          description: "동기화 등록에 완료했습니다.",
          duration: 3000,
        });
        onClose();
      } else if (responseData === 0) {
        toast({
          description: "동기화 등록에 실패했습니다.",
          variant: "destructive",
          duration: 3000,
        });
        onClose();
      }
    },
    //토스트를 사용할지 아직 미정.
    onError: (e) => {
      toast({
        description: "서버에 이슈가 발생했습니다.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // 확인 버튼 클릭 시 수행되는 함수
  const onConfirmButton = async () => {
    mutation.mutate(data);
  };

  // 취소 버튼 클릭 시 수행되는 함수
  const onCancleButton = () => {
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isModalOpen}
      onClose={onCancleButton}
      onConfirm={onConfirmButton}
      loading={loading}
      title="동기화"
      description="동기화 하시겠습니까?"
    />
  );
}

export default SyncModal;
