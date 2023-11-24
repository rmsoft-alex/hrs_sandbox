import * as z from "zod";

export const taskSchema = z.object({
  syncIdx: z.number(),
  success: z.string(),
  description: z.string(),
  syncTitle: z.string(),
  regDate: z.string(),
  regBy: z.string(),
});

export type SyncState = z.infer<typeof taskSchema>;

//동기화 조회
export const SyncListSchema = z.object({
  code: z.number(),
  message: z.string(),
  itemList: z.array(
    z.object({
      syncIdx: z.number(),
      success: z.string(),
      description: z.string(),
      syncTitle: z.string(),
      regDate: z.string(),
      regBy: z.string(),
    })
  ),
  itemCnt: z.number(),
});

export type SyncListType = z.infer<typeof SyncListSchema>;
