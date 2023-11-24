import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDegree, putDegree } from "@/api/log.api";
import useDegree from "../hook/useDegree";
import { Modal } from "@/components/common/modals/confirm/defaultModal";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  isResetModalOpen: boolean;
  setIsResetModalOpen: (value: boolean) => void;
  isFirstAssignModalOpen: boolean;
  setIsFirstAssignModalOpen: (value: boolean) => void;
  isSecondAssignModalOpen: boolean;
  setIsSecondAssignModalOpen: (value: boolean) => void;
  selectedLogs: Array<number>;
  setSelectedLogs: (value: Array<number>) => void;
  isSelectedResetModalOpen: boolean;
  setIsSelectedResetModalOpen: (value: boolean) => void;
};

export default function Modals({
  isResetModalOpen,
  setIsResetModalOpen,
  isFirstAssignModalOpen,
  setIsFirstAssignModalOpen,
  isSecondAssignModalOpen,
  setIsSecondAssignModalOpen,
  selectedLogs,
  setSelectedLogs,
  isSelectedResetModalOpen,
  setIsSelectedResetModalOpen,
}: Props) {
  const [selected, setSelected] = useState("");
  return (
    <>
      {isResetModalOpen && (
        <ResetModal
          isResetModalOpen={isResetModalOpen}
          setIsResetModalOpen={setIsResetModalOpen}
        />
      )}
      {isFirstAssignModalOpen && (
        <FirstAssignModal
          isFirstAssignModalOpen={isFirstAssignModalOpen}
          setIsFirstAssignModalOpen={setIsFirstAssignModalOpen}
          selected={selected}
          setSelected={setSelected}
          setIsSecondAssignModalOpen={setIsSecondAssignModalOpen}
        />
      )}
      {isSelectedResetModalOpen && (
        <SelectedResetModal
          isSelectedResetModalOpen={isSelectedResetModalOpen}
          setIsSelectedResetModalOpen={setIsSelectedResetModalOpen}
          selectedLogs={selectedLogs}
          setSelectedLogs={setSelectedLogs}
        />
      )}
      {isSecondAssignModalOpen && (
        <SecondAssignModal
          isSecondAssignModalOpen={isSecondAssignModalOpen}
          setIsSecondAssignModalOpen={setIsSecondAssignModalOpen}
          selectedLogs={selectedLogs}
          setSelectedLogs={setSelectedLogs}
          selected={selected}
        />
      )}
    </>
  );
}

function ResetModal({
  isResetModalOpen,
  setIsResetModalOpen,
}: {
  isResetModalOpen: boolean;
  setIsResetModalOpen: (value: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { degree } = useDegree();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (reqDegree: {
      degree: string;
      logInfoIdxList: Array<number> | [];
    }) =>
      putDegree(reqDegree)
        .then((res) => {
          if (res.code === 100) {
            toast({
              title: "차수 초기화",
              description: "성공적으로 초기화되었습니다.",
              duration: 3000,
            });
          }
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "차수 초기화",
            description: "오류가 발생했습니다. 다시 시도해주십시오.",
            duration: 3000,
          });
        }),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ["logs"],
        type: "active",
        exact: true,
      }),
  });

  return (
    <Modal
      title="차수 초기화"
      description={`마지막 차수 
              ${degree?.slice(0, 4)}-${degree?.slice(
        4
      )}에 등록된 모든 이력의 차수를 초기화하시겠습니까?`}
      isOpen={isResetModalOpen}
      onClose={() => setIsResetModalOpen(false)}
    >
      <div className="min-w-[290px] flex justify-end gap-3">
        <Button variant={"outline"} onClick={() => setIsResetModalOpen(false)}>
          취소
        </Button>
        <Button
          variant={"default"}
          onClick={() => {
            if (degree) {
              const reqDegree = {
                degree,
                logInfoIdxList: [],
              };
              mutate(reqDegree);
              setIsResetModalOpen(false);
            }
          }}
          disabled={isPending}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}

function FirstAssignModal({
  isFirstAssignModalOpen,
  setIsFirstAssignModalOpen,
  selected,
  setSelected,
  setIsSecondAssignModalOpen,
}: {
  isFirstAssignModalOpen: boolean;
  setIsFirstAssignModalOpen: (value: boolean) => void;
  selected: string;
  setSelected: (value: string) => void;
  setIsSecondAssignModalOpen: (value: boolean) => void;
}) {
  const { degree } = useDegree();

  const thisYear = new Date().getFullYear().toString();
  const nextYear = (+new Date().getFullYear() + 1).toString();
  const currentDegreeYear = degree ? degree.toString().slice(0, 4) : null;
  const currentDegreeNum = degree ? degree.toString().slice(4) : null;

  const currentDegree = degree;
  const nextDegree = currentDegree
    ? currentDegreeYear + (+currentDegreeNum! + 1).toString().padStart(2, "0")
    : thisYear + "01";
  const nextYearDegree = degree
    ? (+currentDegreeYear! + 1).toString() + currentDegreeNum!
    : nextYear + "01";

  return (
    <Modal
      title="차수 등록"
      description="차수를 선택해주십시오."
      isOpen={isFirstAssignModalOpen}
      onClose={() => setIsFirstAssignModalOpen(false)}
    >
      <div className="min-w-[290px]">
        <RadioGroup
          className="flex flex-col gap-3 px-2 py-6"
          onValueChange={setSelected}
        >
          {degree && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={currentDegree!} id={currentDegree!} />
              <Label
                htmlFor={currentDegree!}
                className={selected === currentDegree ? "text-orange-500" : ""}
              >
                현재 차수 {"("}
                {currentDegree?.slice(0, 4)}-{currentDegree?.slice(4)}
                {")"}
              </Label>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={nextDegree} id={nextDegree} />
            <Label
              htmlFor={nextDegree}
              className={selected === nextDegree ? "text-orange-500" : ""}
            >
              다음 차수 {"("}
              {nextDegree?.slice(0, 4)}-{nextDegree?.slice(4)}
              {")"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={nextYearDegree} id={nextYearDegree} />
            <Label
              htmlFor={nextYearDegree}
              className={selected === nextYearDegree ? "text-orange-500" : ""}
            >
              다음 연도 {"("}
              {nextYearDegree?.slice(0, 4)}-{nextYearDegree?.slice(4)}
              {")"}
            </Label>
          </div>
        </RadioGroup>
        <div className="flex justify-end gap-3">
          <Button
            variant={"outline"}
            onClick={() => setIsFirstAssignModalOpen(false)}
          >
            취소
          </Button>
          <Button
            className="bg-primary text-white"
            variant={"outline"}
            onClick={() => {
              setIsFirstAssignModalOpen(false);
              setIsSecondAssignModalOpen(true);
            }}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function SelectedResetModal({
  isSelectedResetModalOpen,
  setIsSelectedResetModalOpen,
  selectedLogs,
  setSelectedLogs,
}: {
  isSelectedResetModalOpen: boolean;
  setIsSelectedResetModalOpen: (value: boolean) => void;
  selectedLogs: Array<number>;
  setSelectedLogs: (value: Array<number>) => void;
}) {
  const queryClient = useQueryClient();
  const { degree } = useDegree();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (reqDegree: {
      degree: string;
      logInfoIdxList: Array<number> | [];
    }) =>
      putDegree(reqDegree)
        .then((res) => {
          if (res.code === 100) {
            toast({
              title: "차수 초기화",
              description: "성공적으로 초기화되었습니다.",
              duration: 3000,
            });
            setSelectedLogs([]);
          }
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "차수 초기화",
            description: "오류가 발생했습니다. 다시 시도해주십시오.",
            duration: 3000,
          });
        }),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ["logs"],
        type: "active",
        exact: true,
      }),
  });

  return (
    <Modal
      title="차수 초기화"
      description="선택한 이력의 차수를 초기화하시겠습니까?"
      isOpen={isSelectedResetModalOpen}
      onClose={() => setIsSelectedResetModalOpen(false)}
    >
      <div className="min-w-[290px] flex justify-end gap-3">
        <Button
          variant={"outline"}
          onClick={() => setIsSelectedResetModalOpen(false)}
        >
          취소
        </Button>
        <Button
          variant={"default"}
          onClick={() => {
            if (degree) {
              const reqDegree = {
                degree,
                logInfoIdxList: selectedLogs,
              };
              mutate(reqDegree);
              setIsSelectedResetModalOpen(false);
            }
          }}
          disabled={isPending}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}

function SecondAssignModal({
  isSecondAssignModalOpen,
  setIsSecondAssignModalOpen,
  selectedLogs,
  setSelectedLogs,
  selected,
}: {
  isSecondAssignModalOpen: boolean;
  setIsSecondAssignModalOpen: (value: boolean) => void;
  selectedLogs: Array<number>;
  setSelectedLogs: (value: Array<number>) => void;
  selected: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { degree } = useDegree();

  const { mutate, isPending } = useMutation({
    mutationFn: (reqDegree: {
      degree: string;
      logInfoIdxList: Array<number> | [];
    }) =>
      postDegree(reqDegree)
        .then((res) => {
          if (res.code === 100) {
            toast({
              title: "차수 등록",
              description: "성공적으로 등록되었습니다.",
              duration: 3000,
            });
            setSelectedLogs([]);
          }
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "차수 등록",
            description: "오류가 발생했습니다. 다시 시도해주십시오.",
            duration: 3000,
          });
        }),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ["logs"],
        type: "active",
        exact: true,
      }),
  });

  return (
    <Modal
      title="차수 등록"
      description={`선택한 차수(${selected.slice(0, 4)}-${selected.slice(
        4
      )})를 등록하시겠습니까?`}
      isOpen={isSecondAssignModalOpen}
      onClose={() => setIsSecondAssignModalOpen(false)}
    >
      <div className="min-w-[290px] flex justify-end gap-3">
        <Button
          variant={"outline"}
          onClick={() => setIsSecondAssignModalOpen(false)}
        >
          취소
        </Button>
        <Button
          variant={"default"}
          onClick={() => {
            if (degree) {
              const reqDegree = {
                degree: selected,
                logInfoIdxList: selectedLogs,
              };
              mutate(reqDegree);
              setIsSecondAssignModalOpen(false);
            }
          }}
          disabled={isPending}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
}
