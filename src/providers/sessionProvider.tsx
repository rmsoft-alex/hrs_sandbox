"use client";

import CheckAuth from "@/components/common/checkAuth/checkAuth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function SessionProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <CheckAuth />
      {children}
    </SessionProvider>
  );
}
