import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import { useEffect } from "react";

import { useStore } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CategorySchema, categorySchema } from "../blogs.schema";

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

import { api } from "@/orpc/client";
import { slugify } from "@/util/slugify";

export function CategoryForm(props: {
  id?: number;
  defaultValues?: CategorySchema;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation(
    api.blogs.categories.new.mutationOptions({
      onSuccess: (response) => {
        toast.success(response.message);
        navigate({ to: "/admin/blog-categories" });
      },
      onError: (error: any) => {
        toast.error(error?.message ?? "Failed to create category");
      },
    }),
  );

  const updateCategoryMutation = useMutation(
    api.blogs.categories.update.mutationOptions({
      onSuccess: async (response) => {
        toast.success(response.message);
        if (props.id) {
          await queryClient.invalidateQueries(
            api.blogs.categories.get.queryOptions({
              input: { params: { id: props.id } },
            }),
          );
        }
      },
      onError: (error: any) => {
        toast.error(error?.message ?? "Failed to update category");
      },
    }),
  );

  const form = useAppForm({
    defaultValues:
      props.defaultValues ||
      ({
        name: "",
        slug: "",
      } as CategorySchema),
    validators: {
      onChange: categorySchema,
    },
    onSubmit: async ({ value: values }) => {
      if (props.id) {
        await updateCategoryMutation.mutateAsync({
          body: { values },
          params: { id: props.id },
        });
      } else {
        await createCategoryMutation.mutateAsync({ body: { values } });
      }
    },
  });

  const nameValue = useStore(form.store, (store) => store.values.name);

  useEffect(() => {
    if (!nameValue) return;

    const slug = slugify(nameValue);

    form.setFieldValue("slug", slug);
  }, [nameValue, form]);

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} Category`
    : "Add New Category";

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
          breadcrumbs={[
            { label: "All Categories", href: "/admin/blog-categories" },
          ]}
          pageTitle={pageTitle}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <Card className="container px-0">
            <CardHeader>
              <CardTitle className="text-xl">Add Category</CardTitle>
              <CardDescription>
                Add a new category by entering suitable name, and slug.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid items-start gap-6 md:grid-cols-2">
              <form.FormGroup className="grid items-start gap-6 md:grid-cols-2">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel className="gap-1">
                        Name <span className="text-destructive">*</span>
                      </field.FormLabel>
                      <field.FormInput type="text" placeholder="Information" />
                      <field.FormError />
                      <field.FormDescription>
                        Enter a suitable category name.
                      </field.FormDescription>
                    </field.FormField>
                  )}
                />

                <form.AppField
                  name="slug"
                  children={(field) => (
                    <field.FormField>
                      <field.FormLabel className="gap-1">
                        Slug <span className="text-destructive">*</span>
                      </field.FormLabel>
                      <field.FormInput
                        type="text"
                        placeholder="information"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e: any) =>
                          field.handleChange(e.target.value)
                        }
                      />
                      <field.FormError />
                      <field.FormDescription>
                        This will be used in URL of the category.
                      </field.FormDescription>
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

function ActionButtons({ isEditing }: { isEditing?: boolean }) {
  const {
    state: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link to="/admin/blog-categories">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Category</span>
      </Button>
    </>
  );
}
