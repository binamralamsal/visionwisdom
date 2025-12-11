import pg from "pg";
import { z } from "zod";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { getAllJobsSchema, jobSchema } from "../../jobs.schema";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-admin";

const { DatabaseError } = pg;

function getJobBasicQuery() {
  return db
    .selectFrom("jobs as j")
    .select([
      "j.id",
      "j.title",
      "j.slug",
      "j.company",
      "j.location",
      "j.gender",
      "j.salary",
      "j.contractLength",
      "j.workingHours",
      "j.experience",
      "j.documentsRequired",
      "j.status",
      "j.createdAt",
      "j.updatedAt",
      "j.isFeatured",
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("jobCategories as cat")
          .select(["cat.id", "cat.name", "cat.slug"])
          .whereRef("cat.id", "=", "j.categoryId")
          .limit(1),
      ).as("category"),
      jsonObjectFrom(
        eb
          .selectFrom("uploadedFiles")
          .select([
            "uploadedFiles.id",
            "uploadedFiles.name",
            "uploadedFiles.url",
            "uploadedFiles.fileType",
          ])
          .whereRef("uploadedFiles.id", "=", "j.fileId")
          .limit(1),
      ).as("file"),
      sql<string>`left(regexp_replace(${eb.ref("j.description")}, '<[^>]*>', '', 'g'), 125)`.as(
        "truncatedDescription",
      ),
    ]);
}

export const newJob = bos
  .route({ method: "POST", path: "/" })
  .input(
    orpcInput({
      body: z.object({
        values: jobSchema,
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { body }, errors }) => {
    const { values } = body;

    try {
      await db.insertInto("jobs").values(values).execute();
      return { message: "Created job successfully!" };
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.CONFLICT({
          message:
            "A job with this slug already exists. Please try a different slug.",
        });
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occurred while creating job!",
      });
    }
  });

export const updateJob = bos
  .route({ method: "PUT", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
      body: z.object({
        values: jobSchema,
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { params, body }, errors }) => {
    const { values } = body;

    try {
      await db
        .updateTable("jobs")
        .set(values)
        .where("id", "=", params.id)
        .execute();

      return { message: "Updated job successfully!" };
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.CONFLICT({
          message:
            "A job with this slug already exists. Please try a different slug.",
        });
      }
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occurred while updating job!",
      });
    }
  });

export const getJobById = bos
  .route({ method: "GET", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
    }),
  )
  .handler(async ({ input: { params }, errors }) => {
    const result = await getJobBasicQuery()
      .where("j.id", "=", params.id)
      .select(["j.description"])
      .executeTakeFirst();

    if (!result) {
      throw errors.NOT_FOUND({ message: "Job not found" });
    }

    return result;
  });

export const getJobBySlug = bos
  .route({ method: "GET", path: "/slug/{slug}" })
  .input(
    orpcInput({
      params: z.object({
        slug: z.string(),
      }),
    }),
  )
  .handler(async ({ input: { params }, errors }) => {
    const result = await getJobBasicQuery()
      .where("j.slug", "=", params.slug)
      .select(["j.description"])
      .executeTakeFirst();

    if (!result) {
      throw errors.NOT_FOUND({ message: "Job not found" });
    }

    return result;
  });

export const deleteJob = bos
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
    await db.deleteFrom("jobs").where("jobs.id", "=", params.id).execute();
    return { message: "Deleted job successfully!" };
  });

export const getAllJobs = bos
  .route({ method: "GET", path: "/" })
  .input(orpcInput({ query: getAllJobsSchema }))
  .handler(async ({ input: { query } }) => {
    const {
      sort,
      page,
      pageSize,
      search,
      categories,
      status,
      gender,
      isFeatured,
    } = query;

    function createBaseQuery() {
      let query = db
        .selectFrom("jobs")
        .leftJoin("jobCategories", "jobCategories.id", "jobs.categoryId")
        .leftJoin("uploadedFiles", "uploadedFiles.id", "jobs.fileId");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("jobs.title", "ilike", searchTerm),
            eb("jobs.slug", "ilike", searchTerm),
            eb("jobs.company", "ilike", searchTerm),
            eb("jobs.location", "ilike", searchTerm),
            eb("jobs.description", "ilike", searchTerm),
          ]),
        );
      }

      if (categories.length > 0) {
        query = query.where("jobCategories.slug", "in", categories);
      }

      if (status.length > 0) {
        query = query.where("jobs.status", "in", status);
      }

      if (gender.length > 0) {
        query = query.where("jobs.gender", "in", gender);
      }

      if (isFeatured.length > 0) {
        query = query.where(
          "jobs.isFeatured",
          "in",
          isFeatured.map((v) => v === "yes"),
        );
      }

      return query;
    }

    let jobsQuery = createBaseQuery()
      .select([
        "jobs.id",
        "jobs.title",
        "jobs.slug",
        "jobs.company",
        "jobs.location",
        "jobs.salary",
        "jobs.gender",
        "jobs.status",
        "jobs.createdAt",
        "jobs.updatedAt",
        "jobs.isFeatured",
        "jobCategories.id as categoryId",
        "jobCategories.name as categoryName",
        "jobCategories.slug as categorySlug",
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
            .whereRef("uploadedFiles.id", "=", "jobs.fileId")
            .limit(1),
        ).as("file"),
        sql<string>`left(regexp_replace(${eb.ref("jobs.description")}, '<[^>]*>', '', 'g'), 125)`.as(
          "truncatedDescription",
        ),
      ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      const columnName = column as keyof (typeof query)["sort"];
      if (columnName === "category") {
        jobsQuery = jobsQuery.orderBy("jobCategories.name", direction);
      } else {
        jobsQuery = jobsQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    jobsQuery = jobsQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [jobs, countResult] = await Promise.all([
      jobsQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      jobs,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });
