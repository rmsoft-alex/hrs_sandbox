import * as React from "react";
import { cn } from "@/lib/utils";

import { Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateFormType, OptionState, TreeDataType } from "../types";
import { NodeModel } from "@minoru/react-dnd-treeview";

interface MultiSelectProps {
  form: UseFormReturn<CreateFormType>;
  options: NodeModel<TreeDataType>[];
  selected: OptionState[];
  parentIdx: number | null;
  setSelected: React.Dispatch<React.SetStateAction<OptionState[]>>;
  disabled?: boolean;
}

function MultiSelect({
  form,
  options,
  selected,
  parentIdx,
  setSelected,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: OptionState) => {
    const unselect = selected.filter((i) => i !== item);
    setSelected(unselect);
    form.setValue("prevDepartments", unselect);
    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name="prevDepartments"
      render={() => (
        <FormItem className={"grid grid-cols-[100px_1fr]"}>
          <FormLabel
            className={`mt-2 leading-8 ${disabled ? "text-slate-400" : ""}`}
          >
            이전부서
          </FormLabel>
          <div>
            <Popover
              open={open}
              onOpenChange={(open) => {
                setOpen(open && !disabled);
              }}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="flex flex-wrap gap-1 w-fit">
                    {selected.length ? (
                      selected.map((item) => (
                        <Badge
                          variant="secondary"
                          key={item.value}
                          className="flex justify-center items-center h-8 w-[130px] mr-1 cursor-pointer group select-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnselect(item);
                          }}
                        >
                          {item.label}
                          <X className="w-3 h-3 ml-1 text-muted-foreground group-hover:text-foreground" />
                        </Badge>
                      ))
                    ) : (
                      <></>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      role="combobox"
                      aria-expanded={open}
                      disabled={disabled}
                      className="h-8 rounded-full select-none"
                    >
                      <span className="w-4 h-4 mr-1 flex justify-center items-center bg-slate-900 rounded-full">
                        <Plus className="w-3 h-3 text-white " strokeWidth={3} />
                      </span>
                      추가
                    </Button>
                    <FormMessage className="col-span-2 col-start-2 leading-[32px]" />
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0"
                side="bottom"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search ..." />
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandGroup className="overflow-auto max-h-64">
                    {options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.text}
                        onSelect={() => {
                          if (option.id === parentIdx) return;
                          const type = form.getValues().createType;
                          if (type === "HRS0303010101") {
                            const selectedValues = selected.some(
                              (item) => item.value === option.id
                            )
                              ? selected.filter(
                                  (item) => item.value !== option.id
                                )
                              : [
                                  ...selected,
                                  {
                                    label: option.text,
                                    value: Number(option.id),
                                  },
                                ];
                            form.setValue("prevDepartments", selectedValues);
                            setSelected(selectedValues);
                          } else {
                            form.setValue("prevDepartments", [
                              {
                                label: option.text,
                                value: Number(option.id),
                              },
                            ]);
                            setSelected([
                              {
                                label: option.text,
                                value: Number(option.id),
                              },
                            ]);
                          }
                          form.clearErrors("prevDepartments");
                          setOpen(true);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-orange-500",
                            selected.some((item) => item.value === option.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span
                          className={`${
                            option.id === parentIdx ? "text-slate-300" : ""
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
          </div>

          <FormDescription className="col-span-3 text-xs mt-6 cursor-default select-none">
            <span>이전 부서로 선택 된 부서는 폐지되며, </span>
            <span>
              해당 부서가 하위 부서를 포함하는 경우 해당 하위 부서는 함께
              폐지됩니다.
            </span>
          </FormDescription>
        </FormItem>
      )}
    />
  );
}

export default MultiSelect;
