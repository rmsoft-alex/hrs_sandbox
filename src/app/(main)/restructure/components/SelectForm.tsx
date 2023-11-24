"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateFormType } from "../types";
import { UseFormReturn } from "react-hook-form";
import { CreateType, InputFormType } from "./Creation/CreateForm";
import { SelectGroup } from "@radix-ui/react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { useState } from "react";

const creationTypeOptions: CreateType[] = [
  {
    label: "신설",
    type: "CREATED",
    createCode: "HRS0303010104",
    deactiveCode: "",
  },
  {
    label: "변경",
    type: "MOVE",
    createCode: "HRS0303010103",
    deactiveCode: "HRS0303010203",
  },
  {
    label: "분할",
    type: "SLICE",
    createCode: "HRS0303010102",
    deactiveCode: "HRS0303010202",
  },
  {
    label: "합병",
    type: "MERGE",
    createCode: "HRS0303010101",
    deactiveCode: "HRS0303010201",
  },
];

interface Props {
  form: UseFormReturn<CreateFormType>;
  formData: InputFormType;
  onChange: (value: CreateType | undefined) => void;
}

export function SelectForm({ form, formData, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="createType"
      render={() => (
        <FormItem className="grid grid-cols-[100px_250px]">
          <FormLabel className="self-center mt-2 ">신설유형</FormLabel>
          <Popover
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
            }}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    `w-[250px] justify-between ${
                      creationTypeOptions.find(
                        (option) => option.createCode === formData.createType
                      )?.label
                        ? ""
                        : "text-muted-foreground"
                    }`
                  )}
                >
                  {creationTypeOptions.find(
                    (option) => option.createCode === formData.createType
                  )?.label || "신설 유형"}
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandGroup className="overflow-auto max-h-64">
                  {creationTypeOptions.map((option) => (
                    <CommandItem
                      key={option.createCode}
                      value={option.createCode}
                      onSelect={(value) => {
                        const selectedValue = creationTypeOptions.find(
                          (option) =>
                            option.createCode.toUpperCase() ===
                            value.toUpperCase()
                        );
                        onChange(selectedValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          `mr-2 h-4 w-4 text-orange-500
                          ${
                            formData.createType === option.createCode
                              ? "opacity-100"
                              : "opacity-0"
                          }`
                        )}
                      />
                      <span>{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
