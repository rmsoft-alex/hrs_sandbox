import * as z from "zod";

//동기화 조회
export const GetSyncResSchema = z.object({
  code: z.number(),
  message: z.string(),
  itemList: z.array(
    z.object({
      syncIdx: z.number(),
      success: z.enum(["Y", "N"]),
      syncTitle: z.string(),
      description: z.string(),
      regBy: z.string(),
      regDate: z.string(),
    })
  ),
  itemCnt: z.number(),
});

//동기화 요청 보내기
export const PostSyncResSchema = z.object({
  code: z.number(),
  message: z.string(),
  itemList: z.array(
    z.object({
      syncIdx: z.number(),
      syncTitle: z.string(),
      description: z.string(),
      regDate: z.string(),
      regBy: z.string(),
    })
  ),
});
