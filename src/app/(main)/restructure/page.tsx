/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import StepCreation from "./components/Creation/StepCreation";
import StepAbolition from "./components/Abolition/StepAbolition";
import StepTransLocation from "./components/TransLocation/StepTransLocation";
import TopBar from "./components/TopBar/TopBar";
import { useRestructureActions, useStep } from "./store/useRestructureStore";
import { useEffect, useState } from "react";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import { useQuery } from "@tanstack/react-query";
import {
  getDepList,
  getDepartmentLog,
  getUserList,
  getUserLog,
} from "@/api/restructure.api";

const Restructure = () => {
  const step = useStep();
  const {
    setStep,
    setTree,
    setUpdatedTree,
    setMemberGroup,
    setCreationHistory,
    setAbolitionHistory,
    setMemberHistory,
    setTempStorage,
  } = useRestructureActions();

  const [refreshKey, setRefreshKey] = useState(false);

  const { data: depList, isSuccess: depListIsSuccess } = useQuery({
    queryKey: ["departmentTree", refreshKey],
    queryFn: getDepList,
    refetchInterval: 1000 * 60 * 5,
  });
  const { data: userList, isSuccess: userListIsSuccess } = useQuery({
    queryKey: ["userList", refreshKey],
    queryFn: getUserList,
    refetchInterval: 1000 * 60 * 5,
  });

  const {
    data: departmentLog,
    isSuccess: depLogIsSuccess,
    isPending: depIsPending,
  } = useQuery({
    queryKey: ["departmentLog", refreshKey],
    queryFn: getDepartmentLog,
    refetchInterval: 1000 * 60 * 5,
  });

  const {
    data: userLog,
    isSuccess: userLogIsSuccess,
    isPending: userIsPending,
  } = useQuery({
    queryKey: ["userLog", refreshKey],
    queryFn: getUserLog,
    refetchInterval: 1000 * 60 * 5,
  });

  const refresh = () => {
    // 임시저장 완료 후 전체 API 재조회
    setRefreshKey((prev) => !prev);
  };

  useEffect(() => {
    // 부서목록 저장
    if (depListIsSuccess) {
      setTree(depList);
      setUpdatedTree(depList);
    }
  }, [depList, depListIsSuccess]);

  useEffect(() => {
    // 구성원 목록 저장
    if (userListIsSuccess) {
      setMemberGroup(userList);
    }
  }, [userList, userListIsSuccess]);

  useEffect(() => {
    // 부서 이력 저장
    if (depLogIsSuccess) {
      // console.log(departmentLog);
      if (departmentLog) {
        setCreationHistory(departmentLog.newDepartmentList);
        setAbolitionHistory(departmentLog.deleteDepartmentList);
      } else {
        setCreationHistory([]);
        setAbolitionHistory([]);
      }
    }
  }, [departmentLog, depLogIsSuccess]);

  useEffect(() => {
    // 구성원 이력 저장
    if (userLogIsSuccess) {
      setMemberHistory(userLog);
    }
  }, [userLog, userLogIsSuccess]);

  useEffect(() => {
    // 부서생성이력 + 부서폐지이력 + 구성원 변경이력 => 임시저장데이터
    if (depLogIsSuccess && userLogIsSuccess) {
      const newDep = departmentLog
        ? departmentLog.newDepartmentList.length === 0
          ? null
          : departmentLog.newDepartmentList
        : null;
      const deleteDep = departmentLog
        ? departmentLog.deleteDepartmentList.length === 0
          ? null
          : departmentLog.deleteDepartmentList
        : null;
      const user = userLog.length === 0 ? null : userLog;
      setTempStorage({
        reqRestructureDepartmentDTO: {
          deleteDepartmentList: deleteDep,
          newDepartmentList: newDep,
        },
        reqRestructureUserDTO: user,
      });
    }
  }, [
    depLogIsSuccess,
    userLogIsSuccess,
    departmentLog,
    userLog,
    setTempStorage,
  ]);

  useEffect(() => {
    // 조직개편 페이지 언마운트 시 (다른 페이지 이동 시) 탭 위치 부서생성 탭으로 복구
    return () => {
      setStep("Creation");
    };
  }, [setStep]);
  return (
    <div className="px-10 py-8 h-full">
      <LocationHeader firstTitle="조직개편" />
      <TopBar refresh={refresh} />
      <div>
        {step === "Creation" && (
          <StepCreation refresh={refresh} isPending={depIsPending} />
        )}
        {step === "Abolition" && (
          <StepAbolition refresh={refresh} isPending={depIsPending} />
        )}
        {step === "TransLocation" && (
          <StepTransLocation isPending={userIsPending} />
        )}
      </div>
    </div>
  );
};

export default Restructure;
