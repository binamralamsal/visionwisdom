import pg from "pg";
import { z } from "zod";

import { categorySchema, getAllCategoriesSchema } from "../../blogs.schema";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const newCategory = bos
  .route({ method: "POST", path: "/" })
  .input(
    orpcInput({
      body: z.object({
        values: categorySchema,
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { body }, errors }) => {
    try {
      await db.insertInto("blogCategories").values(body.values).execute();
      return { message: "Created category successfully!" };
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.CONFLICT({
          message:
            "A category with this slug already exists. Please try a different slug.",
        });
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occurred while creating category!",
      });
    }
  });

export const updateCategory = bos
  .route({ method: "PUT", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
      body: z.object({
        values: categorySchema,
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { params, body }, errors }) => {
    try {
      await db
        .updateTable("blogCategories")
        .set(body.values)
        .where("blogCategories.id", "=", params.id)
        .execute();

      return { message: "Updated category successfully!" };
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.CONFLICT({
          message:
            "A category with this slug already exists. Please try a different slug.",
        });
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occurred while updating category!",
      });
    }
  });

export const getAllCategories = bos
  .route({ method: "GET", path: "/" })
  .input(orpcInput({ query: getAllCategoriesSchema }))
  .handler(async ({ input: { query } }) => {
    const { sort, page, pageSize, search } = query;

    function createBaseQuery() {
      let query = db.selectFrom("blogCategories");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("blogCategories.name", "ilike", searchTerm),
            eb("blogCategories.slug", "ilike", searchTerm),
          ]),
        );
      }

      return query;
    }

    let categoriesQuery = createBaseQuery().select([
      "id",
      "name",
      "slug",
      "createdAt",
      "updatedAt",
    ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;
      categoriesQuery = categoriesQuery.orderBy(
        column as keyof (typeof query)["sort"],
        direction,
      );
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    categoriesQuery = categoriesQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [categories, countResult] = await Promise.all([
      categoriesQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      categories,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });

export const getCategoryById = bos
  .route({ method: "GET", path: "/{id}" })
  .input(
    orpcInput({ params: z.object({ id: z.coerce.number().int().positive() }) }),
  )
  .handler(
    async ({
      input: {
        params: { id },
      },
      errors,
    }) => {
      const result = await db
        .selectFrom("blogCategories")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

      if (!result) {
        throw errors.NOT_FOUND({ message: "Category not found" });
      }

      return result;
    },
  );

export const deleteCategory = bos
  .route({ method: "DELETE", path: "/{id}" })
  .input(orpcInput({ params: z.object({ id: z.coerce.number().int() }) }))
  .use(ensureAdmin)
  .handler(
    async ({
      input: {
        params: { id },
      },
    }) => {
      await db
        .deleteFrom("blogCategories")
        .where("blogCategories.id", "=", id)
        .execute();

      return { message: "Deleted category successfully!" };
    },
  )
  .callable();
