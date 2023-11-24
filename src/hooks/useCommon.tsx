import { UseQueryResult, useQuery } from "@tanstack/react-query";

import {
  getDeleteDeptLogLabel,
  getDept,
  getDeptLogLabel,
  getDeptTitle,
  getDeptUsrLogLabel,
  getNewDeptLogLabel,
  getTitle,
  getUsrLogLabel,
} from "@/api/common.api";
import { CommonCode, DeptList, ErrorType } from "@/types/type";

export function useDept() {
  // 부서 조회
  const {
    data: deptList,
  }: UseQueryResult<DeptList, ErrorType<object>> = useQuery({
    queryKey: ["department"],
    queryFn: () =>
      getDept()
        .then((res) => res?.data ?? [])
        .catch(() => []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getDeptName = (departmentIdx: number): string =>
    deptList?.find(({ id }: { id: number }) => id === departmentIdx)?.text ||
    "";

  return { deptList, getDeptName };
}

export function useTitle() {
  // 직위 조회
  const {
    data: titleList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["userTitle"],
    queryFn: () => getTitle().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getTitleName = (titleCode: string): string =>
    titleList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === titleCode
    )?.commonCodeName || "";

  return { titleList, getTitleName };
}

export function useDeptTitle() {
  // 직책 조회
  const {
    data: deptTitleList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["departmentList"],
    queryFn: () => getDeptTitle().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getDeptTitleName = (titleCode: string): string =>
    deptTitleList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === titleCode
    )?.commonCodeName || "";

  return { deptTitleList, getDeptTitleName };
}

export function useUsrLogLabel() {
  // 사용자 변경 이력 조회
  const {
    data: usrLogList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["usrLogName"],
    queryFn: () => getUsrLogLabel().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getUsrLogLabelName = (logCode: string): string =>
    usrLogList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === logCode
    )?.commonCodeName || "";

  return { usrLogList, getUsrLogLabelName };
}

export function useDeptLogLabel() {
  // 부서 변경 이력 조회
  const {
    data: deptLogList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["deptLogName"],
    queryFn: () => getDeptLogLabel().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getDeptLogLabelName = (logCode: string): string =>
    deptLogList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === logCode
    )?.commonCodeName || "";

  return { deptLogList, getDeptLogLabelName };
}

export function useNewDeptLogLabel() {
  // 조직 개편 - 부서 신설 이력 코드
  const {
    data: newDeptLogList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["newDeptLogName"],
    queryFn: () => getNewDeptLogLabel().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getNewDeptLogLabelName = (logCode: string): string =>
    newDeptLogList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === logCode
    )?.commonCodeName || "";

  return { newDeptLogList, getNewDeptLogLabelName };
}

export function useDeleteDeptLogLabel() {
  // 조직 개편 - 부서 폐지 이력 코드
  const {
    data: deleteDeptLogList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["deleteDeptLogName"],
    queryFn: () => getDeleteDeptLogLabel().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getDeleteDeptLogLabelName = (logCode: string): string =>
    deleteDeptLogList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === logCode
    )?.commonCodeName || "";

  return { deleteDeptLogList, getDeleteDeptLogLabelName };
}

export function useDeptUsrLogLabel() {
  // 조직 개편 - 부서 사용자 변경 이력 코드
  const {
    data: deptUsrLogList,
  }: UseQueryResult<CommonCode, ErrorType<object>> = useQuery({
    queryKey: ["deptUsrLogName"],
    queryFn: () => getDeptUsrLogLabel().then((res) => res?.data ?? []),
    refetchInterval: 1000 * 60 * 5,
  });

  const getDeptUsrLogLabelName = (logCode: string): string =>
    deptUsrLogList?.find(
      ({ commonCode }: { commonCode: string }) => commonCode === logCode
    )?.commonCodeName || "";

  return { deptUsrLogList, getDeptUsrLogLabelName };
}
