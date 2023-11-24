import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: { userId?: string | null } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    error?: "RefreshAccessTokenError";
  }
  interface JWT extends DefaultJWT {
    userId?: string | null;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {}
