import { fetchWithZod } from "@/utils/fetch";
import {
  GetUsrDtlReqSchema,
  GetUsrDtlResSchema,
  GetUsrLogResSchema,
  GetUsrsResSchema,
  PutUsrsActStateReqSchema,
  UsrEditReqSchema,
  UsrRegisterReqSchema,
} from "./user.api.schema";
import { UsrEditReq, UsrRegisterReq } from "@/app/(main)/user/type";
import { DateRange } from "react-day-picker";
import { formatUTC } from "@/utils/format";

export async function getUsrs(
  pageIndex: number,
  pageSize: number,
  sorting?: { id: string; desc: boolean },
  name: string = "",
  userId: string = "",
  departmentNameList?: Array<string>,
  activeStatus?: Array<string | undefined>,
  regDate: DateRange | { [key: string]: string } = { from: "", to: "" }
) {
  const sortType = sorting
    ? sorting.id === "userId"
      ? "USER_ID"
      : sorting.id === "departmentName"
      ? "DEPARTMENT_NAME"
      : sorting.id === "regDate"
      ? "REG_DATE"
      : sorting.id?.toUpperCase()
    : "REG_DATE";
  const orderByType = sorting
    ? sorting.desc === true
      ? "DESC"
      : "ASC"
    : "DESC";

  const endDate = regDate.to ? new Date(regDate.to) : undefined;

  const queryString = {
    pageNum: pageIndex + 1,
    pageSize,
    sortType,
    orderByType,
    name,
    userId,
    activate: activeStatus?.length !== 1 ? "" : activeStatus[0],
    startDate: regDate?.from ? formatUTC(new Date(regDate.from)) : "",
    endDate: endDate
      ? formatUTC(new Date(endDate.setDate(endDate.getDate() + 1)))
      : "",
    departmentNameList: departmentNameList?.join("|"),
  };
  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/user/list",
    queryString,
    {
      isCheckedServer: false,
      responseSchema: GetUsrsResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function putUsrActState(
  userInfoIdxList: Array<number>,
  activeType: string
) {
  const response = await fetchWithZod(
    "PUT",
    `admin/v1/api/user/update/list?activeType=${activeType}`,
    userInfoIdxList,
    {
      isCheckedServer: false,
      requestSchema: PutUsrsActStateReqSchema,
      responseSchema: GetUsrsResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getUsrByIdx(userId: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/user/${userId}`,
    null,
    {
      isCheckedServer: false,
      requestSchema: GetUsrDtlReqSchema,
      responseSchema: GetUsrDtlResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function getUsrLog(userId: number) {
  const response = await fetchWithZod(
    "GET",
    `admin/v1/api/user/list/log/${userId}`,
    null,
    {
      isCheckedServer: false,
      requestSchema: GetUsrDtlReqSchema,
      responseSchema: GetUsrLogResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function postUsr(newUser: UsrRegisterReq) {
  const response = await fetchWithZod(
    "POST",
    "admin/v1/api/user/save",
    newUser,
    {
      isCheckedServer: false,
      requestSchema: UsrRegisterReqSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}

export async function putUsr(updatedUser: UsrEditReq) {
  const response = await fetchWithZod(
    "PUT",
    "admin/v1/api/user/update",
    updatedUser,
    {
      isCheckedServer: false,
      requestSchema: UsrEditReqSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response;
}
