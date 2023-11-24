"use client";
import React, { useState } from "react";
import {
  useComboboxFieldState,
  useUsrFilteringAction,
} from "@/app/(main)/user/store/useUserFilterStore";
import { useDept } from "@/hooks/useCommon";

import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, LayoutPanelTop, X } from "lucide-react";
import { PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Props = {
  resetPageIndex: () => void;
};

export default function ComboBoxFilteringField({ resetPageIndex }: Props) {
  const { departmentNameList } = useComboboxFieldState();
  const { setDepartmentName, deleteDepartmentName, resetDepartmentName } =
    useUsrFilteringAction();
  const [isDepartmentNameFieldOpen, setIsDepartmentNameFieldOpen] =
    useState(false);
  const { deptList } = useDept();

  const department = deptList?.map(
    ({ id, text }: { id: number; text: string }) => ({
      id,
      text,
    })
  );

  return (
    <div>
      <Popover
        open={isDepartmentNameFieldOpen}
        onOpenChange={setIsDepartmentNameFieldOpen}
      >
        <div className="flex items-center">
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 border border-slate-300 rounded-md hover:bg-white focus-visible:ring-slate-400 shadow h-9 px-4 text-sm font-medium cursor-pointer">
              <LayoutPanelTop size={18} className="text-slate-400" />
              <p className="text-slate-800 text-sm font-normal leading-tight cursor-pointer">
                부서명
              </p>
              {departmentNameList.length >= 1 && (
                <p className="text-slate-300">|</p>
              )}
              <div className="flex items-center gap-2">
                {departmentNameList.length >= 1 &&
                  departmentNameList.length < 3 &&
                  departmentNameList.map((name) => (
                    <>
                      <div
                        key={name}
                        className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm cursor-default"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <p>{name}</p>
                        <X
                          className="cursor-pointer"
                          size={16}
                          onClick={() => {
                            deleteDepartmentName(name!);
                            resetPageIndex();
                          }}
                        />
                      </div>
                    </>
                  ))}
                {departmentNameList.length >= 3 && (
                  <p className="text-orange-500">
                    {departmentNameList.length}개 선택
                  </p>
                )}
              </div>
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent align="start">
          <Command>
            <CommandInput placeholder="부서명" />
            <CommandList className="h-fit static">
              <CommandEmpty>해당하는 부서가 없습니다.</CommandEmpty>
              <CommandGroup className=" h-64 overflow-y-scroll">
                {department?.map(
                  ({ id, text }: { id: number; text: string }) => (
                    <CommandItem
                      className="flex items-center gap-2 aria-selected:bg-orange-50"
                      key={id}
                      value={text}
                      onSelect={() => {
                        setDepartmentName(text);
                        resetPageIndex();
                      }}
                    >
                      <Check
                        size={16}
                        className={
                          departmentNameList.includes(text)
                            ? "opacity-100 text-orange-500"
                            : "opacity-0"
                        }
                      />
                      <p>{text}</p>
                    </CommandItem>
                  )
                )}
              </CommandGroup>
              {departmentNameList.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className="flex justify-center text-center"
                      onSelect={() => {
                        resetDepartmentName();
                        resetPageIndex();
                      }}
                    >
                      필터 초기화
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
