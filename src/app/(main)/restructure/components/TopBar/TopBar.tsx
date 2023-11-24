import React, { useState } from "react";
import { StepState } from "../../types";
import { Button } from "@/components/ui/button";
import {
  useIsSaved,
  useMemberGroup,
  useRestructureActions,
  useStep,
  useTempStorage,
  useTree,
} from "../../store/useRestructureStore";
import { Download, RefreshCcw, Upload } from "lucide-react";
import { ConfirmModal } from "@/components/common/modals/confirm/confirmModal";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/modals/useModal";
import { postResetTemsData } from "@/api/restructure.api";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import useSaveTempData from "../../hooks/useSaveTempData";

interface Props {
  refresh: () => void;
}

const TopBar = ({ refresh }: Props) => {
  const { toast } = useToast();
  const { onOpen } = useModal();

  const isSaved = useIsSaved();
  const step = useStep();
  const tree = useTree();
  const memberGroup = useMemberGroup();
  const tempStorage = useTempStorage();

  const { mutate: tempMutate } = useSaveTempData(refresh);
  const { setStep } = useRestructureActions();

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: resetMutate } = useMutation({
    mutationFn: postResetTemsData,
    onSuccess() {
      setResetModalOpen(false);
      refresh();
      toast({
        title: "초기화가 완료되었습니다",
      });
    },
    onError() {
      toast({
        title: "초기화를 완료하지 못했습니다.",
      });
    },
  });

  const tabStyle = (state: StepState) => ({
    tab: `border-b border-b-[2px] rounded-none p-2 text-sm hover:bg-white ${
      step === state
        ? "text-orange-500 border-b-orange-500 font-semibold hover:text-orange-500"
        : ""
    }`,
  });

  const topButtonStyle = "w-3 h-3 ml-1";

  // 탭이동
  const handleMoveTab = (targetTab: StepState) => {
    handleSaveTempData();
    setStep(targetTab);
  };

  // 이력 초기화
  const handleResetHistory = async () => {
    setLoading(false);
    resetMutate();
  };

  //엑셀다운로드
  const handleExelDownload = () => {
    toast({
      title: "준비중입니다",
      variant: "destructive",
    });
  };

  //엑셀업로드
  const handleExelUpload = () => {
    toast({
      title: "준비중입니다",
      variant: "destructive",
    });
  };

  const handleClickTempSave = () => {
    if (isSaved?.dept && isSaved?.user) {
      return toast({
        title: "변경사항이 없습니다.",
      });
    } else {
      handleSaveTempData();
    }
  };

  // 임시저장
  const handleSaveTempData = () => {
    if (!tempStorage) return;
    if (isSaved?.dept && isSaved?.user) return;
    if ((step === "Creation" || step === "Abolition") && !isSaved?.dept) {
      tempMutate("DEPARTMENT", tempStorage);
    } else if (step === "TransLocation" && !isSaved?.user) {
      tempMutate("USER", tempStorage);
    }
  };

  // 최종 반영
  const handleClickComplrateRestructure = () => {
    // 폐지 된 부서에 남아있는 구성원이 있다면 최종 반영되지 않음
    const deactivationDeps = tree?.filter(
      (node) => node.data?.activeType === "N"
    );
    if (
      memberGroup?.find((member) =>
        deactivationDeps?.some((dep) => dep.id === member.departmentTempIdx)
      )
    ) {
      toast({
        title: "폐지 된 부서에 남아있는 구성원이 있습니다",
        description:
          "구성원 관리 탭에서 폐지 된 부서의 구성원을 모두 이동시켜 주십시오.",
        variant: "destructive",
      });
    } else {
      onOpen("restructure", { refresh });
    }
  };

  return (
    <div className="flex justify-between items-end my-8">
      <div>
        <Button
          className={tabStyle("Creation").tab}
          variant={"ghost"}
          onClick={() => handleMoveTab("Creation")}
        >
          부서 생성
        </Button>
        <Button
          className={tabStyle("Abolition").tab}
          variant={"ghost"}
          onClick={() => handleMoveTab("Abolition")}
        >
          부서 폐지
        </Button>
        <Button
          className={tabStyle("TransLocation").tab}
          variant={"ghost"}
          onClick={() => handleMoveTab("TransLocation")}
        >
          구성원 관리
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant={"outline"} onClick={() => setResetModalOpen(true)}>
          초기화
          <RefreshCcw
            className={cn(`${topButtonStyle} text-slate-800`)}
            strokeWidth={2}
          />
        </Button>
        <Button variant={"outline"} onClick={handleExelDownload}>
          EXEL
          <Download
            className={cn(`${topButtonStyle} text-green-700`)}
            strokeWidth={2}
          />
        </Button>
        <div>
          <label
            htmlFor="exel"
            className="flex py-2 px-4 text-sm items-center border rounded-md h-full cursor-pointer hover:bg-slate-50 transition-colors"
          >
            EXEL
            <Upload
              className={cn(`${topButtonStyle} text-green-700`)}
              strokeWidth={2}
            />
          </label>
          <input
            type="file"
            className="hidden"
            id="exel"
            accept=".xls,.xlsx"
            onChange={handleExelUpload}
          />
        </div>
        <Button
          variant={"outline"}
          className="bg-slate-50"
          onClick={handleClickTempSave}
        >
          임시저장
        </Button>
        <Button onClick={handleClickComplrateRestructure}>최종반영</Button>
      </div>
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetHistory}
        loading={loading}
        title="작업 이력을 초기화합니다."
        description="반영되지 않은 모든 작업 이력이 삭제됩니다. 계속 진행하시겠습니까?"
      />
    </div>
  );
};

export default TopBar;
