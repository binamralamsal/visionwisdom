import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormField } from "./form-field";
import { FormInput } from "./form-input";
import { FormLabel } from "./form-label";
import { FormTextarea } from "./form-textarea";
import { Field, FieldDescription, FieldGroup } from "../ui/field";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    FormField,
    FormLabel,
    FormDescription: FieldDescription,
    FormError,
    FormInput,
    FormTextarea,
  },
  formComponents: {
    FormGroup: FieldGroup,
    FormField: Field,
    FormDescription: FieldDescription,
    FormButton: Button,
  },
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
