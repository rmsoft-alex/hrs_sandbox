import React from "react";
import List from "./components/DeptList";
import LocationHeader from "@/components/common/layout/header/locationHeader";

const page = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 h-full px-10 py-8 overflow-y-auto">
      <LocationHeader firstTitle="부서관리" />
      <List />
    </div>
  );
};

export default page;
