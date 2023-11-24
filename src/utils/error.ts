import * as z from "zod";

/**
 * print zod error log in console
 * @param error zod error
 */
export function logZodError<T>(error: z.ZodError<T>) {
  error.issues.map((el) => {
    if ("received" in el && "expected" in el) {
      console.log(
        `[${el.path}]: 받은 타입: ${el.received}, 받아야할 타입: ${el.expected}, 메시지: ${el.message}`
      );
    }
  });
}
