import pg from "pg";
import { z } from "zod";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { blogSchema, getAllBlogsSchema } from "../../blogs.schema";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-admin";

const { DatabaseError } = pg;

function getBlogBasicQuery() {
  return db
    .selectFrom("blogs as b")
    .select([
      "b.id",
      "b.title",
      "b.slug",
      "b.seoDescription",
      "b.seoTitle",
      "b.seoKeywords",
      "b.status",
      "b.createdAt",
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("blogCategories as cat")
          .select(["cat.id", "cat.name", "cat.slug"])
          .whereRef("cat.id", "=", "b.categoryId")
          .limit(1),
      ).as("category"),
      jsonObjectFrom(
        eb
          .selectFrom("users")
          .select(["users.id", "users.name"])
          .whereRef("users.id", "=", "b.authorId")
          .limit(1),
      ).as("author"),
      jsonObjectFrom(
        eb
          .selectFrom("uploadedFiles")
          .select([
            "uploadedFiles.id",
            "uploadedFiles.name",
            "uploadedFiles.url",
            "uploadedFiles.fileType",
          ])
          .whereRef("uploadedFiles.id", "=", "b.coverFileId"),
      ).as("coverPhoto"),
      sql<string>`left(regexp_replace(${eb.ref("b.content")}, '<[^>]*>', '', 'g'), 125)`.as(
        "truncatedContent",
      ),
    ]);
}

export const newBlog = bos
  .route({ method: "POST", path: "/" })
  .input(
    orpcInput({
      body: z.object({
        values: blogSchema,
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { body }, context, errors }) => {
    const { values } = body;

    if (!values.authorId) values.authorId = context.auth.user.id;

    try {
      await db.insertInto("blogs").values(values).execute();

      return { message: "Created blog successfully!" };
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.CONFLICT({
          message:
            "A blog with this slug already exists. Please try a different slug.",
        });
      }

      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occurred while creating blog!",
      });
    }
  });

export const updateBlog = bos
  .route({ method: "PUT", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
      body: z.object({
        values: blogSchema,
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { params, body }, context, errors }) => {
    const { values } = body;

    if (!values.authorId) values.authorId = context.auth.user.id;

    try {
      await db
        .updateTable("blogs")
        .set(values)
        .where("id", "=", params.id)
        .execute();

      return { message: "Updated blog successfully!" };
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.CONFLICT({
          message:
            "A blog with this slug already exists. Please try a different slug.",
        });
      }

      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occurred while updating blog!",
      });
    }
  });

export const getBlogById = bos
  .route({ method: "GET", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
    }),
  )
  .handler(async ({ input: { params }, errors }) => {
    const result = await getBlogBasicQuery()
      .where("b.id", "=", params.id)
      .select(["b.content"])
      .executeTakeFirst();

    if (!result) {
      throw errors.NOT_FOUND({ message: "Blog not found" });
    }

    return result;
  });

export const getBlogBySlug = bos
  .route({ method: "GET", path: "/slug/{slug}" })
  .input(
    orpcInput({
      params: z.object({
        slug: z.string(),
      }),
    }),
  )
  .handler(async ({ input: { params }, errors }) => {
    const result = await getBlogBasicQuery()
      .where("b.slug", "=", params.slug)
      .select(["b.content"])
      .executeTakeFirst();

    if (!result) {
      throw errors.NOT_FOUND({ message: "Blog not found" });
    }

    return result;
  });

export const deleteBlog = bos
  .route({ method: "DELETE", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int(),
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { params } }) => {
    await db.deleteFrom("blogs").where("blogs.id", "=", params.id).execute();

    return { message: "Deleted blog successfully!" };
  });

export const getAllBlogs = bos
  .route({ method: "GET", path: "/" })
  .input(orpcInput({ query: getAllBlogsSchema }))
  .handler(async ({ input: { query } }) => {
    const { sort, page, pageSize, search, categories, status } = query;

    function createBaseQuery() {
      let query = db
        .selectFrom("blogs")
        .leftJoin("blogCategories", "blogCategories.id", "blogs.categoryId")
        .leftJoin("users", "users.id", "blogs.authorId");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;

        query = query.where((eb) =>
          eb.or([
            eb("blogs.title", "ilike", searchTerm),
            eb("blogs.slug", "ilike", searchTerm),
            eb("blogs.seoTitle", "ilike", searchTerm),
            eb("blogs.seoKeywords", "ilike", searchTerm),
            eb("users.name", "ilike", searchTerm),
          ]),
        );
      }

      if (categories.length > 0) {
        query = query.where("blogCategories.slug", "in", categories);
      }

      if (status.length > 0) {
        query = query.where("blogs.status", "in", status);
      }

      return query;
    }

    let blogsQuery = createBaseQuery()
      .select([
        "blogs.title",
        "blogs.id",
        "blogs.slug",
        "blogs.status",
        "blogs.createdAt",
        "blogs.updatedAt",
        "blogs.status",
        "blogCategories.id as categoryId",
        "blogCategories.name as categoryName",
        "blogCategories.slug as categorySlug",
      ])
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("uploadedFiles")
            .select([
              "uploadedFiles.id",
              "uploadedFiles.name",
              "uploadedFiles.url",
              "uploadedFiles.fileType",
            ])
            .whereRef("uploadedFiles.id", "=", "blogs.coverFileId"),
        ).as("coverPhoto"),
        jsonObjectFrom(
          eb
            .selectFrom("users")
            .select(["users.id", "users.name"])
            .whereRef("users.id", "=", "blogs.authorId")
            .limit(1),
        ).as("author"),
        sql<string>`left(regexp_replace(${eb.ref("blogs.content")}, '<[^>]*>', '', 'g'), 125)`.as(
          "truncatedContent",
        ),
      ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      const columnName = column as keyof (typeof query)["sort"];
      if (columnName === "category") {
        blogsQuery = blogsQuery.orderBy("blogCategories.name", direction);
      } else if (columnName === "author") {
        blogsQuery = blogsQuery.orderBy("users.name", direction);
      } else {
        blogsQuery = blogsQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    blogsQuery = blogsQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [blogs, countResult] = await Promise.all([
      blogsQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      blogs,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });
