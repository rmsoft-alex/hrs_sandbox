import { postComplateRestructure, postTempData } from "@/api/restructure.api";
import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/modals/useModal";
import React, { useState } from "react";
import {
  useIsSaved,
  useStep,
  useTempStorage,
} from "../../store/useRestructureStore";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import useSaveTempData from "../../hooks/useSaveTempData";

const RestructureSubmitModal = () => {
  const { toast } = useToast();
  const {
    isOpen,
    onClose,
    type,
    data: { refresh },
  } = useModal();

  const [textInput, setTextInput] = useState("");

  const step = useStep();
  const isSaved = useIsSaved();
  const tempStorage = useTempStorage();
  const isModalOpen = isOpen && type === "restructure";

  const { mutate: complateMutate } = useMutation({
    mutationFn: () => postComplateRestructure(textInput),
    onError() {
      toast({
        title: "최종 반영에 실패하였습니다.",
        duration: 3000,
      });
    },
    onSuccess() {
      toast({ title: "최종 반영이 완료되었습니다.", duration: 3000 });
      setTextInput("");
      refresh();
      onClose();
    },
  });

  const { mutate: tempMutate } = useSaveTempData(
    () => complateMutate(), //onSuccess
    () =>
      toast({
        title: "데이터 저장에 실패하였습니다.",
        duration: 3000,
      }) // onError
  );

  const handleSaveTempData = () => {
    if (!tempStorage) return;
    if (isSaved?.dept && isSaved?.user) return complateMutate();
    if ((step === "Creation" || step === "Abolition") && !isSaved?.dept) {
      tempMutate("DEPARTMENT", tempStorage);
    } else if (step === "TransLocation" && !isSaved?.user) {
      tempMutate("USER", tempStorage);
    }
  };

  const handleCloseModal = () => {
    setTextInput("");
    onClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="부서 개편을 완료합니다"
      description="변경 사항을 최종 반영하시겠습니까? "
    >
      <div>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="개편 사유를 입력해주세요(선택)"
          className="resize-none placeholder:text-sm w-full border p-2 rounded-sm outline-slate-600"
          maxLength={1500}
        />
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button variant="outline" onClick={handleCloseModal}>
            취소
          </Button>
          <Button variant="orange" onClick={handleSaveTempData}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RestructureSubmitModal;
