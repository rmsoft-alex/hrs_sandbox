import * as z from "zod";

//등록폼
export const formSchema = z.object({
  title: z.string().min(1),
});

//시스템등록
export const SystemAddSchema = z.object({
  systemName: z.string(),
  systemDomain: z.string(),
  active: z.string(),
  description: z.string(),
});

//시스템상세조회
export const SystemDataSchema = z.object({
  systemIdx: z.number(),
  systemCode: z.string(),
  systemName: z.string(),
  systemDomain: z.string(),
  active: z.string(),
  description: z.string(),
  regDate: z.string(),
  updtDate: z.string().nullable(),
});

//시스템수정
export const SystemEditSchema = z.object({
  systemIdx: z.number(),
  systemName: z.string(),
  systemDomain: z.string(),
  active: z.string(),
  description: z.string(),
});

//시스템리스트조회 객체
export const GetSystemItem = z.object({
  systemIdx: z.number(),
  systemCode: z.string(),
  systemName: z.string(),
  systemDomain: z.string(),
  description: z.string(),
  active: z.string(),
  regDate: z.string(),
  updtDate: z.nullable(z.string()),
});

//시스템리스트조회 전체
export const GetSystemListSchema = z.object({
  itemCnt: z.nullable(z.number()),
  itemList: z.array(GetSystemItem),
});

export type SystemAddType = z.infer<typeof SystemAddSchema>;
// export type SystemEditType = z.infer<typeof SystemDataSchema>;
export type SystemEditType = z.infer<typeof SystemEditSchema>;
export type SystemListType = z.infer<typeof GetSystemListSchema>;
export type SystemItemType = z.infer<typeof GetSystemItem>;
