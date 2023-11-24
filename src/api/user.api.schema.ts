import * as z from "zod";

// 변수 or 함수명은 20자 이내로 정리, 줄임말 사용
// Users
export const GetUsrsReqSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
});

export const GetUsrsSchema = z.object({
  userInfoIdx: z.number(),
  name: z.string(),
  userId: z.string(),
  activeStatus: z.string(),
  departmentName: z.string(),
  regDate: z.string(),
});

export const GetUsrsResSchema = z.object({
  itemList: z.array(GetUsrsSchema),
  itemCnt: z.number(),
});

export const PutUsrsActStateReqSchema = z.object({
  userInfoIdx: z.number().array(),
});

// UserDetail
export const GetUsrDtlReqSchema = z.object({
  userId: z.number(),
});

export const UsrInfoSchema = z.object({
  name: z.string(),
  birth: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  userId: z.string(),
  userInfoIdx: z.number(),
  employeeNumber: z.string().optional(),
  titleCode: z.string(),
  nickname: z.string().optional(),
  activeStatus: z.enum(["Y", "N"]).optional(),
});

export const UsrDepSchema = z.object({
  relationIdx: z.number(),
  departmentIdx: z.number(),
  departmentName: z.string(),
  departmentTitleCode: z.string(),
  mainDepartment: z.enum(["Y", "N"]),
  regDate: z.string(),
  updtDate: z.string(),
});

export const GetUsrDtlResSchema = UsrInfoSchema.merge(
  z.object({ departmentUserRelations: UsrDepSchema.array() })
);

// UserLog
export const UsrLogSchema = z.object({
  logIdx: z.number(),
  logLabelCode: z.string(),
  description: z.string(),
  userDescription: z.union([z.string(), z.null()]),
  crudOperation: z.enum(["INSERT", "UPDATE", "DELETE"]),
  regDate: z.string(),
  regBy: z.string(),
});

export const GetUsrLogResSchema = z.object({
  itemList: z.array(UsrLogSchema),
  itemCnt: z.number(),
});

// UserRegister
export const UsrRegisterReqSchema = z.object({
  activeStatus: z.string(),
  birth: z.string(),
  employeeNumber: z.union([z.string(), z.null()]),
  gender: z.string(),
  name: z.string(),
  nickname: z.union([z.string(), z.null()]),
  titleCode: z.string(),
  userId: z.string(),
  userDepartmentRelationList: z
    .object({
      crudOperationType: z.string().optional(),
      departmentIdx: z.number().optional(),
      departmentTitleCode: z.string().optional(),
      mainDepartmentYn: z.string().optional(),
    })
    .array(),
});

// UserEdit
export const UsrEditReqSchema = z.object({
  userInfoIdx: z.number(),
  activeStatus: z.string(),
  employeeNumber: z.union([z.string(), z.null()]),
  name: z.string(),
  nickname: z.union([z.string(), z.null()]),
  titleCode: z.string(),
  userDescription: z.union([z.string(), z.null()]),
  userDepartmentRelationList: z
    .object({
      crudOperationType: z.string().optional(),
      departmentIdx: z.number().optional(),
      mainDepartmentYn: z.string().optional(),
      relationIdx: z.number().optional(),
      departmentTitleCode: z.string().optional(),
    })
    .array(),
});
