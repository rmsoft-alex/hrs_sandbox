"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginInfo {
  userId: string;
  userPassword: string;
}

export default function Login() {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>({ mode: "onChange" || "onSubmit" });

  const [loginError, setLoginError] = useState(false);
  const [saveId, setSaveId] = useState(false);

  const router = useRouter();

  // 임시 저장 아이다 불러오는 useEffect
  useEffect(() => {
    if (localStorage.getItem("id")) {
      setSaveId(true);
      setValue("userId", localStorage.getItem("id") ?? "");
    }
  }, [setValue]);

  const handleLogin: SubmitHandler<LoginInfo> = async (data) => {
    // 로그인 fetch
    const res = await signIn("credentials", {
      userId: data.userId,
      userPassword: data.userPassword,
      redirect: false,
    });

    if (res?.ok) {
      if (saveId) {
        localStorage.setItem("id", watch("userId"));
      }
      router.push("/");
    } else {
      setLoginError(true);
    }
  };

  const handleLoginError = () => {
    setLoginError(false);
  };

  const handleSaveId = () => {
    setSaveId(!saveId);
    if (!saveId === false && localStorage.getItem("id")) {
      localStorage.removeItem("id");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <form
        className="flex flex-col items-center h-[452px]"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="text-[40px] font-bold text-orange-500">HRS</div>
        <div className="flex flex-col items-start h-[5rem] mt-[1.75rem]">
          <label htmlFor="userId" className="h-[1.25rem] text-[14px]">
            아이디
          </label>
          <input
            id="userId"
            type="text"
            placeholder="아이디"
            {...register("userId", {
              required: { value: true, message: "아이디를 입력해주십시오." },
              onChange: () => handleLoginError(),
            })}
            className={`w-[22.5rem] h-[3.125rem] text-[14px] placeholder:text-slate-400 border p-[0.625rem] mt-[0.62rem] rounded-[0.375rem] ${
              errors.userId || loginError ? "border-red-500" : ""
            }`}
          />
        </div>
        <div className="w-[22.5rem] h-[1.56rem] text-[12px] text-red-500">
          {errors.userId?.type === "required" && errors.userId.message}
          {errors.userId?.type === "pattern" && errors.userId.message}
        </div>
        <div className="flex flex-col items-start h-[5rem]">
          <label htmlFor="userPwd" className="h-[1.25rem] text-[14px]">
            비밀번호
          </label>
          <input
            id="userPassword"
            type="password"
            placeholder="비밀번호"
            {...register("userPassword", {
              required: { value: true, message: "비밀번호를 입력해주십시오." },
              onChange: () => handleLoginError(),
            })}
            className={`w-[22.5rem] h-[3.125rem] text-[14px] placeholder:text-slate-400 border p-[0.625rem] mt-[0.62rem] rounded-[0.375rem] ${
              errors.userPassword || loginError ? "border-red-500" : ""
            }`}
          />
        </div>
        <div className="w-[22.5rem] h-[1.5625rem] text-[12px] text-red-500">
          {errors.userPassword?.type === "required" &&
            loginError === false &&
            errors.userPassword.message}
          {loginError && "아이디 또는 비밀번호를 일치하지 않습니다."}
        </div>
        <div className="flex w-[22.5rem] h-[2.625rem]">
          <Checkbox id="saveId" onClick={handleSaveId} checked={saveId} />
          <label
            htmlFor="saveId"
            className="text-[14px] h-[1rem] leading-[16px] ml-[0.625rem] text-slate-400 cursor-pointer"
          >
            아이디 저장
          </label>
        </div>
        <div className="flex flex-col h-[3rem]">
          <button
            type="submit"
            className="flex justify-center items-center w-[22.5rem] h-[3.125rem] text-[18px] text-white bg-orange-500 rounded-[0.375rem] cursor-pointer"
          >
            로그인
          </button>
        </div>
      </form>
      <div className="mt-[10rem] text-slate-300 text-[14px]">
        Copyright © RMSOFT Corp. All rights reserved
      </div>
    </div>
  );
}
