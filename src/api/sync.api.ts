import { fetchWithZod } from "@/utils/fetch";
import { DateRange } from "react-day-picker";
import { GetSyncResSchema, PostSyncResSchema } from "./sync.api.schema";
import { formatUTC } from "@/utils/format";

//전체 조회 (검색, 정렬)
export async function getSyncList(
  pageIndex: number,
  pageSize: number,
  success: string,
  regBy: string,
  regDate: DateRange | undefined | { [key: string]: string },
  sorting?: { id: string; desc: boolean }
) {
  const sortType = sorting
    ? sorting.id === "regBy"
      ? "SYNC_TITLE"
      : sorting.id === "regDate"
      ? "REG_DATE"
      : sorting.id?.toUpperCase()
    : "REG_DATE";
  const orderByType = sorting
    ? sorting.desc === true
      ? "DESC"
      : "ASC"
    : "DESC";

  const queryStartDate = regDate?.from
    ? formatUTC(new Date(regDate?.from))
    : "";
  const endDate = regDate?.to ? new Date(regDate.to) : undefined;
  const queryEndDate = endDate
    ? formatUTC(new Date(endDate.setDate(endDate.getDate() + 1)))
    : "";

  const queryString = {
    pageNum: pageIndex + 1,
    pageSize,
    sortType,
    orderByType,
    success,
    regBy,
    startDate: queryStartDate || "",
    endDate: queryEndDate || "",
  };

  const response = await fetchWithZod(
    "GET",
    "admin/v1/api/sync/list",
    queryString,
    {
      isCheckedServer: false,
      responseSchema: GetSyncResSchema,
    }
  );

  switch (response.code) {
    case 100:
      // 정상 응답
      break;
    // 나머지 에러 코드 응답 처리
  }

  return response.data;
}

//동기화 요청 보내는 post
export async function postSyncList(
  data: Array<{
    syncIdx: number;
    success: string;
    syncTitle: string;
    regDate: string;
    regBy: string;
  }>
) {
  const response = await fetchWithZod(
    "POST",
    "admin/v1/api/sync/req",
    { data },
    {
      isCheckedServer: false,
      responseSchema: PostSyncResSchema,
    }
  );

  switch (response.code) {
    case 100:
      break;
    // 나머지 에러 코드 응답 처리
    case 200:
      throw new Error("동기화 등록에 실패했습니다.");
  }

  return response.data;
}
