// "use client";
import React from "react";
import {
  useUserFilteringState,
  useUsrFilteringAction,
} from "../store/useUserFilterStore";
import TextInputFilteringField from "./TextInputFilteringField";
import ComboBoxFilteringField from "./ComboBoxFilteringField";
import DatePickerFilteringField from "./DatePickerFilteringField";
import SelectFilteringField from "./SelectFilteringField";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type Props = {
  resetPageIndex: () => void;
};

export default function UserFilteringBtns({ resetPageIndex }: Props) {
  const { name, userId, departmentNameList, activeStatus, regDate } =
    useUserFilteringState();
  const { reset } = useUsrFilteringAction();
  const isSelected = !!(
    name[0] ||
    userId[0] ||
    departmentNameList[0] ||
    activeStatus[0] ||
    regDate?.from ||
    regDate?.to
  );

  return (
    <div className="flex items-center gap-2 text-slate-800">
      <div className="max-w-[1050px] min-w-[600px] flex flex-wrap items-center gap-2">
        <TextInputFilteringField resetPageIndex={resetPageIndex} />
        <SelectFilteringField resetPageIndex={resetPageIndex} />
        <ComboBoxFilteringField resetPageIndex={resetPageIndex} />
        <DatePickerFilteringField resetPageIndex={resetPageIndex} />
        {isSelected && (
          <Button
            className="flex gap-1 border-slate-300"
            variant={"outline"}
            onClick={() => {
              reset();
              resetPageIndex();
            }}
          >
            초기화 <RefreshCcw size={14} className="text-slate-400" />
          </Button>
        )}
      </div>
    </div>
  );
}
