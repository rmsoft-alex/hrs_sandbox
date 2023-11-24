"use client";
import React from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  name:
    | "name"
    | "birth"
    | "gender"
    | "userId"
    | "employeeNumber"
    | "titleCode"
    | "nickname"
    | "activeStatus";
  title: string;
  required: boolean;
  mode: "edit" | "register";
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

export default function UserFormTextInputField({
  name,
  title,
  required,
  mode,
  form,
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="grid grid-cols-5 grid-rows-[2fr_1fr] items-center">
            <FormLabel className="col-span-2">
              {title}
              {required && <span className="text-orange-500">*</span>}{" "}
            </FormLabel>
            <FormControl className="col-span-3">
              <Input
                value={field.value ?? undefined}
                onChange={field.onChange}
                disabled={mode === "edit" && name === "userId"}
              />
            </FormControl>
            <div className="col-span-2" />
            <div className="col-span-3 flex justify-start items-start h-full">
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
