import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { useAppForm, useFormContext } from "@/components/form/hooks";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/orpc/client";
import {
  NewUserClientSchema,
  NewUserClientSchemaInput,
  newUserClientSchema,
} from "@/features/auth/auth.schema";

export const Route = createFileRoute("/admin/users_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const createUserMutation = useMutation(
    api.users.admin.create.mutationOptions({
      onSuccess: async (response) => {
        toast.success(response.message);
        navigate({
          to: "/admin/users",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    } as NewUserClientSchemaInput,
    validators: {
      onChange: newUserClientSchema,
    },
    onSubmit: async ({ value }) => {
      await createUserMutation.mutateAsync({
        body: {
          email: value.email,
          name: value.name,
          password: value.password,
          role: value.role as NewUserClientSchema["role"],
        },
      });
    },
  });

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FormNavigationBlocker />
        <AdminPageWrapper
          breadcrumbs={[{ label: "All Users", href: "/admin/users" }]}
          pageTitle="Add New User"
          rightSideContent={<ActionButtons />}
        >
          <Card className="container px-0">
            <CardHeader>
              <CardTitle>Add User</CardTitle>
              <CardDescription>
                Add a new user by entering their name, email, role, and password
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <form.FormGroup className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Name</field.FormLabel>
                      <field.FormInput type="text" placeholder="John Smith" />
                      <field.FormError />
                    </field.FormField>
                  )}
                />
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Name</field.FormLabel>
                      <field.FormInput
                        type="email"
                        placeholder="email@website.com"
                      />
                      <field.FormError />
                    </field.FormField>
                  )}
                />

                <form.AppField
                  name="role"
                  children={(field) => (
                    <field.FormField className="md:col-span-2 lg:col-auto">
                      <field.FormLabel>Role</field.FormLabel>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as "user" | "admin")
                        }
                      >
                        <SelectTrigger
                          aria-label="Select a role suitable for this user"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Normal User</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <field.FormError />
                      <field.FormDescription>
                        Admins can access the admin panel, and do whatever they
                        want.
                      </field.FormDescription>
                    </field.FormField>
                  )}
                />
              </form.FormGroup>

              <form.FormGroup className="grid items-start gap-6 md:grid-cols-2">
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Password</field.FormLabel>
                      <field.FormInput type="password" placeholder="********" />
                      <field.FormError />
                      <field.FormDescription>
                        Enter a suitable password with at least 8 characters,
                        one number, one uppercase letter, and one symbol.
                      </field.FormDescription>
                    </field.FormField>
                  )}
                />
                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Confirm Password</field.FormLabel>
                      <field.FormInput type="password" placeholder="********" />
                      <field.FormError />
                    </field.FormField>
                  )}
                />
              </form.FormGroup>
            </CardContent>
          </Card>
        </AdminPageWrapper>
      </form>
    </form.AppForm>
  );
}

function ActionButtons() {
  const {
    state: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link to="/admin/users">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>Add User</span>
      </Button>
    </>
  );
}
