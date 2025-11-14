import { ZodType, z } from "zod";
import { ORPCError, ValidationError, onError, os } from "@orpc/server";

// For middleware
export const mos = os.$route({ inputStructure: "detailed" }).errors({
  UNAUTHORIZED: {
    message: "Invalid credentials",
  },
  INPUT_VALIDATION_FAILED: {
    status: 422,
    data: z.object({
      formErrors: z.array(z.string()),
      fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
    }),
  },
  NOT_FOUND: {
    status: 404,
    message: "Not found",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error",
  },
});

// For routes
export const bos = mos.use(
  onError((error) => {
    if (
      error instanceof ORPCError &&
      error.code === "BAD_REQUEST" &&
      error.cause instanceof ValidationError
    ) {
      const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

      throw new ORPCError("INPUT_VALIDATION_FAILED", {
        status: 422,
        message: z.prettifyError(zodError),
        data: z.flattenError(zodError),
        cause: error.cause,
      });
    }

    if (
      error instanceof ORPCError &&
      error.code === "INTERNAL_SERVER_ERROR" &&
      error.cause instanceof ValidationError
    ) {
      throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
        cause: error.cause,
      });
    }
  }),
);

export function orpcInput<
  T extends {
    params?: ZodType;
    query?: ZodType;
    body?: ZodType;
    headers?: ZodType;
  },
>(schemas: T) {
  return z.object(schemas) as z.ZodObject<T>;
}
