import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { formatKST } from "@/utils/format";

type CalendarProps = {
  title: string;
  regDate: DateRange | undefined | { [key: string]: string };
  fromOpen: boolean;
  fromOpenChange: (fromOpen: boolean) => void;
  onFromDeleteButton: (e: any) => void;
  onFromSelect: (value: Date | undefined) => void;
  toOpen: boolean;
  toOpenChange: (toOpen: boolean) => void;
  onToDeleteButton: (e: any) => void;
  onToSelect: (value: Date | undefined) => void;
};

function SearchCalendar({
  title,
  regDate,
  fromOpen,
  fromOpenChange,
  onFromDeleteButton,
  onFromSelect,
  toOpen,
  toOpenChange,
  onToDeleteButton,
  onToSelect,
}: CalendarProps) {
  return (
    <>
      <div className="flex items-center gap-[0.4375rem] h-9 pl-[0.9375rem] pr-4 py-2 bg-white rounded-md shadow border border-slate-300 text-sm font-normal">
        <CalendarIcon size={18} className="text-slate-400" />
        <p>{title}</p>
        <Popover open={fromOpen} onOpenChange={fromOpenChange}>
          <div className="flex items-center gap-2">
            <PopoverTrigger asChild>
              {regDate?.from ? (
                <button className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm">
                  <p className="text-slate-800">
                    {formatKST(new Date(regDate.from), "YYYY.MM.DD")}
                  </p>
                  <X
                    size={16}
                    onClick={onFromDeleteButton}
                    className="hover:cursor-pointer leading-6"
                  />
                </button>
              ) : (
                <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm cursor-pointer">
                  <p>시작</p>
                </div>
              )}
            </PopoverTrigger>
          </div>
          <PopoverContent
            className="bg-white mt-2 rounded-md shadow border-slate-400 "
            align="start"
            side="bottom"
          >
            <Calendar
              mode="single"
              selected={new Date(regDate?.from || "")}
              onSelect={onFromSelect}
              disabled={(date) =>
                (regDate?.to && date > new Date(regDate.to)) ||
                date > new Date()
              }
            />
          </PopoverContent>
        </Popover>

        <p>~</p>
        <Popover open={toOpen} onOpenChange={toOpenChange}>
          <div className="flex items-center gap-2">
            <PopoverTrigger asChild>
              {regDate?.to ? (
                <button className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm">
                  <p className="text-slate-800">
                    {formatKST(new Date(regDate.to), "YYYY.MM.DD")}
                  </p>
                  <X
                    size={16}
                    onClick={onToDeleteButton}
                    className="hover:cursor-pointer leading-6"
                  />
                </button>
              ) : (
                <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm cursor-pointer">
                  <p>종료</p>
                </div>
              )}
            </PopoverTrigger>
          </div>
          <PopoverContent
            className="bg-white mt-2 rounded-md shadow border-slate-400 "
            align="start"
            side="bottom"
          >
            <Calendar
              mode="single"
              selected={new Date(regDate?.to || "")}
              onSelect={onToSelect}
              disabled={(date) =>
                (regDate?.from && date < new Date(regDate.from)) ||
                date > new Date()
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default SearchCalendar;
