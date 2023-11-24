"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsrDeptAction } from "../store/useUserDeptStore";
import { useModalAction } from "../store/useModalStore";
import { FormSchema, useUserForm, defaultValue } from "../hooks/useUserForm";
import { useUserPost, useUserPut } from "../hooks/useUser";
import { UsrDtlRes } from "../type";
import SelectedDept from "./SelectedDept ";
import UserFormModal from "./UserFormModal";
import UserFormRadioField from "./UserFormRadioField";
import UserFormToggleField from "./UserFormToggleField";
import UserFormComboboxField from "./UserFormComboboxField";
import UserFormDateField from "./UserFormDateField";
import UserFormTextInputField from "./UserFormTextInputField";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  mode: "edit" | "register";
  userInfo?: UsrDtlRes;
};

export default function UserForm({ mode, userInfo }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: userInfo! || defaultValue,
  });

  const { setIsCancelModalOpen } = useModalAction();
  // 부서, 직책 기본값 지정
  const { initializeDept } = useUsrDeptAction();
  // 유저 등록, 수저, loading 상태
  const { postUser, isPostUserLoading } = useUserPost();
  const { putUser, isPutUserLoading } = useUserPut();

  // 수정 사유
  const [userDescription, setUserDescription] = useState("");
  // 선택된 직위
  const [selectedTitleCode, setSelectedTitleCode] = useState(
    userInfo?.titleCode || ""
  );

  const { onSubmit } = useUserForm({
    mode,
    userInfo,
    selectedTitleCode,
  });

  useEffect(() => {
    if (mode === "register") {
      initializeDept([]);
    }
  }, [initializeDept, mode]);

  return (
    <div className="h-full flex flex-col flex-1 px-3 pb-3">
      <Form {...form}>
        <form
          className="h-full flex flex-col flex-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="self-end flex gap-3">
            {mode === "edit" && (
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsCancelModalOpen(true)}
              >
                취소
              </Button>
            )}
            <Button type="submit">
              {mode === "register" ? "등록" : "수정"}
            </Button>
            {/* 취소, 등록, 수정 모달 */}
            <UserFormModal
              userInfo={userInfo}
              userDescription={userDescription}
              setUserDescription={setUserDescription}
              postUser={postUser}
              putUser={putUser}
              isPostUserLoading={isPostUserLoading}
              isPutUserLoading={isPutUserLoading}
            />
          </div>
          <div className="h-full flex gap-4 py-9">
            {/* 사용자 정보 등록 form */}
            <div className="min-w-[210px] w-64 h-full flex flex-col flex-1 gap-1 mr-10 pb-5">
              <UserFormTextInputField
                name="userId"
                title="아이디"
                required
                mode={mode}
                form={form}
              />
              <UserFormDateField
                name="birth"
                title="생년월일"
                required
                mode={mode}
                form={form}
              />
              <UserFormRadioField
                name="gender"
                title="성별"
                required
                options={[
                  {
                    name: "MALE",
                    title: "남성",
                  },
                  {
                    name: "FEMALE",
                    title: "여성",
                  },
                ]}
                mode={mode}
                userInfo={userInfo}
                form={form}
              />
              <UserFormTextInputField
                name="name"
                title="이름"
                required
                mode={mode}
                form={form}
              />
              <UserFormComboboxField
                name="titleCode"
                title="직위"
                required
                form={form}
                selectedTitleCode={selectedTitleCode}
                setSelectedTitleCode={setSelectedTitleCode}
              />
              <UserFormToggleField
                name="activeStatus"
                title="활성화 여부"
                required
                userInfo={userInfo}
                form={form}
              />
              <UserFormTextInputField
                name="nickname"
                title="닉네임"
                required={false}
                mode={mode}
                form={form}
              />
              <UserFormTextInputField
                name="employeeNumber"
                title="사번"
                required={false}
                mode={mode}
                form={form}
              />
            </div>
            <Separator className="h-[520px]" orientation="vertical" />
            {/* 부서 선택 */}
            <SelectedDept userInfo={userInfo} mode={mode} />
          </div>
        </form>
      </Form>
    </div>
  );
}
