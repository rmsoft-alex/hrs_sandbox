"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import { CreateFormType, OptionState, TreeDataType } from "../types";
import { NodeModel } from "@minoru/react-dnd-treeview";

interface Props {
  form: UseFormReturn<CreateFormType>;
  options: NodeModel<TreeDataType>[];
  selectedPrevs: OptionState[];
  onSelect: (value: NodeModel<TreeDataType> | undefined) => void;
}

function Combobox({ form, options = [], selectedPrevs, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="parent"
      render={({ field }) => (
        <FormItem className="grid grid-cols-[100px_250px]">
          <FormLabel className="self-center mt-2 ">상위부서</FormLabel>
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
                    "w-[250px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {!field.value || field.value === -1
                    ? "상위부서 선택"
                    : options.find((option) => option.id === field.value)?.text}
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandEmpty>No department found.</CommandEmpty>
                <CommandGroup className="overflow-auto max-h-64">
                  {options.map((option) => (
                    <CommandItem
                      value={option.text}
                      key={option.id}
                      onSelect={(value) => {
                        if (
                          selectedPrevs.some((prev) => prev.value === option.id)
                        )
                          return;
                        const val = options.find(
                          (option) =>
                            option.text.toUpperCase() === value.toUpperCase()
                        );
                        onSelect(val);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-orange-500",
                          option.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span
                        className={`${
                          selectedPrevs.some((prev) => prev.value === option.id)
                            ? "text-slate-300"
                            : ""
                        }`}
                      >
                        {option.text}
                      </span>
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

export default Combobox;
