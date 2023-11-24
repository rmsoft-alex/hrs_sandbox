"use client";

import { useEffect, useState } from "react";
import RestructureSubmitModal from "@/app/(main)/restructure/components/TopBar/SubmitModal";
import DeptModal from "@/app/(main)/department/components/DeptModal";
import SyncModal from "@/app/(main)/sync/components/SyncModal";
//테스트중
import SystemEditModal from "@/app/(main)/system/edit/components/SystemEditModal";
import SystemAddModal from "@/app/(main)/system/register/components/SystemAddModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SyncModal />
      <RestructureSubmitModal />
      <DeptModal />
      <SystemEditModal />
      <SystemAddModal />
    </>
  );
};
