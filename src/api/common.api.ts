import * as z from "zod";
import { fetchWithZod } from "@/utils/fetch";
import {
  DeptListSchema,
  CommonCodeSchema,
  loginReqSchema,
  loginResSchema,
} from "./common.api.schema";

export async function login(data: z.infer<typeof loginReqSchema>) {
  const response = await fetchWithZod(
    "POST",
    "admin/v1/api/login",
    {
      userId: data.userId,
      userPassword: data.userPassword,
    },
    {
      requestSchema: loginReqSchema,
      responseSchema: loginResSchema,
      isCheckedServer: false,
    }
  );

  switch (response.code) {
    case 100:
      break;
  }

  return response.data;
}

export async function logout() {
  return await fetchWithZod("POST", "admin/v1/api/logout", null, {
    responseSchema: z.null(),
  });
}

// 직위
export async function getTitle() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs02",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

// 직책
export async function getDeptTitle() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs01",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getDept() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/department/list",
    { deactivateStatus: "N" },
    {
      isCheckedServer: false,
      responseSchema: DeptListSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

// 사용자 변경 이력 코드
export async function getUsrLogLabel() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs0301",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

// 부서 변경 이력 코드
export async function getDeptLogLabel() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs0302",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

// 조직 개편 - 부서 신설 이력 코드
export async function getNewDeptLogLabel() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs03030101",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

// 조직 개편 - 부서 폐지 이력 코드
export async function getDeleteDeptLogLabel() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs03030102",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

// 조직 개편 - 사용자 변경 이력 코드
export async function getDeptUsrLogLabel() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/common/list?commonCode=hrs030302",
    null,
    {
      isCheckedServer: false,
      responseSchema: CommonCodeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}
