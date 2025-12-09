import { isDefinedError } from "@orpc/client";

import { DefaultError } from "@tanstack/react-query";

export function noRetryForUnauthorized<TError = DefaultError>(
  _: number,
  error: TError,
) {
  if (isDefinedError(error) && error.code === "UNAUTHORIZED") return false;
  return true;
}
