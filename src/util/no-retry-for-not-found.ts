import { isDefinedError } from "@orpc/client";

import { DefaultError } from "@tanstack/react-query";

export function noRetryForNotFound<TError = DefaultError>(
  _: number,
  error: TError,
) {
  if (isDefinedError(error) && error.code === "NOT_FOUND") return false;
  return true;
}
