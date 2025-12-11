import { toast } from "sonner";
import { LoaderCircleIcon, TrashIcon, XIcon } from "lucide-react";

import { use, useEffect } from "react";

import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { formOptions, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { JobSchemaInput, jobSchema } from "../jobs.schema";

import { Button } from "@/components/ui/button";
import { TextEditor } from "@/components/text-editor";
import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import { useAppForm, useFormContext, withForm } from "@/components/form/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileIcon,
  FileList,
  FileName,
  FileUpload,
  FileUploader,
  UploadedFile,
  useFileUploader,
} from "@/components/file-upload";

import { api } from "@/orpc/client";
import { slugify } from "@/util/slugify";

const initialValues: JobSchemaInput = {
  title: "",
  slug: "",
  description: "",
  company: null,
  location: null,
  gender: "any",
  salary: null,
  contractLength: null,
  workingHours: null,
  experience: null,
  documentsRequired: null,
  status: "draft",
  categoryId: null,
  fileId: null,
  isFeatured: false,
};

const formOpts = formOptions({
  defaultValues: initialValues,
});

type Category = { id: number; name: string };
type Props =
  | {
      id: number;
      defaultValues?: JobSchemaInput;
      file?: UploadedFile | null;
      categories: Category[];
    }
  | {
      id?: undefined;
      defaultValues?: undefined;
      file?: undefined;
      categories: Category[];
    };

export function JobForm(props: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createJobMutation = useMutation(
    api.jobs.new.mutationOptions({
      onSuccess: (response) => {
        toast.success(response.message);
        navigate({ to: "/admin/jobs" });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateJobMutation = useMutation(
    api.jobs.update.mutationOptions({
      onSuccess: async (response) => {
        toast.success(response.message);
        if (props.id) {
          await queryClient.invalidateQueries(
            api.jobs.get.queryOptions({
              input: { params: { id: props.id } },
            }),
          );
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useAppForm({
    ...formOpts,
    defaultValues: props.defaultValues || initialValues,
    onSubmit: async ({ value: values }) => {
      if (props.id) {
        await updateJobMutation.mutateAsync({
          body: { values },
          params: { id: props.id },
        });
      } else {
        await createJobMutation.mutateAsync({ body: { values } });
      }
    },
    validators: {
      onChange: jobSchema,
    },
  });

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.title} Job`
    : "Add New Job";

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
          pageTitle={pageTitle}
          breadcrumbs={[{ href: "/admin/jobs", label: "All Jobs" }]}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <div className="container grid grid-cols-1 gap-6 px-0 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <JobDetails
                categories={props.categories}
                form={form}
                file={props.file}
              />
            </div>
            <div className="lg:col-span-2">
              <JobContent form={form} />
            </div>
            <CardFooter className="xs:grid-cols-2 grid gap-2 md:hidden">
              <ActionButtons isEditing={!!props.id} />
            </CardFooter>
          </div>
        </AdminPageWrapper>
      </form>
    </form.AppForm>
  );
}

function ActionButtons({ isEditing }: { isEditing?: boolean }) {
  const {
    state: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link to="/admin/jobs">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Job</span>
      </Button>
    </>
  );
}

const JobDetails = withForm({
  ...formOpts,
  props: {} as { categories: Category[]; file?: UploadedFile | null },
  render: ({ form, categories, file }) => {
    const titleValue = useStore(form.store, (s) => s.values.title);

    useEffect(() => {
      const slug = slugify(titleValue);
      form.setFieldValue("slug", slug);
    }, [titleValue]);

    const isFeatured = useStore(form.store, (s) => s.values.isFeatured);
    console.log(isFeatured);

    return (
      <Card className="sticky top-6 h-fit">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Enter job information and optional attachment.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form.AppField
            name="fileId"
            children={(field) => (
              <field.FormField>
                <FileUploader
                  maxFilesCount={1}
                  maxFileSize="10mb"
                  accept={["image/*", "application/pdf"]}
                  onChange={(files) => field.handleChange(files[0]?.id)}
                  initialFiles={file ? [file] : []}
                >
                  <FileUpload />
                  <UploadingFilesList />
                  <UploadedFilesList />
                </FileUploader>

                <field.FormError />
                <field.FormDescription>
                  Optional attachment (company logo, job spec PDF).
                </field.FormDescription>
              </field.FormField>
            )}
          />

          <form.AppField
            name="title"
            children={(field) => (
              <field.FormField>
                <field.FormLabel className="gap-1">
                  Job Title <span className="text-destructive">*</span>
                </field.FormLabel>
                <field.FormInput
                  type="text"
                  placeholder="Senior Construction Engineer"
                />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="slug"
            children={(field) => (
              <field.FormField>
                <field.FormLabel className="gap-1">Slug</field.FormLabel>
                <field.FormInput
                  type="text"
                  placeholder="senior-construction-engineer"
                />
                <field.FormError />
                <field.FormDescription>
                  Slug appears in the job URL.
                </field.FormDescription>
              </field.FormField>
            )}
          />

          <form.AppField
            name="company"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Company</field.FormLabel>
                <field.FormInput
                  type="text"
                  placeholder="Al Hamad Construction"
                />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="location"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Location</field.FormLabel>
                <field.FormInput type="text" placeholder="Qatar" />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="gender"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Gender</field.FormLabel>

                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as "any" | "male" | "female")
                  }
                >
                  <SelectTrigger aria-label="Select gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>

                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="salary"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Salary</field.FormLabel>
                <field.FormInput
                  type="text"
                  placeholder="$3,500 - $4,500/month"
                />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="contractLength"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Contract Length</field.FormLabel>
                <field.FormInput
                  type="text"
                  placeholder="2 years (renewable)"
                />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="workingHours"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Working Hours</field.FormLabel>
                <field.FormInput type="text" placeholder="40 hours/week" />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="experience"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Experience</field.FormLabel>
                <field.FormInput type="text" placeholder="3+ years" />
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="documentsRequired"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Documents Required</field.FormLabel>
                <field.FormInput
                  type="text"
                  placeholder="Resume, ID, Certificates"
                />
                <field.FormError />
                <field.FormDescription>
                  Separate items with commas.
                </field.FormDescription>
              </field.FormField>
            )}
          />

          <form.AppField
            name="categoryId"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Category</field.FormLabel>

                <Select
                  value={field.state.value ? field.state.value.toString() : ""}
                  onValueChange={(value) => field.handleChange(parseInt(value))}
                >
                  <SelectTrigger
                    aria-label="Select a category"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <field.FormError />
              </field.FormField>
            )}
          />

          <form.AppField
            name="status"
            children={(field) => (
              <field.FormField>
                <field.FormLabel>Status</field.FormLabel>

                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(
                      v as "draft" | "published" | "closed" | "archived",
                    )
                  }
                >
                  <SelectTrigger
                    aria-label="Select a status"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <field.FormError />
              </field.FormField>
            )}
          />
          <form.AppField
            name="isFeatured"
            children={(field) => (
              <field.FormField>
                <div className="flex gap-3">
                  <field.FormCheckbox />
                  <field.FormLabel>Is Featured?</field.FormLabel>
                </div>
                <field.FormError />
                <field.FormDescription>
                  When it's featured, it will be displayed prominently on the
                  homepage.
                </field.FormDescription>
              </field.FormField>
            )}
          />
        </CardContent>
      </Card>
    );
  },
});

function UploadingFilesList() {
  const { uploadingFiles, cancelUpload } = useFileUploader();

  if (uploadingFiles.length === 0) return null;

  return (
    <div>
      <p>Uploading Attachment</p>
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
              <XIcon />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}

function UploadedFilesList() {
  const { uploadedFiles, deleteFile } = useFileUploader();

  if (uploadedFiles.length === 0) return null;

  return (
    <div>
      <p>Uploaded Attachment</p>
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
              <TrashIcon />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}

const JobContent = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>
            Provide full job description and requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="description"
            children={(field) => (
              <field.FormField>
                <TextEditor
                  content={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  toolbarClassName="top-16"
                />
                <field.FormError />
              </field.FormField>
            )}
          />
        </CardContent>
      </Card>
    );
  },
});
