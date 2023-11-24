"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/common/modals/confirm/defaultModal";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleConfirmClick = async () => {
    if (confirmRef.current) {
      confirmRef.current.disabled = true;
      if (confirmRef.current.disabled) {
        onConfirm();
      }
    } else {
      onClose();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button
          ref={confirmRef}
          disabled={loading}
          variant="orange"
          onClick={handleConfirmClick}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};
