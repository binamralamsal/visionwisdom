import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import {
  ContactEntrySchema,
  contactEntrySchema,
} from "../contact-entries.schema";

import { useAppForm } from "@/components/form/hooks";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";

import { api } from "@/orpc/client";

export function ContactForm() {
  const mutation = useMutation(
    api.contact.new.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        form.reset();
        toast.success(data.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      phone: "",
    } satisfies ContactEntrySchema,
    validators: {
      onChange: contactEntrySchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({ body: value });
    },
  });

  return (
    <form.AppForm>
      <FormNavigationBlocker />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.FormGroup>
          <form.AppField
            name="name"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Full Name</field.FormLabel>
                <field.FormInput type="text" placeholder="John Smith" />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="email"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Email</field.FormLabel>
                <field.FormInput type="email" placeholder="email@website.com" />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="phone"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Phone</field.FormLabel>
                <field.FormInput type="text" placeholder="98XXXXXXXX" />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="message"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Message</field.FormLabel>
                <field.FormTextarea
                  placeholder="Tell us about your project..."
                  rows={5}
                />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.FormField>
            <form.FormButton type="submit">
              {form.state.isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </form.FormButton>
          </form.FormField>
        </form.FormGroup>
      </form>
    </form.AppForm>
  );
}
