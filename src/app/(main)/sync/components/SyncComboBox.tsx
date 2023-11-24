import React, { useState } from "react";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpenState } from "../type";
import { useSyncFilterStore, useSyncStatusAction } from "../store/useSyncStore";
import SearchSelect from "@/components/common/search/SearchSelect";
import SearchInput from "@/components/common/search/SearchInput";
import { z } from "zod";
import SearchCalendar from "@/components/common/search/SearchCalendar";
import Image from "next/image";
import { useSyncForm } from "../page";

interface SyncComboBoxProps {
  isSelected: boolean;
  resetPageIndex: () => void;
}

const options = [
  { value: "Y", label: "완료" },
  { value: "N", label: "실패" },
];

const SyncComboBox = ({ isSelected, resetPageIndex }: SyncComboBoxProps) => {
  //모달관리 state
  const [open, setOpen] = useState<OpenState>({
    statusOpen: false,
    regByOpen: false,
    startDateOpen: false,
    endDateOpen: false,
  });

  const { success, regBy, regDate } = useSyncFilterStore();
  const { regByFormSchema, regByForm } = useSyncForm();

  const { setSuccess, setRegBy, setRegDate, deleteStatus, deleteRegBy, reset } =
    useSyncStatusAction();

  const onStatusSelect = (value: string) => {
    setSuccess(value);
    setOpen({ ...open, statusOpen: false });
    resetPageIndex();
  };

  const onRegByFormSubmit = (value: z.infer<typeof regByFormSchema>) => {
    setRegBy(value.regBy.trim());
    setOpen({ ...open, regByOpen: false });
    resetPageIndex();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        regByForm.handleSubmit(onRegByFormSubmit);
      }}
      className="flex items-center flex-wrap gap-[0.625rem]"
    >
      {/* 상태 */}
      <div className="flex items-center">
        <SearchSelect
          icon={
            <Image
              src="/images/signalWifi.svg"
              alt=""
              width={18}
              height={18}
              color="#94A3B8"
            />
          }
          title="상태"
          name={success}
          open={open.statusOpen}
          onOpenChange={(newState: boolean) =>
            setOpen({ ...open, statusOpen: newState })
          }
          onDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            deleteStatus(success!);
            resetPageIndex();
            setOpen({ ...open, statusOpen: false });
          }}
          onSelect={(value: string) => onStatusSelect(value)}
          options={options}
        />
      </div>

      {/* 등록자 */}
      <div className="flex items-center">
        <SearchInput
          icon={
            <Image
              src="/images/toc.svg"
              alt=""
              width={22}
              height={22}
              color="#94A3B8"
            />
          }
          title="등록자"
          name="regBy"
          value={regBy}
          open={open.regByOpen}
          onOpenChange={(newState: boolean) =>
            setOpen({ ...open, regByOpen: newState })
          }
          onDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            deleteRegBy();
            resetPageIndex();
            setOpen({ ...open, regByOpen: false });
            regByForm.reset();
          }}
          form={regByForm}
          onSubmit={regByForm.handleSubmit(onRegByFormSubmit)}
        />
      </div>

      {/* 등록일 */}
      <div className="flex items-center">
        <SearchCalendar
          title="등록일"
          regDate={regDate}
          fromOpen={open.startDateOpen}
          fromOpenChange={(newState: boolean) => {
            setOpen({ ...open, startDateOpen: newState });
          }}
          onFromDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setRegDate("", "from");
            resetPageIndex();
            setOpen({ ...open, startDateOpen: false });
          }}
          onFromSelect={(value: Date | undefined) => {
            setRegDate(value, "from");
            resetPageIndex();
            setOpen({ ...open, startDateOpen: false });
          }}
          toOpen={open.endDateOpen}
          toOpenChange={(newState: boolean) => {
            setOpen({ ...open, endDateOpen: newState });
          }}
          onToDeleteButton={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setRegDate("", "to");
            resetPageIndex();
            setOpen({ ...open, endDateOpen: false });
          }}
          onToSelect={(value: Date | undefined) => {
            setRegDate(value, "to");
            resetPageIndex();
            setOpen({ ...open, endDateOpen: false });
          }}
        />
      </div>

      <div>
        {isSelected ? (
          <Button
            className="w-[84px] h-9 px-[13px] py-2 bg-white rounded-md shadow border border-slate-300 justify-start items-center gap-[5px] inline-flex"
            variant={"outline"}
            type="button"
            onClick={() => {
              reset();
              regByForm.reset();
              resetPageIndex();
            }}
          >
            초기화
            <RefreshCcw size={14} className="text-slate-500" />
          </Button>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
};

export default SyncComboBox;
