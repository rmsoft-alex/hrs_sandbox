import z from "zod";

/* enum */
export const StepSchema = z.enum(["Creation", "Abolition", "TransLocation"]);
export const PositionSchema = z.enum([
  "HRS0105",
  "HRS0104",
  "HRS0103",
  "HRS0102",
  "HRS0101",
]);
export const DepartmentStateSchema = z.enum([
  "CREATED",
  "MERGE",
  "SLICE",
  "MOVE",
  "ABOLISH",
]);

/* object */
export const CreateFormSchema = z.object({
  name: z
    .string({ required_error: "필수 값입니다." })
    .trim()
    .min(2, { message: "최소 2글자 이상 입력해주십시오." })
    .max(15, { message: "15자를 초과 할 수 없습니다." })
    .regex(/^[가-힣a-zA-Z0-9]+$/g, "특수문자를 포함 할 수 없습니다."),
  parent: z.number({ required_error: "필수 값입니다." }),
  depth: z.number(),
  createType: z.string({ required_error: "필수 값입니다." }),
  deactiveType: z.string().nullable(),
  prevDepartments: z
    .array(
      z.object({
        label: z.string(),
        value: z.string().or(z.number()),
      })
    )
    .optional(),
});

export const CreationHistorySchema = z.object({
  id: z.number(),
  cmmnCode: z.string(),
  cmmnCodeDetail: z.string(),
  departmentName: z.string(),
  depth: z.number(),
  departmentTempIdx: z.number().optional(),
  parentDepartmentTempIdx: z.number(),
  regDate: z.string(),
  previousDepartmentInfo: z.array(z.number()).nullable(),
});

export const AbolitionHistorySchema = z.object({
  id: z.number(),
  cmmnCode: z.string(),
  cmmnCodeDetail: z.string(),
  regDate: z.string(),
  departmentInfoList: z.array(
    z.object({
      departmentTempIdx: z.number(),
      departmentName: z.string(),
    })
  ),
});

export const MemberHistorySchema = z.object({
  userName: z.string(),
  departmentUserRelationTempIdx: z.number(),
  newDepartmentTempIdx: z.number().nullable(),
  newDepartmentName: z.string().nullable(),
  newDepartmentTitleCode: z.string().nullable(),
  newTitleCode: z.string().nullable(),
  preDepartmentTempIdx: z.number(),
  preDepartmentName: z.string(),
  preTitleCode: z.string(),
  regDate: z.string(),
  restructureCode: z.string(),
  userInfoIdx: z.number(),
});

export const MemberSchema = z.object({
  departmentUserRelationTempIdx: z.number(),
  userInfoIdx: z.number().or(z.string()),
  name: z.string(),
  departmentName: z.string(),
  departmentTempIdx: z.number(),
  titleCodeName: z.string(),
  titleCode: z.string(),
  restructureCode: z.number().nullable(),
});

export const TreeDataSchema = z.object({
  departmentIdx: z.number(),
  regulationOrder: z.number(),
  activeType: z.enum(["Y", "N"]),
  restructureIdx: z.number().nullable(),
  restructureCode: z.string().optional(),
  restructureDetailCode: z.string().nullable(),
  depth: z.number(),
});
