import React from "react";
import { Check, X } from "lucide-react";
import { Command, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { generateUUID } from "@/components/common/search/RandomId";

type IconType = string | React.ReactNode;
type Option = {
  value: string;
  label: string;
};
type SelectProps = {
  icon: IconType;
  title: string;
  name?: string | (string | undefined)[];
  open: boolean;
  onOpenChange: (newState: boolean) => void;
  onDeleteButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSelect: (value: string) => void;
  options: Option[];
};
function SearchSelect({
  icon,
  title,
  name,
  open,
  onOpenChange,
  onDeleteButton,
  onSelect,
  options,
}: SelectProps) {
  const isNameArray = Array.isArray(name);

  return (
    <div>
      <Popover open={open} onOpenChange={onOpenChange}>
        <div className="flex items-center">
          <PopoverTrigger asChild>
            <div
              className="h-9 pl-[15px] pr-4 py-2 bg-white rounded-md shadow border border-slate-300 
            flex justify-center items-center gap-[7px] cursor-pointer"
            >
              {icon}
              <p className="text-slate-800 text-sm font-normal  leading-tight">
                {title}
              </p>
              <div className="flex items-center">
                {/* name의 상태값이 []일때와 string일때 */}
                {isNameArray
                  ? name.length >= 1 &&
                    name.map((item) => (
                      <button
                        key={item}
                        className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm"
                        onClick={onDeleteButton}
                      >
                        <p>{item}</p>
                        <X size={16} />
                      </button>
                    ))
                  : options.map(
                      (item) =>
                        name === item?.value && (
                          <React.Fragment key={generateUUID()}>
                            <span className="pr-2 text-slate-300">|</span>
                            <button
                              className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm"
                              onClick={onDeleteButton}
                            >
                              <p className="text-sm font-medium">
                                {item.label}
                              </p>
                              <X size={16} />
                            </button>
                          </React.Fragment>
                        )
                    )}
              </div>
            </div>
          </PopoverTrigger>
        </div>

        <PopoverContent className="mt-1" align="start" side="bottom">
          <Command className="rounded-lg border shadow-md w-40 p-4">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                className="flex gap-2 aria-selected:bg-orange-50"
                value={option.value}
                onSelect={() => onSelect(option.value)}
              >
                <Check
                  size={16}
                  className={
                    `${name}`.includes(option.value)
                      ? "opacity-100 text-orange-500"
                      : "opacity-0"
                  }
                />
                <p>{option.label}</p>
              </CommandItem>
            ))}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchSelect;
