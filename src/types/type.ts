import * as z from "zod";
import {
  CommonCodeSchema,
  DeptListSchema,
  DeptSchema,
} from "@/api/common.api.schema";

export const ServerURL = {
  HRS: process.env.HRS_URL ?? "",
} as const;

export type ServerURLType = "HRS";

export type ErrorType<T> = {
  error: T | unknown;
};

export type Dept = z.infer<typeof DeptSchema>;
export type DeptList = z.infer<typeof DeptListSchema>;

export type CommonCode = z.infer<typeof CommonCodeSchema>;
