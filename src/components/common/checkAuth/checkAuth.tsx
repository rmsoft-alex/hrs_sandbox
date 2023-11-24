"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CheckAuth = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // 로그인 화면이 아닐 경우에만 확인
    if (pathname !== "/login") {
      // 세션이 없을 경우 로그인 페이지로 리다이렉트
      if (status === "unauthenticated") {
        // callbackUrl은 .env.local의 NEXTAUTH_URL 뒤에 path가 붙는다.
        signOut({ callbackUrl: "/login" });
      } else if (status === "authenticated") {
        if (!!session.accessToken && !!session.refreshToken) {
          // 로컬 스토리지에 저장
          localStorage.setItem("accessToken", session.accessToken);
          localStorage.setItem("refreshToken", session.refreshToken);
        } else {
          signOut({ callbackUrl: "/login" });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    }
  }, [session, pathname, status]);

  return <></>;
};

export default CheckAuth;
