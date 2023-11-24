import * as z from "zod";
import {
  GetUsrDtlResSchema,
  GetUsrLogResSchema,
  GetUsrsResSchema,
  GetUsrsSchema,
  UsrDepSchema,
  UsrEditReqSchema,
  UsrInfoSchema,
  UsrLogSchema,
  UsrRegisterReqSchema,
} from "@/api/user.api.schema";

export type UsrsRes = z.infer<typeof GetUsrsResSchema>;
export type Usrs = z.infer<typeof GetUsrsSchema>;

export type UsrInfo = z.infer<typeof UsrInfoSchema>;
export type UsrDep = z.infer<typeof UsrDepSchema>;
export type UsrDtlRes = z.infer<typeof GetUsrDtlResSchema> & {
  [key: string]: string;
};

export type UsrLogRes = z.infer<typeof GetUsrLogResSchema>;
export type UsrLog = z.infer<typeof UsrLogSchema>;

export type UsrRegisterReq = z.infer<typeof UsrRegisterReqSchema>;
export type UsrEditReq = z.infer<typeof UsrEditReqSchema>;

export type SelectedDept = {
  departmentIdx: number;
  departmentName: string;
};

export type UserDept = {
  crudOperationType: string | undefined;
  relationIdx: number | undefined;
  departmentIdx: number | undefined;
  departmentTitleCode: string | undefined;
  mainDepartmentYn: string | undefined;
};
