"use client";
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
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
import { z } from "zod";
import { CommonCodeSchema } from "@/api/common.api.schema";

interface Props {
  options: z.infer<typeof CommonCodeSchema>;
  selectedItem: string;
  onSelect: (
    value: { commonCodeName: string; commonCode: string } | undefined
  ) => void;
}

function PositionComboBox({ options, selectedItem, onSelect }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full h-[25px] justify-between border px-2"
          >
            {
              options.find((option) => option.commonCode === selectedItem)
                ?.commonCodeName
            }
            <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.commonCodeName}
                  key={option.commonCode}
                  onSelect={(value) => {
                    onSelect(
                      options?.find(
                        (option) =>
                          option.commonCodeName.toUpperCase() ===
                          value.toUpperCase()
                      )
                    );
                    setOpen(false);
                  }}
                  className="flex gap-2 items-center"
                >
                  <span className="w-4">
                    {option.commonCode === selectedItem && (
                      <Check className="w-4 h-4 text-orange-500" />
                    )}
                  </span>
                  {option.commonCodeName}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default PositionComboBox;
