import * as z from "zod";
import { logZodError } from "./error";
import { ServerURL } from "@/types/type";
import { signOut } from "next-auth/react";

const fetchCheckingServer = async (path: string) => {
  const healthUrl = new URL(path.replace("v1/api/", "health"));

  return await fetch(healthUrl)
    .then((res) =>
      res.json().catch(() => {
        throw new Error("Server Connection Error");
      }),
    )
    .then((res) => res?.code === 100 && res?.resultData?.status === "UP")
    .catch(() => {
      return false;
    });
};

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Options<T extends z.Schema, Q extends z.Schema> = {
  domain?: string;
  isCheckedServer?: boolean;
  isFiles?: boolean;
  requestSchema?: T;
  responseSchema?: Q;
  isRefetch?: boolean;
};

/**
 *
 * @param method "GET" | "POST" | "PUT" | "DELETE"
 * @param path api path
 * @param requestData requestData
 * @param fetchOptions options of fetch
 * @returns
 */
export async function fetchWithZod<T extends z.Schema, Q extends z.Schema>(
  method: Method,
  path: string,
  requestData?: any,
  fetchOptions?: Options<T, Q>,
): Promise<any> {
  try {
    const options = {
      isCheckedServer: true,
      isFiles: false,
      domain: ServerURL.HRS,
      isRefetch: false,
      ...fetchOptions,
    };

    const { isFiles, isCheckedServer, requestSchema, responseSchema, domain } =
      options;

    if (!!requestData && !!requestSchema) {
      const requestParseResult = requestSchema.safeParse(requestData);
      if (!requestParseResult.success) {
        logZodError(requestParseResult.error);
      }
    }

    const headers: HeadersInit = {};
    if (!isFiles) headers["Content-Type"] = "application/json";

    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken") || null;
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const init: RequestInit = {
      method,
      credentials: "include",
      headers,
      cache: "no-store",
    };

    if (isCheckedServer && !(await fetchCheckingServer(domain))) {
      return {
        code: -1,
        message: "not connect to server",
      };
    }

    const urlFullPath = `${domain}${path}`;

    if (!z.string().url().safeParse(urlFullPath).success) {
      return {
        code: -1,
        message: "invalid url",
      };
    }

    const url = new URL(urlFullPath);

    if (!!requestData) {
      switch (String(method).toUpperCase()) {
        case "POST":
        case "PUT":
        case "DELETE":
          init["body"] = isFiles ? requestData : JSON.stringify(requestData);
          break;
        case "GET":
          Object.entries(requestData).map(([key, val]) => {
            url.searchParams.set(key, String(val));
          });
          break;
      }
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      return {
        code: -1,
        message: "fetch response error",
        data: null,
      };
    }

    const responseData = await response.json().catch(() => null);
    if (responseData === null) {
      return {
        code: -1,
        message: "response json parsing error",
        data: null,
      };
    }

    // accessToken, refreshToken 만료 체크
    if (responseData) {
      if (responseData.code === 300) {
        // accessToken 만료
        const getAccessToken = await fetch(url, {
          body: JSON.stringify({
            refreshToken: localStorage.getItem("refreshToken"),
          }),
        });

        const getAccessTokenData = await getAccessToken
          .json()
          .catch(() => null);

        if (getAccessTokenData.code === 100) {
          // accessToken, refreshToken 재발급
          localStorage.setItem(
            "accessToken",
            getAccessTokenData.data.accessToken,
          );
          localStorage.setItem(
            "refreshToken",
            getAccessTokenData.data.refreshToken,
          );

          if (!fetchOptions?.isRefetch) {
            return fetchWithZod(method, path, requestData, {
              ...fetchOptions,
              isRefetch: true,
            });
          } else {
            return { code: 0, message: "2번 이상의 재요청" };
          }
        } else if (getAccessTokenData.code === 301) {
          // refreshToken 만료
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return signOut({ callbackUrl: "/login" });
        }
      }
    }

    if (!!responseSchema) {
      const responseDefaultSchema = z
        .object({
          code: z.number(),
          message: z.string().nullable(),
        })
        .merge(z.object({ data: responseSchema.nullish() }));

      const responseParseResult = responseDefaultSchema.safeParse(responseData);
      if (!responseParseResult.success) {
        logZodError(responseParseResult.error);
      }
    }

    return responseData;
  } catch (error) {
    console.warn(error);
    return {
      code: -1,
      message: "fetch error",
      data: null,
    };
  }
}
