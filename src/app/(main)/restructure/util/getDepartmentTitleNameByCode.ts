import { DepartmentTitleCodeEnum } from "../types";

export const getDepartmentTitleNameByCode = (
  code: string | undefined | null
) => {
  if (!code) return "null";
  return (
    DepartmentTitleCodeEnum.find((codeEnum) => codeEnum.code === code)?.label ||
    "undefined"
  );
};
