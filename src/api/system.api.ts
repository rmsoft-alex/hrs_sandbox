import {
  SystemAddSchema,
  SystemAddType,
  SystemDataSchema,
  SystemEditType,
  GetSystemListSchema,
} from "./system.api.schema";
import { fetchWithZod } from "@/utils/fetch";
import * as z from "zod";

//시스템등록
export async function postSystemAdd(reqData: SystemAddType) {
  const response = await fetchWithZod(
    "POST",
    "admin/v1/api/system/save",
    // {
    //   departmentId,
    // },
    reqData,
    {
      isCheckedServer: false,
      responseSchema: SystemAddSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response;
}

//시스템상세
export async function getSystemData(projectIdx: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/system/${projectIdx}`,
    // {
    //   departmentId,
    // },
    null,
    {
      isCheckedServer: false,
      responseSchema: SystemDataSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    // case 604:
    //   throw new Error("잘못된 접근입니다.");
    // case 1000:
    //   throw new Error("잘못된 접근입니다.");
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response.data;
}

//시스템수정
export async function putSystemEdit(reqEditData: SystemEditType) {
  const response = await fetchWithZod(
    "PUT",
    "admin/v1/api/system/update",
    // {
    //   departmentId,
    // },
    reqEditData,
    {
      isCheckedServer: false,
      responseSchema: SystemAddSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response;
}

//시스템 리스트 조회
export async function getSystemList(
  pageIndex: number,
  pageSize: number,
  sorting?: { id: string; desc: boolean },
  systemCode: string = "",
  systemName: string = "",
  systemDomain: string = ""
) {
  const sortType = sorting
    ? sorting.id === "systemCode"
      ? "SYSTEM_CODE"
      : sorting.id === "systemName"
      ? "SYSTEM_NAME"
      : sorting.id === "systemDomain"
      ? "SYSTEM_DOMAIN"
      : sorting.id === "active"
      ? "SYSTEM_ACTIVE"
      : sorting.id === "updtDate"
      ? "UPDATE_DATE"
      : "REG_DATE"
    : "REG_DATE";
  const orderByType = sorting
    ? sorting.desc === true
      ? "DESC"
      : "ASC"
    : "DESC";

  const queryString = {
    pageNum: pageIndex + 1,
    pageSize,
    sortType,
    orderByType,
    systemCode,
    systemName,
    systemDomain,
  };
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/system/list",
    queryString,
    {
      isCheckedServer: false,
      responseSchema: GetSystemListSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response;
}

//시스템삭제
export async function deleteSystem(reqSystemIdx: number[]) {
  const response = await fetchWithZod(
    "DELETE",
    "admin/v1/api/system/delete",
    // {
    //   departmentId,
    // },
    reqSystemIdx,
    {
      isCheckedServer: false,
      responseSchema: z.number(),
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    default:
      throw new Error(`에러 코드: ${response.code}`);
  }

  return response;
}
