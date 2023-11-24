import {
  GetDeleteDeptLogListSchema,
  GetDeptChartSchema,
  GetDegreeSchema,
  GetNewDeptLogListSchema,
  GetPreDeptChartSchema,
  GetRestructureInfoSchema,
  GetUsrLogListSchema,
  GetReorganizationLogsResSchema,
} from "./../../../api/log.api.schema";
import * as z from "zod";
import {
  GetDeptChangeInfoSchema,
  GetDeptInfoSchema,
  GetDeptLogsResSchema,
  GetDeptUsrRltChangeInfoschema,
  GetLogsResSchema,
  GetLogsSchema,
  GetUsrChangeInfoSchema,
  GetUsrDeptRltChangeInfoSchema,
  GetUsrInfoSchema,
  GetUsrLogsResSchema,
} from "@/api/log.api.schema";

export type LogsRes = z.infer<typeof GetLogsResSchema>;
export type Logs = z.infer<typeof GetLogsSchema>;
export type Degree = z.infer<typeof GetDegreeSchema>;

export type DeptInfo = z.infer<typeof GetDeptInfoSchema>;
export type DeptChangeInfo = z.infer<typeof GetDeptChangeInfoSchema>;
export type DeptUsrRltChangeInfo = z.infer<
  typeof GetDeptUsrRltChangeInfoschema
>;
export type DeptLogsRes = z.infer<typeof GetDeptLogsResSchema>;

export type UsrChangeInfo = z.infer<typeof GetUsrChangeInfoSchema>;
export type UsrDeptRltChangeInfo = z.infer<
  typeof GetUsrDeptRltChangeInfoSchema
>;
export type UsrInfo = z.infer<typeof GetUsrInfoSchema>;
export type UsrLogsRes = z.infer<typeof GetUsrLogsResSchema>;

export type DeleteDeptLogList = z.infer<typeof GetDeleteDeptLogListSchema>;
export type DeptChart = z.infer<typeof GetDeptChartSchema>;
export type NewDeptLogList = z.infer<typeof GetNewDeptLogListSchema>;
export type PreDeptChart = z.infer<typeof GetPreDeptChartSchema>;
export type RestructureInfo = z.infer<typeof GetRestructureInfoSchema>;
export type UsrLogList = z.infer<typeof GetUsrLogListSchema>;
export type ReorganizationLogsRes = z.infer<
  typeof GetReorganizationLogsResSchema
>;
