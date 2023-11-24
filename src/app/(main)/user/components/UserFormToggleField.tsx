"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UsrDtlRes } from "../type";

type Props = {
  name: "activeStatus";
  title: string;
  required: boolean;
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

export default function UserFormToggleField({
  name,
  title,
  required,
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
              <Switch
                id={name}
                onCheckedChange={(value: boolean) => {
                  const status = value ? "Y" : "N";
                  field.onChange(status);
                }}
                defaultChecked={userInfo?.activeStatus === "N" ? false : true}
              />
            </FormControl>
            <div />
          </div>
        </FormItem>
      )}
    />
  );
}
