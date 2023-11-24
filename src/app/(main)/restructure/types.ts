import z from "zod";
import {
  CreateFormSchema,
  CreationHistorySchema,
  MemberSchema,
  PositionSchema,
  StepSchema,
  MemberHistorySchema,
  DepartmentStateSchema,
  TreeDataSchema,
  AbolitionHistorySchema,
} from "./schema";
import {
  TempDeletedDepartmentSchema,
  TempNewDepartmentSchema,
  TempStorageReqSchema,
  TempUserSchema,
} from "@/api/restructure.api.schema";

export type StepState = z.infer<typeof StepSchema>;
export type PositionState = z.infer<typeof PositionSchema>;
export type DepartmentState = z.infer<typeof DepartmentStateSchema>;

export type CreateFormType = z.infer<typeof CreateFormSchema>;
export type CreationHistoryType = z.infer<typeof CreationHistorySchema>;
export type AbolitioinHistoryType = z.infer<typeof AbolitionHistorySchema>;
export type MemberHistoryType = z.infer<typeof MemberHistorySchema>;
export type MemberType = z.infer<typeof MemberSchema>;

export interface OptionState {
  value: string | number;
  label: string;
  disable?: boolean;
}

export type TreeDataType = z.infer<typeof TreeDataSchema>;

// tempStorage
export type TempStorageType = z.infer<typeof TempStorageReqSchema>;
export type TempNewDepartmentType = z.infer<typeof TempNewDepartmentSchema>;
export type TempDeletedDepartmentType = z.infer<
  typeof TempDeletedDepartmentSchema
>;
export type TempUserType = z.infer<typeof TempUserSchema>;

export const CreateCodeEnum = [
  {
    type: "MERGE",
    code: "HRS0303010101",
    label: "합병",
  },
  {
    type: "SLICE",
    code: "HRS0303010102",
    label: "분할",
  },
  {
    type: "MOVE",
    code: "HRS0303010103",
    label: "변경",
  },
  {
    type: "CREATED",
    code: "HRS0303010104",
    label: "신설",
  },
] as const;

export const AbolishCodeEnum = [
  {
    type: "MERGE",
    code: "HRS0303010201",
    label: "합병",
  },
  {
    type: "SLICE",
    code: "HRS0303010202",
    label: "분할",
  },
  {
    type: "MOVE",
    code: "HRS0303010203",
    label: "변경",
  },
  {
    type: "ABOLISH",
    code: "HRS0303010204",
    label: "폐지",
  },
] as const;

export const MemberRestructureCodeEnum = [
  {
    type: "MERGE",
    code: "HRS03030201",
    label: "합병",
  },
  {
    type: "SLICE",
    code: "HRS03030202",
    label: "분할",
  },
  {
    type: "MOVE",
    code: "HRS03030203",
    label: "변경",
  },
  {
    type: "ABOLISH",
    code: "HRS03030204",
    label: "폐지",
  },
  {
    type: "NONE",
    code: "HRS03030205",
    label: "이동",
  },
] as const;

export const DepartmentTitleCodeEnum = [
  {
    label: "매니저",
    code: "HRS0105",
  },
  {
    label: "리더",
    code: "HRS0104",
  },
  {
    label: "헤더",
    code: "HRS0103",
  },
  {
    label: "CFO",
    code: "HRS0102",
  },
  {
    label: "CEO",
    code: "HRS0101",
  },
];