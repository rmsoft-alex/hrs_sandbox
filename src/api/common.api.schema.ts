import { z } from "zod";

export const loginReqSchema = z.object({
  userId: z.string().trim(),
  userPassword: z.string().trim(),
});

export const loginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: z.string(),
});

export const CommonCodeSchema = z
  .object({
    commonCode: z.string(),
    commonCodeName: z.string(),
  })
  .array();

export const DeptSchema = z.object({
  id: z.number(),
  text: z.string(),
  parent: z.number(),
});

export const DeptListSchema = z.array(DeptSchema);
