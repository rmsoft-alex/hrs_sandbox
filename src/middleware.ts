import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  /* favicon.ico, api와 _next로 시작하는 route 무시 (temp solution)
    matchers in next.config isn't working
    without this the middleware will run more than once
   so to avoid this we will ignore all paths with /api and  /_next
   */
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  let token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  }); // 토큰 존재여부 확인

  const isLogin = !!token;
  const withoutAuths = ["/login"]; // 토큰 없이 방문할 수 있는 주소(로그인 화면)
  const isWithoutAuth = withoutAuths.some((prefix) => pathname === prefix); // path를 확인하여 일치 여부 boolean 값으로 반환
  const isWithAuth = !isWithoutAuth;

  // with auth
  //    isLogin
  //      T : noting / F : redirect login page
  // without auth
  //    isLogin
  //      T : nothing / F : nothing

  if (isWithAuth) {
    if (!isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else if (isWithoutAuth) {
    if (isLogin && pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
}
