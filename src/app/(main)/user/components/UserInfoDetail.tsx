import React from "react";
import dayjs from "dayjs";
import { UsrDtlRes } from "../type";
import { useTitle } from "@/hooks/useCommon";

type InfoProps = {
  userDetail: UsrDtlRes;
};

export default function UserInfoDetail({ userDetail }: InfoProps) {
  const { getTitleName } = useTitle();

  return (
    <div className="relative flex flex-col gap-7 mb-[50px] text-sm">
      {userInfoTitle.map(({ title, id }) => (
        <dl className="flex gap-2" key={id}>
          <dt className="w-20">{title}</dt>
          <dd>
            {id === "gender"
              ? userDetail.gender === "FEMALE"
                ? "여성"
                : "남성"
              : id === "birth"
              ? dayjs(userDetail.birth).format("YYYY.MM.DD").toString()
              : id === "titleCode"
              ? userDetail.titleCode
                ? getTitleName(userDetail.titleCode)
                : "-"
              : userDetail[id]
              ? userDetail[id]
              : "-"}
          </dd>
        </dl>
      ))}
    </div>
  );
}

const userInfoTitle = [
  {
    title: "이름",
    id: "name",
  },
  {
    title: "생년월일",
    id: "birth",
  },
  {
    title: "성별",
    id: "gender",
  },
  {
    title: "아이디",
    id: "userId",
  },
  {
    title: "사번",
    id: "employeeNumber",
  },
  {
    title: "직위",
    id: "titleCode",
  },
  {
    title: "닉네임",
    id: "nickname",
  },
  {
    title: "사용여부",
    id: "activeStatus",
  },
];
