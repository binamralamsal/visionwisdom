import { createContext, use, useId } from "react";

import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "./hooks";

type FormItemContextValue = {
  id: string;
  isInvalid: boolean;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

export function useFormFieldContext() {
  const data = use(FormItemContext);

  if (!data) {
    throw new Error("useFieldContext must be used within a field.FormField");
  }

  return data;
}

export function FormItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const field = useFieldContext();
  const id = useId();

  const isBlurred = useStore(field.store, (store) => store.meta.isBlurred);
  const isValid = useStore(field.store, (store) => store.meta.isValid);
  const submissionAttempts = useStore(
    field.form.store,
    (store) => store.submissionAttempts,
  );

  const isInvalid = (isBlurred || submissionAttempts > 0) && !isValid;

  return (
    <FormItemContext.Provider value={{ id, isInvalid }}>
      {children}
    </FormItemContext.Provider>
  );
}
