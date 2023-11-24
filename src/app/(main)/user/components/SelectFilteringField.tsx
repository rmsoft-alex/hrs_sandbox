"use client";
import React, { useState } from "react";
import {
  useSelectFieldState,
  useUsrFilteringAction,
} from "../store/useUserFilterStore";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import { Command, CommandItem } from "@/components/ui/command";

type Props = {
  resetPageIndex: () => void;
};

export default function SelectFilteringField({ resetPageIndex }: Props) {
  const { activeStatus } = useSelectFieldState();
  const { setActiveStatus, deleteActiveStatus } = useUsrFilteringAction();
  const [isActiveStatusFieldOpen, setIsActiveStatusFieldOpen] = useState(false);

  const onActiveStatusSelect = (value: string) => {
    setActiveStatus(value);
    setIsActiveStatusFieldOpen(false);
    resetPageIndex();
  };

  return (
    <div>
      <Popover
        open={isActiveStatusFieldOpen}
        onOpenChange={setIsActiveStatusFieldOpen}
      >
        <div className="flex items-center">
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 border border-slate-300 rounded-md hover:bg-white focus-visible:ring-slate-400 shadow h-9 px-4 text-sm font-medium cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g mask="url(#mask0_1593_5496)">
                  <path
                    d="M5.33324 9.33356C5.52213 9.33356 5.68046 9.26967 5.80824 9.14189C5.93601 9.01412 5.9999 8.85578 5.9999 8.66689C5.9999 8.47801 5.93601 8.31967 5.80824 8.19189C5.68046 8.06412 5.52213 8.00023 5.33324 8.00023C5.14435 8.00023 4.98601 8.06412 4.85824 8.19189C4.73046 8.31967 4.66657 8.47801 4.66657 8.66689C4.66657 8.85578 4.73046 9.01412 4.85824 9.14189C4.98601 9.26967 5.14435 9.33356 5.33324 9.33356ZM7.9999 9.33356C8.18879 9.33356 8.34713 9.26967 8.4749 9.14189C8.60268 9.01412 8.66657 8.85578 8.66657 8.66689C8.66657 8.47801 8.60268 8.31967 8.4749 8.19189C8.34713 8.06412 8.18879 8.00023 7.9999 8.00023C7.81101 8.00023 7.65268 8.06412 7.5249 8.19189C7.39713 8.31967 7.33324 8.47801 7.33324 8.66689C7.33324 8.85578 7.39713 9.01412 7.5249 9.14189C7.65268 9.26967 7.81101 9.33356 7.9999 9.33356ZM10.6666 9.33356C10.8555 9.33356 11.0138 9.26967 11.1416 9.14189C11.2693 9.01412 11.3332 8.85578 11.3332 8.66689C11.3332 8.47801 11.2693 8.31967 11.1416 8.19189C11.0138 8.06412 10.8555 8.00023 10.6666 8.00023C10.4777 8.00023 10.3193 8.06412 10.1916 8.19189C10.0638 8.31967 9.9999 8.47801 9.9999 8.66689C9.9999 8.85578 10.0638 9.01412 10.1916 9.14189C10.3193 9.26967 10.4777 9.33356 10.6666 9.33356ZM7.9999 14.6669C7.16657 14.6669 6.38601 14.5086 5.65824 14.1919C4.93046 13.8752 4.29712 13.4474 3.75824 12.9086C3.21935 12.3697 2.79157 11.7363 2.4749 11.0086C2.15824 10.2808 1.9999 9.50023 1.9999 8.66689C1.9999 7.83356 2.15824 7.05301 2.4749 6.32523C2.79157 5.59745 3.21935 4.96412 3.75824 4.42523C4.29712 3.88634 4.93046 3.45856 5.65824 3.14189C6.38601 2.82523 7.16657 2.66689 7.9999 2.66689C8.83324 2.66689 9.61379 2.82523 10.3416 3.14189C11.0693 3.45856 11.7027 3.88634 12.2416 4.42523C12.7805 4.96412 13.2082 5.59745 13.5249 6.32523C13.8416 7.05301 13.9999 7.83356 13.9999 8.66689C13.9999 9.50023 13.8416 10.2808 13.5249 11.0086C13.2082 11.7363 12.7805 12.3697 12.2416 12.9086C11.7027 13.4474 11.0693 13.8752 10.3416 14.1919C9.61379 14.5086 8.83324 14.6669 7.9999 14.6669ZM3.73324 1.56689L4.66657 2.50023L1.83324 5.33356L0.899902 4.40023L3.73324 1.56689ZM12.2666 1.56689L15.0999 4.40023L14.1666 5.33356L11.3332 2.50023L12.2666 1.56689ZM7.9999 13.3336C9.2999 13.3336 10.4027 12.8808 11.3082 11.9752C12.2138 11.0697 12.6666 9.96689 12.6666 8.66689C12.6666 7.36689 12.2138 6.26412 11.3082 5.35856C10.4027 4.45301 9.2999 4.00023 7.9999 4.00023C6.6999 4.00023 5.59713 4.45301 4.69157 5.35856C3.78601 6.26412 3.33324 7.36689 3.33324 8.66689C3.33324 9.96689 3.78601 11.0697 4.69157 11.9752C5.59713 12.8808 6.6999 13.3336 7.9999 13.3336Z"
                    fill="#94A3B8"
                  />
                </g>
              </svg>
              <p className="text-slate-800 text-sm font-normal leading-tight cursor-pointer">
                활성화 상태
              </p>
              {activeStatus.length >= 1 && <p className="text-slate-300">|</p>}
              <div className="flex items-center gap-2">
                {activeStatus.length >= 1 &&
                  activeStatus.map((activeStatus) => (
                    <>
                      <div
                        key={activeStatus}
                        className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm cursor-default"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <p>{activeStatus}</p>
                        <X
                          size={16}
                          className="cursor-pointer"
                          onClick={() => deleteActiveStatus(activeStatus!)}
                        />
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent align="start" side="bottom" className="w-40">
          <Command>
            <CommandItem
              className="flex gap-2 aria-selected:bg-orange-50"
              value="Y"
              onSelect={() => {
                onActiveStatusSelect("Y");
                setIsActiveStatusFieldOpen(true);
              }}
            >
              <Check
                size={16}
                className={
                  activeStatus.includes("Y")
                    ? "opacity-100 text-orange-500"
                    : "opacity-0"
                }
              />
              <p>Y</p>
            </CommandItem>
            <CommandItem
              className="flex gap-2 aria-selected:bg-orange-50"
              value="N"
              onSelect={() => {
                onActiveStatusSelect("N");
                setIsActiveStatusFieldOpen(true);
              }}
            >
              <Check
                size={16}
                className={
                  activeStatus.includes("N")
                    ? "opacity-100 text-orange-500"
                    : "opacity-0"
                }
              />
              <p>N</p>
            </CommandItem>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
