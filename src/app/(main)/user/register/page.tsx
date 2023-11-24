import React from "react";
import LocationHeader from "@/components/common/layout/header/locationHeader";
import UserForm from "../components/UserForm";

export default function UserRegisterPage() {
  return (
    <div className="flex flex-1 flex-col h-full px-10 py-8 text-sm text-slate-800">
      <LocationHeader
        firstTitle="사용자 관리"
        firstPath="/user"
        secondTitle="사용자 등록"
      />
      <UserForm mode="register" />
    </div>
  );
}
