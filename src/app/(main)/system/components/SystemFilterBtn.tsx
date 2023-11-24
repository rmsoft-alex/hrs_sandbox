"use client";
import React from "react";
import TextInputField from "./TextInputField";
import { Button } from "@/components/ui/button";
import {
  useSystemFieldState,
  useSystemFilterAction,
} from "../store/useSystemFilterStore";
import { RefreshCcw, RotateCcw } from "lucide-react";

interface SystemFilterBtnProps {
  resetPageIndex: () => void;
}

export default function SystemFilterBtn({
  resetPageIndex,
}: SystemFilterBtnProps) {
  const { systemCode, systemName, systemDomain } = useSystemFieldState();
  const { reset } = useSystemFilterAction();
  const isSelected = !!(systemCode[0] || systemName[0] || systemDomain[0]);

  return (
    <div className="flex items-center gap-2 text-slate-800">
      <div className="flex flex-wrap gap-2">
        <TextInputField resetPageIndex={resetPageIndex} />
        {isSelected && (
          <Button
            className="w-[84px] h-9 px-[13px] py-2 bg-white rounded-md shadow border border-slate-300 justify-start items-center gap-[5px] inline-flex"
            variant={"outline"}
            type="button"
            onClick={reset}
          >
            초기화
            <RefreshCcw size={14} className="text-slate-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
