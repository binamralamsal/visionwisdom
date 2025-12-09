import z from "zod";
import { toast } from "sonner";
import { KeyRound, Trash2 } from "lucide-react";

import { useState } from "react";

import { useStore } from "@tanstack/react-form";
import { redirect, useNavigate } from "@tanstack/react-router";
import { createFileRoute, isRedirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/form/hooks";
import { Separator } from "@/components/ui/separator";
import { SettingsLayout } from "@/components/settings-layout";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { api } from "@/orpc/client";
import {
  nameSchema,
  newPasswordSchema,
  phoneSchema,
} from "@/features/auth/auth.schema";

export const Route = createFileRoute("/_main/settings")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(
        api.users.profile.get.queryOptions(),
      );
    } catch (error) {
      throw redirect({ to: "/login", search: { redirect_url: "/settings" } });
    }
  },
});

const updateProfileSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
});

const changePasswordSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: newPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const { data: profileData, isLoading } = useQuery(
    api.users.profile.get.queryOptions(),
  );

  const updateProfileMutation = useMutation(
    api.users.profile.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(api.users.profile.get.queryOptions());
        queryClient.invalidateQueries(api.users.current.user.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    }),
  );

  const changePasswordMutation = useMutation(
    api.users.profile.changePassword.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        setPasswordDialogOpen(false);
        passwordForm.reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to change password");
      },
    }),
  );

  const deleteAccountMutation = useMutation(
    api.users.profile.deleteAccount.mutationOptions({
      onSuccess: async () => {
        toast.success("Account deleted successfully");
        await queryClient.invalidateQueries();
        navigate({ to: "/login" });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete account");
      },
    }),
  );

  const profileForm = useAppForm({
    defaultValues: {
      name: profileData?.name || "",
      phone: profileData?.phone || "",
    },
    validators: {
      onChange: updateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      await updateProfileMutation.mutateAsync({ body: value });
    },
  });

  const isProfileFormDirty = useStore(
    profileForm.store,
    (store) => store.isDirty,
  );

  const passwordForm = useAppForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await changePasswordMutation.mutateAsync({
        body: { password: value.newPassword },
      });
    },
  });

  if (isLoading) {
    return (
      <SettingsLayout
        title="General Settings"
        description="Manage your profile information and account settings"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading profile...</div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout
      title="General Settings"
      description="Manage your profile information and account settings"
    >
      <div className="space-y-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            profileForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Profile Information</FieldLegend>
              <FieldDescription>
                Update your personal details and contact information
              </FieldDescription>
              <profileForm.FormGroup className="grid md:grid-cols-2">
                <profileForm.AppField
                  name="name"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Full Name</field.FormLabel>
                      <field.FormInput placeholder="John Doe" />
                      <field.FormError />
                    </field.FormField>
                  )}
                />

                <profileForm.AppField
                  name="phone"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Phone Number</field.FormLabel>
                      <field.FormInput placeholder="98XXXXXXXX" type="tel" />
                      <field.FormDescription>
                        Must start with 98 or 97 and be 10 digits total
                      </field.FormDescription>
                      <field.FormError />
                    </field.FormField>
                  )}
                />
              </profileForm.FormGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <profileForm.FormButton
                type="submit"
                disabled={
                  updateProfileMutation.isPending || !isProfileFormDirty
                }
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </profileForm.FormButton>
            </Field>
          </FieldGroup>
        </form>

        <Separator />

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Security</FieldLegend>
            <FieldDescription>
              Manage your password and security preferences
            </FieldDescription>
          </FieldSet>

          <Item variant="outline">
            <ItemMedia>
              <KeyRound className="h-5 w-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Password</ItemTitle>
              <ItemDescription>
                Change your password to keep your account secure
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Dialog
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your new password below. All other devices will be
                      logged out for security.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      passwordForm.handleSubmit();
                    }}
                  >
                    <FieldGroup>
                      <passwordForm.AppField
                        name="newPassword"
                        children={(field) => (
                          <Field>
                            <FieldLabel htmlFor="new-password">
                              New Password
                            </FieldLabel>
                            <field.FormPasswordInput
                              id="new-password"
                              placeholder="********"
                            />
                            <FieldDescription>
                              Must contain uppercase, lowercase, number, and
                              special character
                            </FieldDescription>
                            <field.FormError />
                          </Field>
                        )}
                      />

                      <passwordForm.AppField
                        name="confirmPassword"
                        children={(field) => (
                          <Field>
                            <FieldLabel htmlFor="confirm-password">
                              Confirm Password
                            </FieldLabel>
                            <field.FormPasswordInput
                              id="confirm-password"
                              placeholder="********"
                            />
                            <field.FormError />
                          </Field>
                        )}
                      />
                    </FieldGroup>
                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPasswordDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <passwordForm.FormButton
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending
                          ? "Changing..."
                          : "Change Password"}
                      </passwordForm.FormButton>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </ItemActions>
          </Item>
        </FieldGroup>

        <Separator />

        {/* Danger Zone */}
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-destructive">Danger Zone</FieldLegend>
            <FieldDescription>
              Irreversible actions that will permanently affect your account
            </FieldDescription>
          </FieldSet>

          <Item variant="outline" className="border-destructive/50">
            <ItemMedia>
              <Trash2 className="text-destructive h-5 w-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-destructive">Delete Account</ItemTitle>
              <ItemDescription>
                Permanently delete your account and all associated data
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteAccountMutation.mutateAsync({})}
                      disabled={deleteAccountMutation.isPending}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {deleteAccountMutation.isPending
                        ? "Deleting..."
                        : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ItemActions>
          </Item>
        </FieldGroup>
      </div>
    </SettingsLayout>
  );
}
