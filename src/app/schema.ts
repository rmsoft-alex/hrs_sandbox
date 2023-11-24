import * as z from "zod";

export const PathSchema = z.string();
export const MethodSchema = z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]);
export const IncludesFileSchema = z.boolean().optional().default(false);
export const IsCheckSchema = z.boolean().optional().default(false);
