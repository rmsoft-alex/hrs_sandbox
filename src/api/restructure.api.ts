import { fetchWithZod } from "@/utils/fetch";
import {
  DepartmentListResSchema,
  DepartmentLogResSchema,
  TempStorageReqSchema,
  TempStorageReqType,
  UserListResSchema,
  UserLogResSchema,
} from "./restructure.api.schema";

//부서조회
export async function getDepList() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/restructure/dep/list",
    null,
    {
      isCheckedServer: false,
      responseSchema: DepartmentListResSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }

  return response.data;
}

//구성원 조회
export async function getUserList() {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/restructure/user/list`,
    null,
    {
      isCheckedServer: false,
      responseSchema: UserListResSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }

  return response.data;
}

// 부서 변경 이력 조회
export async function getDepartmentLog() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/restructure/dep/log/list",
    null,
    {
      isCheckedServer: false,
      responseSchema: DepartmentLogResSchema,
    }
  );
  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }

  return response.data;
}

// 구성원 변경 이력 조회
export async function getUserLog() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/restructure/user/log/list",
    null,
    {
      isCheckedServer: false,
      responseSchema: UserLogResSchema,
    }
  );
  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }

  return response.data;
}

// 임시저장
export async function postTempData(data: TempStorageReqType) {
  console.log(JSON.stringify(data));
  console.log(data);
  const response = await fetchWithZod(
    "POST",
    `admin/v1/api/restructure/temp`,
    data,
    {
      isCheckedServer: false,
      requestSchema: TempStorageReqSchema,
    }
  );
  console.log(response); // 에러코드 1000...??
  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }
  return response.data;
}

// 개편 이력 초기화
export async function postResetTemsData() {
  const response = await fetchWithZod(
    "POST",
    `admin/v1/api/restructure/reset`,
    null,
    {
      isCheckedServer: false,
    }
  );
  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }

  console.log(response);
  return response.data;
}

// 최종 반영
export async function postComplateRestructure(textInput: string) {
  const response = await fetchWithZod(
    "POST",
    `admin/v1/api/restructure/complete`,
    { description: textInput === "" ? null : textInput.trim() },
    {
      isCheckedServer: false,
    }
  );

  console.log(response);
  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`서버 응답 코드: ${response.code}`);
  }

  return response.data;
}