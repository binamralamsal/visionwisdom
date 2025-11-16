import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";
import { emptyStringAsOptionalSchema } from "@/util/zod-empty-string-as-optional-schema";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name must be less than 50 characters long." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Category name can only contain letters and spaces.",
    }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(50, { message: "Slug must be less than 50 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
});
export type CategorySchema = z.infer<typeof categorySchema>;

export const getAllCategoriesSchema = z.object({
  page: z.number().int().min(1).optional().default(1).catch(1),
  pageSize: z
    .number()
    .int()
    .min(5)
    .optional()
    .default(DATATABLE_PAGE_SIZE)
    .catch(DATATABLE_PAGE_SIZE),
  search: z.string().optional(),
  sort: z
    .object({
      id: z.enum(["asc", "desc"]),
      name: z.enum(["asc", "desc"]),
      slug: z.enum(["asc", "desc"]),
      createdAt: z.enum(["asc", "desc"]),
      updatedAt: z.enum(["asc", "desc"]),
    })
    .partial()
    .default({ createdAt: "desc" })
    .catch({ createdAt: "desc" }),
});
export type GetAllCategoriesSchema = z.infer<typeof getAllCategoriesSchema>;

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, { message: "Title must be at least 10 characters long." })
    .max(1024, { message: "Title must be less than 1024 characters long." }),
  slug: z
    .string()
    .trim()
    .min(4, { message: "Slug must be at least 4 characters long." })
    .max(1024, { message: "Slug must be less than 1024 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
  status: z
    .enum(["draft", "published", "archived"], {
      error: "Status must be 'draft', 'published', or 'archived'.",
    })
    .default("draft"),
  coverFileId: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Cover Photo is required"
        : "Invalid Cover Photo",
  }),
  content: z
    .string()
    .trim()
    .min(20, { message: "Content must be at least 20 cahracters long." }),
  seoTitle: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(10, { message: "SEO title must be at least 10 characters long." })
      .max(1024, {
        message: "SEO title must be less than 1024 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  seoDescription: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(15, {
        message: "SEO description must be at least 15 characters long.",
      })
      .max(2048, {
        message: "SEO description must be less than 2048 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  seoKeywords: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(10, {
        message: "SEO keywords must be at least 10 characters long.",
      })
      .max(2048, {
        message: "SEO keywords must be less than 2048 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  categoryId: z
    .number({ message: "Invalid Category" })
    .int({ message: "Invalid Category" })
    .optional()
    .nullable()
    .default(null),
  authorId: z
    .number({ message: "Invalid Author" })
    .int({ message: "Invalid Author" })
    .optional()
    .nullable()
    .default(null),
});
export type BlogSchema = z.infer<typeof blogSchema>;
export type BlogSchemaInput = z.input<typeof blogSchema>;

export const getAllBlogsSchema = z.object({
  page: z.number().int().min(1).optional().default(1).catch(1),
  pageSize: z
    .number()
    .int()
    .min(5)
    .optional()
    .default(DATATABLE_PAGE_SIZE)
    .catch(DATATABLE_PAGE_SIZE),
  search: z.string().optional(),
  status: z
    .array(z.enum(["draft", "published", "archived"]))
    .optional()
    .default([])
    .catch([]),
  sort: z
    .object({
      id: z.enum(["asc", "desc"]),
      title: z.enum(["asc", "desc"]),
      slug: z.enum(["asc", "desc"]),
      status: z.enum(["asc", "desc"]),
      category: z.enum(["asc", "desc"]),
      author: z.enum(["asc", "desc"]),
      createdAt: z.enum(["asc", "desc"]),
      updatedAt: z.enum(["asc", "desc"]),
    })
    .partial()
    .default({ createdAt: "desc" }),
  categories: z.array(z.string()).optional().default([]).catch([]),
});
export type GetAllBlogsSchema = z.infer<typeof getAllBlogsSchema>;
