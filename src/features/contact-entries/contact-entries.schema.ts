import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";

export const contactEntrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .trim()
    .length(10, { message: "Phone number must be exactly 10 digits." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." })
    .refine((val) => val.startsWith("98") || val.startsWith("97"), {
      message: "Phone number must start with 98 or 97.",
    }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(500, { message: "Message cannot exceed 500 characters." }),
});
export type ContactEntrySchema = z.infer<typeof contactEntrySchema>;

export const getAllContactEntriesSchema = z.object({
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
      email: z.enum(["asc", "desc"]),
      phone: z.enum(["asc", "desc"]),
      createdAt: z.enum(["asc", "desc"]),
      updatedAt: z.enum(["asc", "desc"]),
    })
    .partial()
    .default({ createdAt: "desc" })
    .catch({ createdAt: "desc" }),
});
export type GetAllContactEntriesSchema = z.infer<
  typeof getAllContactEntriesSchema
>;
