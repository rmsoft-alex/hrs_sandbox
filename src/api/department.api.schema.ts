import * as z from "zod";

export const Listschema = z.object({
  listFilter: z.string().max(1),
});

//부서조회
export const DeptListResSchema = z.array(
  z.object({
    id: z.number(),
    text: z.string(),
    parent: z.number(),
    data: z.object({
      departmentSize: z.number(),
      regulationOrder: z.number(),
      deactivationStatus: z.string(),
      restructureIdx: z.number().nullable().optional(),
    }),
  })
);

//부서 상세 유저리스트
export const deptDetailUserListSchema = z.object({
  relationIdx: z.number(),
  userInfoIdx: z.number(),
  name: z.string(),
  titleCode: z.string(),
  titleCodeName: z.string(),
  departmentTitleCode: z.string(),
  departmentTitleCodeName: z.string(),
  mainDepartment: z.string(),
});

//부서상세
export const DeptDetailResSchema = z.object({
  departmentIdx: z.number(),
  name: z.string(),
  size: z.number(),
  deactivationStatus: z.string(),
  regulationOrder: z.number(),
  regDate: z.string(),
  updtDate: z.string().nullable().optional(),
  parentDepartmentIdx: z.number().nullable(),
  parentDepartmentName: z.string().nullable(),
  preDepartmentList: z.array(
    z.object({
      preDepartmentIdx: z.number(),
      preDepartmentName: z.string(),
      preRegulationOrder: z.number(),
    })
  ),
  userList: z.array(deptDetailUserListSchema),
});

//부부서원관리검색
export const searchSchema = z.object({
  search: z.string(),
  searchValue: z.string(),
});

//전체구성원리스트
export const getAllMemberSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  departmentTitleCode: z.string(),
  departmentTitleCodeName: z.string(),
  name: z.string(),
  titleCode: z.string(),
  titleCodeName: z.string(),
  userInfoIdx: z.number(),
});

export const getallMemResponseSchema = z.array(getAllMemberSchema);

//부서의 기존 부부서원
export const getincludeSchema = z.object({
  departmentIdx: z.number(),
  departmentTitleCode: z.string(),
  departmentTitleCodeName: z.string(),
  mainDepartment: z.string(),
  name: z.string(),
  titleCode: z.string(),
  titleCodeName: z.string().nullable(),
  userInfoIdx: z.number(),
  relationIdx: z.number(),
  departmentName: z.string(),
});

export const getincludeResponseSchema = z.array(getincludeSchema);

//부부서원리스트
export const reqFinalMemberSchema = z.object({
  departmentIdx: z.number(),
  departmentName: z.string(),
  departmentTitleCode: z.string(),
  departmentTitleCodeName: z.string(),
  mainDepartment: z.string(),
  name: z.string(),
  relationIdx: z.number(),
  subDepartmentIdx: z.number(),
  subDepartmentName: z.string(),
  subDepartmentTitleCode: z.string(),
  subDepartmentTitleCodeName: z.string(),
  subTitleCode: z.string(),
  subTitleCodeName: z.string(),
  titleCode: z.string(),
  // titleCodeName: z.string().nullable(),
  titleCodeName: z.string(),
  userInfoIdx: z.number(),
  crudOperationType: z.string(),
});

//부부서원리스트 수정
export const memberChangeSchema = z.object({
  departmentIdx: z.number(),
  regulationOrder: z.number(),
  udateDepartmentUserList: z.array(
    z.object({
      userInfoIdx: z.number(),
      relationIdx: z.number(),
      titleCode: z.string(),
      mainDepartment: z.string(),
      crudOperationType: z.string(),
    })
  ),
});

export type DeptListResType = z.infer<typeof DeptListResSchema>;
export type searchType = z.infer<typeof searchSchema>;
export type getAllMemberType = z.infer<typeof getAllMemberSchema>;
export type getallMemResponseType = z.infer<typeof getallMemResponseSchema>;
export type deptDetailResType = z.infer<typeof DeptDetailResSchema>;
export type deptDetailUserListType = z.infer<typeof deptDetailUserListSchema>;
export type getIncludetType = z.infer<typeof getincludeSchema>;
export type reqFinalMemberType = z.infer<typeof reqFinalMemberSchema>;
export type memberChangeType = z.infer<typeof memberChangeSchema>;
