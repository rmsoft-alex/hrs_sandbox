import * as z from "zod";
import { useUsrDeptState } from "../store/useUserDeptStore";
import { useChangedUserAction } from "../store/useChangedUserStore";
import { useModalAction } from "../store/useModalStore";
import { UsrDtlRes } from "../type";
import dayjs from "dayjs";

import { useToast } from "@/components/ui/use-toast";

type Props = {
  mode: "edit" | "register";
  userInfo?: UsrDtlRes;
  selectedTitleCode: string;
};

export const FormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "최소 2글자 필수값입니다." })
    .max(100, { message: "최대 100글자입니다." })
    .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/, {
      message: "특수문자를 포함할 수 없습니다.",
    }),
  userId: z
    .string()
    .trim()
    .min(2, { message: "최소 2글자 필수값입니다." })
    .max(100, { message: "최대 100글자입니다." })
    .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/, {
      message: "특수문자를 포함할 수 없습니다.",
    }),
  nickname: z.union([
    z.null(),
    z.literal(""),
    z
      .string()
      .min(2, { message: "최소 2글자입니다." })
      .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/, {
        message: "특수문자를 포함할 수 없습니다.",
      }),
  ]),
  employeeNumber: z.union([
    z.null(),
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/, {
        message: "특수문자를 포함할 수 없습니다.",
      }),
  ]),
  gender: z.enum(["MALE", "FEMALE"]),
  activeStatus: z.enum(["Y", "N"]),
  titleCode: z.string().min(1, { message: "필수값입니다." }),
  birth: z.string().min(1, { message: "필수값입니다." }),
});

export const useUserForm = ({ mode, userInfo, selectedTitleCode }: Props) => {
  const { toast } = useToast();
  const userDept = useUsrDeptState();
  const { setNewUser, setUpdatedUser } = useChangedUserAction();
  const { setIsRegisterModalOpen, setIsFirstEditModalOpen } = useModalAction();

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const mainDept = userDept.filter((el) => el.mainDepartmentYn === "Y");
    const checkedMainDept = userDept.map((el) => el.mainDepartmentYn);
    const deptTitle = userDept.map((el) => el.departmentTitleCode);

    if (checkedMainDept.includes(undefined)) {
      toast({
        variant: "destructive",
        title: "주 부서",
        description: "주 부서 여부 선택은 필수입니다.",
        duration: 3000,
      });
    } else if (mainDept.length !== 1) {
      toast({
        variant: "destructive",
        title: "주 부서",
        description: "주 부서는 반드시 한 개만 있어야 합니다.",
        duration: 3000,
      });
    } else if (deptTitle.includes(undefined)) {
      toast({
        variant: "destructive",
        title: "직책",
        description: "부서별 직책 선택은 필수입니다.",
        duration: 3000,
      });
    } else if (mode === "register") {
      setNewUser({
        activeStatus: values.activeStatus,
        birth: dayjs(values.birth).format("YYYY-MM-DD").toString(),
        employeeNumber: values.employeeNumber || null,
        gender: values.gender,
        name: values.name,
        nickname: values.nickname || null,
        titleCode: selectedTitleCode.toUpperCase(),
        userId: values.userId,
        userDepartmentRelationList: userDept.map(
          ({ departmentIdx, departmentTitleCode, mainDepartmentYn }) => ({
            departmentIdx,
            departmentTitleCode,
            mainDepartmentYn,
          })
        ),
      });
      setIsRegisterModalOpen(true);
    } else if (mode === "edit" && userInfo?.userInfoIdx) {
      const prevDeptIdx = userInfo.departmentUserRelations.map(
        ({ relationIdx }) => relationIdx
      );
      const currentDeptIdx = userDept
        .filter(({ relationIdx }) => !!relationIdx)
        .map(({ relationIdx }) => relationIdx);
      const deletedDeptIdx = prevDeptIdx.filter(
        (idx) => idx && !currentDeptIdx.includes(idx)
      );
      const sameDeptIdx = prevDeptIdx.filter(
        (idx) => idx && currentDeptIdx.includes(idx)
      );
      const sameDept = userDept.filter(
        ({ relationIdx }) => relationIdx && sameDeptIdx.includes(relationIdx)
      );

      // 삭제된 부서들
      const deletedDept = userInfo.departmentUserRelations
        .filter(({ relationIdx }) => deletedDeptIdx.includes(relationIdx))
        .map(
          ({
            departmentIdx,
            departmentTitleCode,
            mainDepartment,
            relationIdx,
          }) => ({
            departmentIdx,
            departmentTitleCode,
            relationIdx,
            crudOperationType: "DELETE",
            mainDepartmentYn: mainDepartment,
          })
        );
      // 추가된 부서들
      const addedDept = userDept
        .filter(({ relationIdx }) => !relationIdx)
        .map(
          ({
            departmentIdx,
            departmentTitleCode,
            mainDepartmentYn,
            relationIdx,
          }) => ({
            departmentIdx,
            departmentTitleCode,
            relationIdx,
            mainDepartmentYn,
            crudOperationType: "INSERT",
          })
        );
      // 업데이트 된 부서들
      const updatedDept = sameDept
        .filter(({ relationIdx, departmentTitleCode, mainDepartmentYn }) => {
          const prevDept = userInfo.departmentUserRelations.find(
            (el) => el.relationIdx === relationIdx
          );
          return (
            prevDept?.departmentTitleCode !== departmentTitleCode ||
            prevDept?.mainDepartment !== mainDepartmentYn
          );
        })
        .map(
          ({
            departmentIdx,
            departmentTitleCode,
            mainDepartmentYn,
            relationIdx,
          }) => ({
            departmentIdx,
            departmentTitleCode,
            relationIdx,
            mainDepartmentYn,
            crudOperationType: "UPDATE",
          })
        );

      // 변경된 사항있는지 체크
      if (
        !addedDept.length &&
        !updatedDept.length &&
        !deletedDept.length &&
        userInfo.activeStatus === values.activeStatus &&
        userInfo.employeeNumber === values.employeeNumber &&
        userInfo.name === values.name &&
        userInfo.nickname === values.nickname &&
        userInfo?.titleCode === selectedTitleCode?.toUpperCase()
      ) {
        toast({
          variant: "destructive",
          title: "사용자 수정",
          description: "수정된 값이 없습니다.",
          duration: 3000,
        });
      } else {
        // 삭제, 수정, 추가된 userlist 취합
        setUpdatedUser({
          userInfoIdx: userInfo.userInfoIdx,
          activeStatus: values.activeStatus,
          employeeNumber: values?.employeeNumber || null,
          name: values.name,
          nickname: values?.nickname || null,
          userDescription: null,
          titleCode: selectedTitleCode.toUpperCase(),
          userDepartmentRelationList: [
            ...addedDept,
            ...updatedDept,
            ...deletedDept,
          ],
        });
        setIsFirstEditModalOpen(true);
      }
    }
  };

  return { onSubmit };
};

export const defaultValue: {
  name: string;
  userId: string;
  nickname: string | null;
  employeeNumber: string | null;
  gender: "MALE" | "FEMALE";
  activeStatus: "Y" | "N";
  titleCode: string;
  birth: string;
} = {
  name: "",
  userId: "",
  nickname: null,
  employeeNumber: null,
  gender: "MALE",
  activeStatus: "Y",
  titleCode: "",
  birth: "",
};
