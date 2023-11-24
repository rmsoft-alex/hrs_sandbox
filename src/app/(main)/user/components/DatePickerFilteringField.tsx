"use client";
import React, { useState } from "react";
import dayjs from "dayjs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  useDatePickerFieldState,
  useUsrFilteringAction,
} from "../store/useUserFilterStore";

type Props = {
  resetPageIndex: () => void;
};

export default function DatePickerFilteringField({ resetPageIndex }: Props) {
  const { regDate } = useDatePickerFieldState();
  const { setRegDate } = useUsrFilteringAction();
  const [isFromFieldOpen, setIsFromFieldOpen] = useState(false);
  const [isToFieldOpen, setIsToFieldOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 bg-white rounded-md shadow border border-slate-300 px-4 h-9 text-slate-800 text-sm font-normal">
        <div className="flex items-center gap-3">
          <CalendarIcon size={18} className="text-slate-400" /> <p>등록일</p>
        </div>
        <Popover open={isFromFieldOpen} onOpenChange={setIsFromFieldOpen}>
          <div className="flex items-center justify-center gap-2">
            <p className="pr-1 text-slate-300">|</p>
            <PopoverTrigger asChild>
              {regDate?.from ? (
                <Button
                  variant={"ghost"}
                  className="h-6 flex items-center gap-1 py-0 px-3 bg-secondary rounded-sm"
                >
                  <p className="text-slate-800 text-sm font-normal">
                    {dayjs(regDate.from).format("YYYY.MM.DD")}
                  </p>
                  <X
                    size={14}
                    className="hover:cursor-pointer mb-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegDate("", "from");
                      resetPageIndex();
                    }}
                  />
                </Button>
              ) : (
                <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm cursor-pointer">
                  <p>시작</p>
                </div>
              )}
            </PopoverTrigger>
          </div>
          <PopoverContent
            className="bg-white mt-2 rounded-md shadow border-slate-400"
            align="start"
            side="bottom"
          >
            <Calendar
              mode="single"
              selected={new Date(regDate?.from || "")}
              onSelect={(value) => {
                setRegDate(value, "from");
                setIsFromFieldOpen(false);
                resetPageIndex();
              }}
              disabled={(date) =>
                (regDate?.to && date > new Date(regDate.to)) ||
                date > new Date()
              }
            />
          </PopoverContent>
        </Popover>
        <p>~</p>
        <Popover open={isToFieldOpen} onOpenChange={setIsToFieldOpen}>
          <div className="flex items-center gap-2">
            <PopoverTrigger asChild>
              {regDate?.to ? (
                <Button
                  variant={"ghost"}
                  className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm"
                >
                  <p className="text-slate-800 text-sm font-normal">
                    {dayjs(regDate.to).format("YYYY.MM.DD")}
                  </p>
                  <X
                    size={14}
                    className="hover:cursor-pointer mb-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegDate("", "to");
                      resetPageIndex();
                    }}
                  />
                </Button>
              ) : (
                <div className="h-6 flex items-center gap-2 py-0 px-3 bg-secondary rounded-sm cursor-pointer">
                  <p>종료</p>
                </div>
              )}
            </PopoverTrigger>
          </div>
          <PopoverContent
            className="bg-white mt-2 rounded-md shadow border-slate-400"
            align="start"
            side="bottom"
          >
            <Calendar
              mode="single"
              selected={new Date(regDate?.to || "")}
              onSelect={(value) => {
                setRegDate(value, "to");
                setIsToFieldOpen(false);
                resetPageIndex();
              }}
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
