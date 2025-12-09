import z from "zod";

import {
  getAllJobApplicationsSchema,
  jobApplicationSchema,
} from "../../jobs.schema";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-auth";
import { getCurrentUser } from "@/features/auth/server/services/user";

export const newJobApplication = bos
  .route({ method: "POST", path: "/new" })
  .input(orpcInput({ body: jobApplicationSchema }))
  .handler(async ({ input: { body }, errors }) => {
    const auth = await getCurrentUser();

    try {
      await db
        .insertInto("jobApplications")
        .values({
          userId: auth.user.id,
          name: body.name,
          phone: body.phone,
          email: body.email,
          preferredCountries: body.preferredCountries,
          preferredPosition: body.preferredPosition,
          resumeFileId: body.resumeFileId,
          passportFileId: body.passportFileId,
          medicalReportFileId: body.medicalReportFileId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .execute();

      return { message: "Job application submitted successfully." };
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to submit job application.",
      });
    }
  });

export const getAllJobApplications = bos
  .route({ method: "GET", path: "/all" })
  .input(orpcInput({ query: getAllJobApplicationsSchema }))
  .use(ensureAdmin)
  .handler(async ({ input: { query } }) => {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const offset = (page - 1) * pageSize;
    const search = query.search?.trim();

    let baseQuery = db
      .selectFrom("jobApplications")
      .select([
        "jobApplications.id",
        "jobApplications.userId",
        "jobApplications.name",
        "jobApplications.phone",
        "jobApplications.email",
        "jobApplications.preferredCountries",
        "jobApplications.preferredPosition",
        "jobApplications.resumeFileId",
        "jobApplications.passportFileId",
        "jobApplications.medicalReportFileId",
        "jobApplications.createdAt",
        "jobApplications.updatedAt",
      ]);

    if (search) {
      baseQuery = baseQuery.where((eb) =>
        eb.or([
          eb("jobApplications.name", "ilike", `%${search}%`),
          eb("jobApplications.email", "ilike", `%${search}%`),
          eb("jobApplications.phone", "ilike", `%${search}%`),
          eb("jobApplications.preferredCountries", "ilike", `%${search}%`),
          eb("jobApplications.preferredPosition", "ilike", `%${search}%`),
        ]),
      );
    }

    const sort = query.sort ?? { createdAt: "desc" };
    Object.entries(sort).forEach(([key, direction]) => {
      if (!direction) return;
      baseQuery = baseQuery.orderBy(`jobApplications.${key}` as any, direction);
    });

    const [items, totalRow] = await Promise.all([
      baseQuery.limit(pageSize).offset(offset).execute(),
      baseQuery
        .clearSelect()
        .clearOrderBy()
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst(),
    ]);

    const total = Number(totalRow?.count ?? 0);

    return {
      items,
      page,
      pageSize,
      total,
    };
  });

export const getMyJobApplications = bos
  .route({ method: "GET", path: "/mine" })
  .input(
    orpcInput({
      query: getAllJobApplicationsSchema.omit({ sort: true }).extend({
        sort: getAllJobApplicationsSchema.shape.sort
          .optional()
          .default({ createdAt: "desc" })
          .catch({ createdAt: "desc" }),
      }),
    }),
  )
  .handler(async ({ input: { query } }) => {
    const auth = await getCurrentUser();

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const offset = (page - 1) * pageSize;
    const search = query.search?.trim();

    let baseQuery = db
      .selectFrom("jobApplications")
      .select([
        "jobApplications.id",
        "jobApplications.userId",
        "jobApplications.name",
        "jobApplications.phone",
        "jobApplications.email",
        "jobApplications.preferredCountries",
        "jobApplications.preferredPosition",
        "jobApplications.resumeFileId",
        "jobApplications.passportFileId",
        "jobApplications.medicalReportFileId",
        "jobApplications.createdAt",
        "jobApplications.updatedAt",
      ])
      .where("jobApplications.userId", "=", auth.user.id);

    if (search) {
      baseQuery = baseQuery.where((eb) =>
        eb.or([
          eb("jobApplications.preferredCountries", "ilike", `%${search}%`),
          eb("jobApplications.preferredPosition", "ilike", `%${search}%`),
        ]),
      );
    }

    const sort = query.sort ?? { createdAt: "desc" };
    Object.entries(sort).forEach(([key, direction]) => {
      if (!direction) return;
      baseQuery = baseQuery.orderBy(`jobApplications.${key}` as any, direction);
    });

    const [items, totalRow] = await Promise.all([
      baseQuery.limit(pageSize).offset(offset).execute(),
      baseQuery
        .clearSelect()
        .clearOrderBy()
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst(),
    ]);

    const total = Number(totalRow?.count ?? 0);

    return {
      items,
      page,
      pageSize,
      total,
    };
  });

export const getJobApplicationById = bos
  .route({ method: "GET", path: "/{id}" })
  .input(orpcInput({ params: z.object({ id: z.int() }) }))
  .handler(async ({ input: { params }, errors }) => {
    const auth = await getCurrentUser();

    const application = await db
      .selectFrom("jobApplications")
      .select([
        "jobApplications.id",
        "jobApplications.userId",
        "jobApplications.name",
        "jobApplications.phone",
        "jobApplications.email",
        "jobApplications.preferredCountries",
        "jobApplications.preferredPosition",
        "jobApplications.resumeFileId",
        "jobApplications.passportFileId",
        "jobApplications.medicalReportFileId",
        "jobApplications.createdAt",
        "jobApplications.updatedAt",
      ])
      .where("jobApplications.id", "=", params.id)
      .executeTakeFirst();

    if (!application) {
      throw errors.NOT_FOUND({ message: "Application not found." });
    }

    if (auth.user.role !== "admin" && application.userId !== auth.user.id) {
      throw errors.FORBIDDEN({
        message: "You can only view your own applications.",
      });
    }

    return application;
  });

export const deleteJobApplication = bos
  .route({ method: "DELETE", path: "/{id}" })
  .input(orpcInput({ params: z.object({ id: z.int() }) }))
  .use(ensureAdmin)
  .handler(async ({ input: { params } }) => {
    await db
      .deleteFrom("jobApplications")
      .where("jobApplications.id", "=", params.id)
      .executeTakeFirst();

    return {
      message: "Job application deleted successfully.",
    };
  });
