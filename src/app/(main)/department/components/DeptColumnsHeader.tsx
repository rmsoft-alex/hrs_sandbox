"use client";

import {
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Check,
  CalendarIcon,
} from "lucide-react";
import { Column } from "@tanstack/react-table";
import { ComponentType } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ko } from "date-fns/locale";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2 mr-3", className)}>
      <DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenu>
    </div>
  );
}

interface TableFilterHeaderProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
}

export function TableFilterHeader<TData, TValue>({
  column,
  title,
  options,
}: TableFilterHeaderProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface TableCalendarHeader<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  date?: Date;
  setDate?: () => void;
}

export function TableCalendarHeader<TData, TValue>({
  column,
  title,
  date,
  setDate,
}: TableCalendarHeader<TData, TValue>) {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger className="items-center flex h-8 data-[state=open]:bg-accent ">
          {title}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            locale={ko}
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
