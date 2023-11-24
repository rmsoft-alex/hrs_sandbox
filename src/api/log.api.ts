import { fetchWithZod } from "@/utils/fetch";
import {
  GetDegreeSchema,
  GetDeptLogsResSchema,
  GetLogsResSchema,
  GetReorganizationLogsResSchema,
  GetUsrLogsResSchema,
} from "./log.api.schema";

export async function getLogs(pageIndex: number, pageSize: number) {
  const queryString = {
    pageNum: pageIndex + 1,
    pageSize,
  };

  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/log/list",
    queryString,
    {
      isCheckedServer: false,
      responseSchema: GetLogsResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getDegree() {
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/log/get/degree",
    null,
    {
      isCheckedServer: false,
      responseSchema: GetDegreeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function putDegree(reqDegree: {
  degree: string;
  logInfoIdxList: Array<number> | [];
}) {
  const response = await fetchWithZod(
    "PUT",
    "admin/v1/api/log/delete/degree",
    reqDegree,
    {
      isCheckedServer: false,
      responseSchema: GetDegreeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function postDegree(reqDegree: {
  degree: string;
  logInfoIdxList: Array<number> | [];
}) {
  const response = await fetchWithZod(
    "POST",
    "admin/v1/api/log/set/degree",
    reqDegree,
    {
      isCheckedServer: false,
      responseSchema: GetDegreeSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getDeptLogById(logInfoIdx: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/log/department/${logInfoIdx}`,
    null,
    {
      isCheckedServer: false,
      requestSchema: GetDeptLogsResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getUsrLogById(logInfoIdx: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/log/user/${logInfoIdx}`,
    null,
    {
      isCheckedServer: false,
      requestSchema: GetUsrLogsResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getReorganizationLogById(logInfoIdx: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/log/restructure/${logInfoIdx}`,
    null,
    {
      isCheckedServer: false,
      requestSchema: GetReorganizationLogsResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}
