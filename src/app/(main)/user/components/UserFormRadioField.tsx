"use client";
import React from "react";
import { UsrDtlRes } from "../type";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Props = {
  name: "gender";
  title: string;
  required: boolean;
  options: Array<{ name: string; title: string }>;
  mode: "edit" | "register";
  userInfo?: UsrDtlRes;
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
};

export default function UserFormRadioField({
  name,
  title,
  required,
  options,
  mode,
  userInfo,
  form,
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="grid grid-cols-5 grid-rows-[2fr_1fr] items-center h-[60px]">
            <FormLabel className="col-span-2">
              {title}
              {required && <span className="text-orange-500">*</span>}{" "}
            </FormLabel>
            <FormControl className="col-span-3">
              <RadioGroup
                className="flex gap-5"
                defaultValue={userInfo?.gender || options[0].name}
                onValueChange={field.onChange}
                disabled={mode === "edit" && name === "gender"}
              >
                {options.map(({ name, title }) => (
                  <div key={name} className="flex items-center gap-2">
                    <RadioGroupItem value={name} id={name} />
                    <Label className="w-8" htmlFor={name}>
                      {title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <div />
          </div>
        </FormItem>
      )}
    />
  );
}
