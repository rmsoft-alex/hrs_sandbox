import * as z from "zod";

export const GetLogsSchema = z.object({
  logInfoIdx: z.number(),
  logType: z.string(),
  regDate: z.string(),
  regBy: z.string(),
  degree: z.union([z.string(), z.undefined()]),
});
export const GetLogsResSchema = z.object({
  itemList: z.array(GetLogsSchema),
  itemCnt: z.number(),
});
export const GetDegreeSchema = z.object({
  degree: z.string(),
  latestAssignedLogInfoIdx: z.number(),
  mustAssignedLogInfoIdx: z.number(),
});

export const GetDeptInfoSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  regBy: z.string(),
  regDate: z.string(),
});
export const GetDeptChangeInfoSchema = z.null();
export const GetDeptUsrRltChangeInfoschema = z.object({
  logLabelCode: z.string(),
  operationType: z.enum(["INSERT", "UPDATE", "DEPETE"]),
  departmentIdx: z.number(),
  departmentName: z.string(),
  userName: z.string(),
  preTitleCode: z.union([z.string(), z.null()]),
  titleCode: z.string(),
});
export const GetDeptLogsResSchema = z.object({
  resDepartmentInfo: GetDeptInfoSchema,
  resDepartmentChangeInfo: GetDeptChangeInfoSchema,
  resUserDepartmentRelationChangeInfo: GetDeptUsrRltChangeInfoschema,
});

export const GetUsrChangeInfoSchema = z.object({
  activeStatus: z.enum(["Y", "N"]),
  employeeNumber: z.string(),
  logLabelCode: z.string(),
  name: z.string(),
  nickname: z.string(),
  preActiveStatus: z.union([z.enum(["Y", "N"]), z.null()]),
  preEmployeeNumber: z.union([z.string(), z.null()]),
  preName: z.union([z.string(), z.null()]),
  preNickname: z.union([z.string(), z.null()]),
  preTitleCode: z.union([z.string(), z.null()]),
  titleCode: z.string(),
});
export const GetUsrDeptRltChangeInfoSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  logLabelCode: z.string(),
  operationType: z.string(),
  preTitleCode: z.union([z.string(), z.null()]),
  titleCode: z.string(),
  userName: z.string(),
});
export const GetUsrInfoSchema = z.object({
  name: z.string(),
  regBy: z.string(),
  regDate: z.string(),
  userInfoIdx: z.number(),
});
export const GetUsrLogsResSchema = z.object({
  resUserChangeInfo: GetUsrChangeInfoSchema,
  resUserDepartmentRelationChangeInfo: GetUsrDeptRltChangeInfoSchema,
  resUserInfo: GetUsrInfoSchema,
});

export const GetDeleteDeptLogListSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  parentDepartmentIdx: z.number(),
  parentDepartmentName: z.string(),
  restructureDetailCode: z.string(),
});
export const GetDeptChartSchema = z.object({
  data: z.object({
    activeType: z.enum(["Y", "N"]),
    departmentIdx: z.number(),
    depth: z.number(),
    regulationOrder: z.number(),
    restructureCode: z.string(),
    restructureDetailCode: z.string(),
    restructureIdx: z.number(),
  }),
  id: z.number(),
  parent: z.number(),
  text: z.string(),
});
export const GetNewDeptLogListSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  departmentSize: z.number(),
  parentDepartmentIdx: z.number(),
  parentDepartmentName: z.string(),
  preDepartmentInfoList: z.array(
    z.object({
      preDepartmentIdx: z.number(),
      preDepartmentName: z.string(),
    })
  ),
  restructureDetailCode: z.string(),
});
export const GetPreDeptChartSchema = z.object({
  data: z.object({
    activeType: z.enum(["Y", "N"]),
    departmentIdx: z.number(),
    depth: z.number(),
    regulationOrder: z.number(),
    restructureCode: z.string(),
    restructureDetailCode: z.string(),
    restructureIdx: z.number(),
  }),
  id: z.number(),
  parent: z.number(),
  text: z.string(),
});
export const GetRestructureInfoSchema = z.object({
  changeUserCnt: z.number(),
  deleteDepartmentCnt: z.number(),
  description: z.string(),
  newDepartmentCnt: z.number(),
  regBy: z.string(),
  regDate: z.string(),
  restructureIdx: z.number(),
});
export const GetUsrLogListSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  preDepartmentIdx: z.number(),
  preDepartmentName: z.string(),
  restructureCode: z.string(),
  userInfoIdx: z.number(),
  userName: z.string(),
});

export const GetReorganizationLogsResSchema = z.object({
  deleteDepartmentLogList: z.array(GetDeleteDeptLogListSchema),
  departmentChart: z.array(GetDeptChartSchema),
  newDepartmentLogList: z.array(GetNewDeptLogListSchema),
  preDepartmentChart: z.array(GetPreDeptChartSchema),
  restructureInfo: GetRestructureInfoSchema,
  userLogList: z.array(GetUsrLogListSchema),
});
