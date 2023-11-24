import { z } from "zod";

// 조직도 조회
export const DepartmentListResSchema = z.array(
  z.object({
    id: z.number(),
    text: z.string(),
    parent: z.number().or(z.string()),
    data: z.object({
      restructureIdx: z.number().nullable(),
      regulationOrder: z.number().nullable(),
      activeType: z.enum(["Y", "N"]),
    }),
  })
);

// 부서 변경이력 조회
export const DepartmentLogResSchema = z.object({
  deleteDepartmentList: z.array(
    z.object({
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
    })
  ),
  newDepartmentList: z.array(
    z.object({
      id: z.number(),
      cmmnCode: z.string(),
      cmmnCodeDetail: z.string(),
      departmentName: z.string(),
      parentDepartmentTempIdx: z.number(),
      depth: z.number(),
      regDate: z.string(),
      previousDepartmentInfo: z.array(z.number()).nullable(),
    })
  ),
});

// 구성원 조회
export const UserListResSchema = z.array(
  z.object({
    userInfoIdx: z.number(),
    name: z.string(),
    departmentName: z.string(),
    departmentTempIdx: z.number(),
    titleCodeName: z.string(),
    titleCode: z.string(),
  })
);

// 구성원 변경이력 조회
export const UserLogResSchema = z.array(
  z.object({
    userName: z.string(),
    newDepartmentTempIdx: z.number().nullable(),
    newDepartmentTitleCode: z.string().nullable(),
    newDepartmentName: z.string().nullable(),
    newTitleCode: z.string().nullable(),
    preDepartmentName: z.string(),
    preDepartmentTempIdx: z.number(),
    preTitleCode: z.string(),
    regDate: z.string(),
    restructureCode: z.string(),
    userInfoIdx: z.number(),
    departmentUserRelationTempIdx: z.number(),
  })
);

// 임시저장 요청
export const TempNewDepartmentSchema = z.object({
  id: z.number().optional(),
  cmmnCode: z.string(),
  cmmnCodeDetail: z.string(),
  departmentName: z.string(),
  departmentTempIdx: z.number().optional(),
  depth: z.number(),
  parentDepartmentTempIdx: z.number(),
  regDate: z.string(),
  previousDepartmentInfo: z.array(z.number()).nullable(),
});

export const TempDeletedDepartmentSchema = z.object({
  id: z.number().optional(),
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

export const TempUserSchema = z.object({
  userName: z.string(),
  departmentUserRelationTempIdx: z.number(),
  newDepartmentTempIdx: z.number().nullable(),
  newDepartmentTitleCode: z.string().nullable(),
  newTitleCode: z.string().nullable(),
  preDepartmentTempIdx: z.number(),
  preTitleCode: z.string(),
  restructureCode: z.string(),
  userInfoIdx: z.number(),
  regDate: z.string(),
});

export const TempStorageReqSchema = z.object({
  reqRestructureDepartmentDTO: z.object({
    deleteDepartmentList: z.array(TempDeletedDepartmentSchema).nullable(),
    newDepartmentList: z.array(TempNewDepartmentSchema).nullable(),
  }),
  reqRestructureUserDTO: z.array(TempUserSchema).nullable(),
});

export type TempStorageReqType = z.infer<typeof TempStorageReqSchema>