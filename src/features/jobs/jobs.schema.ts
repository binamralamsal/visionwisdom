import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";
import { emptyStringAsOptionalSchema } from "@/util/zod-empty-string-as-optional-schema";

export const jobCategorySchema = z.object({
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
export type JobCategorySchema = z.infer<typeof jobCategorySchema>;

export const getAllJobCategoriesSchema = z.object({
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
export type GetAllJobCategoriesSchema = z.infer<
  typeof getAllJobCategoriesSchema
>;

export const jobSchema = z.object({
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
  description: z
    .string()
    .trim()
    .min(20, { message: "Description must be at least 20 characters long." }),
  company: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(2, { message: "Company name must be at least 2 characters long." })
      .max(255, {
        message: "Company name must be less than 255 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  location: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(2, { message: "Location must be at least 2 characters long." })
      .max(255, { message: "Location must be less than 255 characters long." })
      .optional()
      .nullable()
      .default(null),
  ),
  gender: z.enum(["any", "male", "female"], {
    error: "Gender must be 'any', 'male', or 'female'.",
  }),
  salary: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .max(255, { message: "Salary must be less than 255 characters long." })
      .optional()
      .nullable()
      .default(null),
  ),
  contractLength: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .max(255, {
        message: "Contract length must be less than 255 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  workingHours: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .max(255, {
        message: "Working hours must be less than 255 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  experience: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .max(255, {
        message: "Experience must be less than 255 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  documentsRequired: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .max(1024, {
        message: "Documents required must be less than 1024 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  status: z
    .enum(["draft", "published", "closed", "archived"], {
      error: "Status must be 'draft', 'published', 'closed', or 'archived'.",
    })
    .default("draft"),
  categoryId: z
    .number({ message: "Invalid Category" })
    .int({ message: "Invalid Category" })
    .optional()
    .nullable()
    .default(null),
  fileId: z
    .number({ message: "Invalid File" })
    .int({ message: "Invalid File" })
    .optional()
    .nullable()
    .default(null),
});
export type JobSchema = z.infer<typeof jobSchema>;
export type JobSchemaInput = z.input<typeof jobSchema>;

export const getAllJobsSchema = z.object({
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
    .array(z.enum(["draft", "published", "closed", "archived"]))
    .optional()
    .default([])
    .catch([]),
  gender: z
    .array(z.enum(["any", "male", "female"]))
    .optional()
    .default([])
    .catch([]),
  sort: z
    .object({
      id: z.enum(["asc", "desc"]),
      title: z.enum(["asc", "desc"]),
      slug: z.enum(["asc", "desc"]),
      company: z.enum(["asc", "desc"]),
      location: z.enum(["asc", "desc"]),
      gender: z.enum(["asc", "desc"]),
      status: z.enum(["asc", "desc"]),
      category: z.enum(["asc", "desc"]),
      createdAt: z.enum(["asc", "desc"]),
      updatedAt: z.enum(["asc", "desc"]),
    })
    .partial()
    .default({ createdAt: "desc" }),
  categories: z.array(z.string()).optional().default([]).catch([]),
});
export type GetAllJobsSchema = z.infer<typeof getAllJobsSchema>;
