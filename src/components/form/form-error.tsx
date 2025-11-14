import { ComponentProps } from "react";

import { useStore } from "@tanstack/react-form";

import { FieldError } from "../ui/field";
import { useFieldContext } from "./hooks";
import { useFormFieldContext } from "./form-store";

export function FormError(props: ComponentProps<typeof FieldError>) {
  const { isInvalid } = useFormFieldContext();
  const field = useFieldContext();
  const errors = useStore(field.store, (state) => state.meta.errors);

  if (!isInvalid) return null;

  return <FieldError errors={errors} {...props} />;
}
