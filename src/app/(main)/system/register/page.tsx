import LocationHeader from "@/components/common/layout/header/locationHeader";
import SystemForm from "@/components/common/system/systemForm";
import React from "react";

const SystemRegisterPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 h-full px-10 py-8">
      <LocationHeader
        firstTitle="시스템 조회"
        firstPath="/system"
        secondTitle="시스템 등록"
      />
      <div className="w-[600px]">
        <SystemForm
          systemName={""}
          systemDomain={""}
          active={"N"}
          description={""}
          okButton={"등록"}
          cancelButton={"목록"}
          modalName={"systemAdd"}
          readOnlyYN={false}
        />
      </div>
    </div>
  );
};

export default SystemRegisterPage;
