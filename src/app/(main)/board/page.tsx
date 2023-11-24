"use client";

import { ConfirmModal } from "@/components/common/modals/confirm/confirmModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const BoardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = () => {
    console.log("Hi");
    setIsOpen(false);
    setLoading(false);
  };

  return (
    <>
      <div>통합 게시판</div>
      <Button onClick={() => setIsOpen(true)}>Confirm Modal</Button>
      <ConfirmModal
        isOpen={isOpen}
        loading={loading}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirm}
        title="Hi Title"
        description="Hi Description"
      />
    </>
  );
};

export default BoardPage;
