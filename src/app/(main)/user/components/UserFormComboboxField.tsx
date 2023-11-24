"use client";
import React, { useState } from "react";
import { useTitle } from "../../../../hooks/useCommon";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

type Props = {
  name: "titleCode";
  title: string;
  required: boolean;
  form: UseFormReturn<
    {
      name: string;
      birth: string;
      gender: "MALE" | "FEMALE";
      userId: string;
      employeeNumber: string | null;
      titleCode: string;
      nickname: string | null;
      activeStatus: "Y" | "N";
    },
    any,
    undefined
  >;
  selectedTitleCode: string;
  setSelectedTitleCode: (value: string) => void;
};

export default function UserFormComboboxField({
  name,
  title,
  required,
  form,
  selectedTitleCode,
  setSelectedTitleCode,
}: Props) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { titleList, getTitleName } = useTitle();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="grid grid-cols-5 grid-rows-[2fr_1fr] items-center">
            <FormLabel className="col-span-2">
              {title}
              {required && <span className="text-orange-500">*</span>}{" "}
            </FormLabel>
            <FormControl>
              <Popover open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                <PopoverTrigger asChild className="cursor-pointer col-span-3">
                  <div
                    className="flex justify-between items-center gap-2 border border-slate-200 py-2 p-3 rounded-md"
                    aria-expanded={isCommandOpen}
                    aria-label="Select a TitleName"
                  >
                    <p>
                      {getTitleName(selectedTitleCode.toUpperCase() || "") ||
                        "직위"}
                    </p>
                    <ChevronsUpDown size={16} />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  className="w-fit min-w-40 max-w-56"
                >
                  <Command>
                    <CommandInput placeholder="직위" />
                    <CommandEmpty>해당 직위가 없습니다.</CommandEmpty>
                    <CommandGroup className="h-40 overflow-auto">
                      {titleList?.map(({ commonCode, commonCodeName }) => (
                        <CommandItem
                          className="flex gap-2"
                          key={commonCode}
                          onSelect={(value) => {
                            setSelectedTitleCode(commonCode);
                            setIsCommandOpen(false);
                            field.onChange(value);
                          }}
                          value={commonCodeName}
                        >
                          <Check
                            size={16}
                            className={
                              selectedTitleCode === commonCode
                                ? "opacity-100 text-orange-500"
                                : "opacity-0"
                            }
                          />
                          <p>{commonCodeName}</p>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <div className="col-span-2" />
            <div className="col-span-3 flex justify-start items-start h-full">
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
