"use client";
import * as React from "react";
import { Search } from "lucide-react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OptionState } from "@/app/(main)/restructure/types";

interface Props {
  options: OptionState[];
  onSelect: (value: OptionState) => void;
}

function Combobox({ options = [], onSelect }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-full justify-between rounded-none border-none",
            true && "text-muted-foreground"
          )}
          onClick={() => setOpen(!open)}
        >
          검색
          <Search className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No department found.</CommandEmpty>
          <CommandGroup className="overflow-auto max-h-[400px]">
            {options.map((option) => (
              <CommandItem
                value={option.label}
                key={option.value}
                onSelect={(value) => {
                  const val = options.find(
                    (option) =>
                      option.label.toUpperCase() === value.toUpperCase()
                  )?.value;
                  onSelect(option);
                  setOpen(false);
                }}
              >
                {/* <Check
                  className={cn(
                    "mr-2 h-4 w-4"
                    // option.value === field.value ? "opacity-100" : "opacity-0"
                  )}
                /> */}
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;
