import { z } from "zod";

export function emptyStringAsOptionalSchema<T extends z.ZodType>(toSchema: T) {
  return z.preprocess((val) => {
    if (typeof val === "string" && val.trim().length === 0) {
      return undefined;
    }
    return val;
  }, toSchema) as unknown as z.ZodType<z.output<T>, z.input<T> | string>;
}
