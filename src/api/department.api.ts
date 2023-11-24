import {
  DeptDetailResSchema,
  DeptListResSchema,
  getallMemResponseSchema,
  getincludeResponseSchema,
  memberChangeSchema,
  memberChangeType,
} from "./department.api.schema";
import { fetchWithZod } from "@/utils/fetch";

//부서조회
export async function getDeptList() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/department/list",
    null,
    {
      isCheckedServer: false,
      responseSchema: DeptListResSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
  }

  return response.data;
}
//부서상세
export async function getDeptDetail(
  departmentIdx: number,
  isSubInclude: string = "N"
) {
  const queryParams = new URLSearchParams({ isSubInclude });

  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/department/${departmentIdx}?${queryParams.toString()}`,
    {
      departmentIdx,
      isSubInclude,
    },
    {
      isCheckedServer: false,
      responseSchema: DeptDetailResSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response.data;
}
//부서모달 전체구성원
export async function getAllMember() {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/department/user/list`,
    // {
    //   departmentId,
    // },
    null,
    {
      isCheckedServer: false,
      responseSchema: getallMemResponseSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
  }

  return response.data;
}
// 부서의 기존 부부서원
export async function getIncludeMember(departmentIdx: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/department/${departmentIdx}/subMember`,
    // {
    //   departmentIdx,
    // },
    null,
    {
      isCheckedServer: false,
      responseSchema: getincludeResponseSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response.data;
}
//부서 정보 수정
export async function putMemberChange(reqMemData: memberChangeType) {
  const response = await fetchWithZod(
    "PUT",
    "admin/v1/api/department/update",
    // {
    //   departmentId,
    // },
    reqMemData,
    {
      isCheckedServer: false,
      responseSchema: memberChangeSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    // 나머지 에러 코드 응답 처리
    // case 604:
    //   throw new Error("잘못된 접근입니다.");
    // case 1000:
    //   throw new Error("잘못된 접근입니다.");
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response;
}
