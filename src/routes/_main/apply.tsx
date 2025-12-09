import { toast } from "sonner";
import {
  BriefcaseIcon,
  FileBadge2,
  FileHeart,
  FileText,
  LogIn,
  TrashIcon,
  XIcon,
} from "lucide-react";

import * as React from "react";

import { useStore } from "@tanstack/react-form";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/form/hooks";
import { Separator } from "@/components/ui/separator";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  FileIcon,
  FileList,
  FileName,
  FileUpload,
  FileUploader,
  useFileUploader,
} from "@/components/file-upload";

import { cn } from "@/util/cn";
import { api } from "@/orpc/client";
import { noRetryForUnauthorized } from "@/util/no-retry-for-unauthorized";
import {
  JobApplicationSchemaInput,
  jobApplicationSchema,
} from "@/features/jobs/jobs.schema";

export const Route = createFileRoute("/_main/apply")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: profileData, isLoading } = useQuery(
    api.users.profile.get.queryOptions({
      retry: noRetryForUnauthorized,
    }),
  );

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <section className="hero-gradient py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="bg-primary/10 mb-6 inline-flex items-center justify-center rounded-full p-2">
              <BriefcaseIcon className="text-primary mr-2 h-5 w-5" />
              <span className="text-primary text-sm font-medium">
                Available Opportunities
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
              <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent">
                Discover Your Next Career Move
              </span>
            </h1>

            <p className="text-foreground/80 mx-auto mb-8 max-w-2xl text-lg text-balance md:text-xl">
              Apply once with your complete profile and documents, and our team
              will match you with suitable global job opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container">
          {isLoading && (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground text-sm">
                Loading your profile...
              </p>
            </div>
          )}

          {/* Not logged in */}
          {!isLoading && !profileData && (
            <div className="bg-card/40 mx-auto max-w-3xl rounded-xl border p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 mt-1 rounded-full p-2">
                    <LogIn className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold">
                      Login required to apply
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Create an account or sign in to submit your job
                      application and track its status.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Logged in: show form */}
          {!isLoading && profileData && (
            <ApplyForm
              className="mx-auto max-w-4xl"
              profile={{
                name: profileData.name ?? "",
                email: profileData.email ?? "",
                phone: profileData.phone ?? "",
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

type Profile = {
  name: string;
  email: string;
  phone: string;
};

function ApplyForm({
  className,
  profile,
  ...props
}: React.ComponentProps<"div"> & { profile: Profile }) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    api.jobApplications.new.mutationOptions({
      onError: (err) => {
        toast.error(err.message || "Failed to submit application");
      },
      onSuccess: async (data) => {
        toast.success(data.message);
        await queryClient.invalidateQueries(
          api.jobApplications.mine.queryOptions({ input: { query: {} } }),
        );
        form.reset();
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      preferredCountries: "",
      preferredPosition: "",
      resumeFileId: undefined as unknown as number,
      passportFileId: undefined as unknown as number,
      medicalReportFileId: undefined as unknown as number,
    } satisfies JobApplicationSchemaInput,
    validators: {
      onChange: jobApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({ body: value });
    },
  });

  return (
    <div
      className={cn(
        "bg-card/40 flex flex-col gap-8 rounded-xl border p-6 md:p-8",
        className,
      )}
      {...props}
    >
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-10"
        >
          <FormNavigationBlocker />
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Personal Information</FieldLegend>
              <FieldDescription>
                We pre-filled this from your profile. You can update it if
                needed.
              </FieldDescription>

              <form.FormGroup className="mt-4 grid gap-4 md:grid-cols-2">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Full Name</field.FormLabel>
                      <field.FormInput placeholder="John Doe" />
                      <field.FormError />
                    </field.FormField>
                  )}
                />

                <form.AppField
                  name="phone"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Phone Number</field.FormLabel>
                      <field.FormInput placeholder="98XXXXXXXX" type="tel" />
                      <field.FormDescription>
                        Must start with 98 or 97 and be 10 digits total.
                      </field.FormDescription>
                      <field.FormError />
                    </field.FormField>
                  )}
                />

                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Email</field.FormLabel>
                      <field.FormInput
                        placeholder="you@example.com"
                        type="email"
                      />
                      <field.FormError />
                    </field.FormField>
                  )}
                />
              </form.FormGroup>
            </FieldSet>
          </FieldGroup>

          <Separator />

          <FieldGroup>
            <FieldSet>
              <FieldLegend>Job Preferences</FieldLegend>
              <FieldDescription>
                Tell us where and what kind of position you&apos;re looking for.
              </FieldDescription>

              <form.FormGroup className="mt-4 grid gap-4 md:grid-cols-2">
                <form.AppField
                  name="preferredCountries"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Preferred Countries</field.FormLabel>
                      <field.FormTextarea
                        rows={3}
                        placeholder="E.g. Japan, Korea, Gulf countries..."
                      />
                      <field.FormDescription>
                        You can list multiple countries separated by commas.
                      </field.FormDescription>
                      <field.FormError />
                    </field.FormField>
                  )}
                />

                <form.AppField
                  name="preferredPosition"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Preferred Position</field.FormLabel>
                      <field.FormTextarea
                        rows={3}
                        placeholder="E.g. Caregiver, Factory worker, Hotel staff..."
                      />
                      <field.FormError />
                    </field.FormField>
                  )}
                />
              </form.FormGroup>
            </FieldSet>
          </FieldGroup>

          <Separator />

          <FieldGroup>
            <FieldSet>
              <FieldLegend>Required Documents</FieldLegend>
              <FieldDescription>
                Upload your CV, passport, and medical report as PDF or image
                files.
              </FieldDescription>

              <div className="mt-4 space-y-4">
                <form.AppField
                  name="resumeFileId"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>CV / Resume</field.FormLabel>
                      <div className="bg-background/60 mt-2 flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-start">
                        <div className="bg-primary/10 rounded-full p-2">
                          <FileText className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-muted-foreground text-xs">
                            Upload your latest CV as PDF or image.
                          </p>

                          <FileUploader
                            maxFilesCount={1}
                            maxFileSize="10mb"
                            accept={["application/pdf", "image/*"]}
                            onChange={(files) =>
                              field.handleChange(files[0]?.id)
                            }
                            initialFiles={[]}
                          >
                            <FileUpload />
                            <UploadingFilesList label="Uploading CV" />
                            <UploadedFilesList label="Uploaded CV" />
                          </FileUploader>

                          <field.FormError />
                        </div>
                      </div>
                    </field.FormField>
                  )}
                />

                <form.AppField
                  name="passportFileId"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Passport</field.FormLabel>
                      <div className="bg-background/60 mt-2 flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-start">
                        <div className="bg-primary/10 rounded-full p-2">
                          <FileBadge2 className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-muted-foreground text-xs">
                            Upload a clear scan or photo of your passport (PDF
                            or image).
                          </p>

                          <FileUploader
                            maxFilesCount={1}
                            maxFileSize="10mb"
                            accept={["application/pdf", "image/*"]}
                            onChange={(files) =>
                              field.handleChange(files[0]?.id)
                            }
                            initialFiles={[]}
                          >
                            <FileUpload />
                            <UploadingFilesList label="Uploading passport" />
                            <UploadedFilesList label="Uploaded passport" />
                          </FileUploader>

                          <field.FormError />
                        </div>
                      </div>
                    </field.FormField>
                  )}
                />

                {/* Medical Report */}
                <form.AppField
                  name="medicalReportFileId"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel>Medical Report</field.FormLabel>
                      <div className="bg-background/60 mt-2 flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-start">
                        <div className="bg-primary/10 rounded-full p-2">
                          <FileHeart className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-muted-foreground text-xs">
                            Upload your latest medical report (PDF or image).
                          </p>

                          <FileUploader
                            maxFilesCount={1}
                            maxFileSize="10mb"
                            accept={["application/pdf", "image/*"]}
                            onChange={(files) =>
                              field.handleChange(files[0]?.id)
                            }
                            initialFiles={[]}
                          >
                            <FileUpload />
                            <UploadingFilesList label="Uploading report" />
                            <UploadedFilesList label="Uploaded report" />
                          </FileUploader>

                          <field.FormError />
                        </div>
                      </div>
                    </field.FormField>
                  )}
                />
              </div>
            </FieldSet>
          </FieldGroup>

          <FieldGroup>
            <Field orientation="horizontal">
              <form.FormButton type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Application"}
              </form.FormButton>
            </Field>
            <Field>
              <FieldDescription>
                After submitting, our team will review your application and
                contact you via email or phone if there is a suitable
                opportunity.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </form.AppForm>
    </div>
  );
}

function UploadingFilesList({ label }: { label: string }) {
  const { uploadingFiles, cancelUpload } = useFileUploader();

  if (uploadingFiles.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-xs font-medium">{label}</p>
      <div className="mt-2 space-y-2">
        {uploadingFiles.map(({ file, preview, progress }) => (
          <FileList key={file.name}>
            <FileIcon fileType={file.type} name={file.name} preview={preview} />
            <FileName name={file.name} progress={progress} />
            <Button
              onClick={() => cancelUpload(file)}
              size="icon"
              variant="destructive"
              type="button"
              className="justify-self-end"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}

function UploadedFilesList({ label }: { label: string }) {
  const { uploadedFiles, deleteFile } = useFileUploader();

  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-xs font-medium">{label}</p>
      <div className="mt-2 space-y-2">
        {uploadedFiles.map(({ name, url, fileType, id }) => (
          <FileList key={id} className="grow">
            <FileIcon fileType={fileType} name={name} preview={url} />
            <FileName name={name} />
            <Button
              onClick={() => deleteFile(url)}
              size="icon"
              variant="destructive"
              type="button"
              className="justify-self-end"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}
