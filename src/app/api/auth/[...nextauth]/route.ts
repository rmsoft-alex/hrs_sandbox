import { login } from "@/api/common.api";
import NextAuth, { JWT, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: {
          label: "아이디",
          type: "text",
          placeholder: "아이디를 입력해주세요.",
        },
        userPassword: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        // API 연결시 사용할 예정
        const res = await login({
          userId: credentials?.userId!,
          userPassword: credentials?.userPassword!,
        });

        if (res) {
          return {
            ...res,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          };
        } else {
          throw new Error("아이디 혹은 비밀번호가 틀렸습니다.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        return {
          ...token,
          userId: user.userId,
          access_token: user.accessToken,
          refresh_token: user.refreshToken,
        };
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      user: User | AdapterUser;
      token: JWT;
    }) {
      if (token && token.userId && session.user) {
        session.accessToken = token.access_token;
        session.refreshToken = token.refresh_token;
        session.user.userId = token.userId;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
