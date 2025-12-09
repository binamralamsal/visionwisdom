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
      .leftJoin(
        "uploadedFiles as resumeFile",
        "resumeFile.id",
        "jobApplications.resumeFileId",
      )
      .leftJoin(
        "uploadedFiles as passportFile",
        "passportFile.id",
        "jobApplications.passportFileId",
      )
      .leftJoin(
        "uploadedFiles as medicalFile",
        "medicalFile.id",
        "jobApplications.medicalReportFileId",
      )
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

        "resumeFile.name as resumeFileName",
        "resumeFile.url as resumeFileUrl",
        "resumeFile.fileType as resumeFileType",

        "passportFile.name as passportFileName",
        "passportFile.url as passportFileUrl",
        "passportFile.fileType as passportFileType",

        "medicalFile.name as medicalFileName",
        "medicalFile.url as medicalFileUrl",
        "medicalFile.fileType as medicalFileType",
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

    const [rows, totalRow] = await Promise.all([
      baseQuery.limit(pageSize).offset(offset).execute(),
      baseQuery
        .clearSelect()
        .clearOrderBy()
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst(),
    ]);

    const total = Number(totalRow?.count ?? 0);

    const items = rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      phone: row.phone,
      email: row.email,
      preferredCountries: row.preferredCountries,
      preferredPosition: row.preferredPosition,
      resumeFileId: row.resumeFileId,
      passportFileId: row.passportFileId,
      medicalReportFileId: row.medicalReportFileId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resumeFile: row.resumeFileId
        ? {
            id: row.resumeFileId,
            name: row.resumeFileName,
            url: row.resumeFileUrl,
            fileType: row.resumeFileType,
          }
        : null,
      passportFile: row.passportFileId
        ? {
            id: row.passportFileId,
            name: row.passportFileName,
            url: row.passportFileUrl,
            fileType: row.passportFileType,
          }
        : null,
      medicalReportFile: row.medicalReportFileId
        ? {
            id: row.medicalReportFileId,
            name: row.medicalFileName,
            url: row.medicalFileUrl,
            fileType: row.medicalFileType,
          }
        : null,
    }));

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
      .leftJoin(
        "uploadedFiles as resumeFile",
        "resumeFile.id",
        "jobApplications.resumeFileId",
      )
      .leftJoin(
        "uploadedFiles as passportFile",
        "passportFile.id",
        "jobApplications.passportFileId",
      )
      .leftJoin(
        "uploadedFiles as medicalFile",
        "medicalFile.id",
        "jobApplications.medicalReportFileId",
      )
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

        "resumeFile.name as resumeFileName",
        "resumeFile.url as resumeFileUrl",
        "resumeFile.fileType as resumeFileType",

        "passportFile.name as passportFileName",
        "passportFile.url as passportFileUrl",
        "passportFile.fileType as passportFileType",

        "medicalFile.name as medicalFileName",
        "medicalFile.url as medicalFileUrl",
        "medicalFile.fileType as medicalFileType",
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

    const [rows, totalRow] = await Promise.all([
      baseQuery.limit(pageSize).offset(offset).execute(),
      baseQuery
        .clearSelect()
        .clearOrderBy()
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst(),
    ]);

    const total = Number(totalRow?.count ?? 0);

    const items = rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      name: row.name,
      phone: row.phone,
      email: row.email,
      preferredCountries: row.preferredCountries,
      preferredPosition: row.preferredPosition,
      resumeFileId: row.resumeFileId,
      passportFileId: row.passportFileId,
      medicalReportFileId: row.medicalReportFileId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resumeFile: row.resumeFileId
        ? {
            id: row.resumeFileId,
            name: row.resumeFileName,
            url: row.resumeFileUrl,
            fileType: row.resumeFileType,
          }
        : null,
      passportFile: row.passportFileId
        ? {
            id: row.passportFileId,
            name: row.passportFileName,
            url: row.passportFileUrl,
            fileType: row.passportFileType,
          }
        : null,
      medicalReportFile: row.medicalReportFileId
        ? {
            id: row.medicalReportFileId,
            name: row.medicalFileName,
            url: row.medicalFileUrl,
            fileType: row.medicalFileType,
          }
        : null,
    }));

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

    const row = await db
      .selectFrom("jobApplications")
      .leftJoin(
        "uploadedFiles as resumeFile",
        "resumeFile.id",
        "jobApplications.resumeFileId",
      )
      .leftJoin(
        "uploadedFiles as passportFile",
        "passportFile.id",
        "jobApplications.passportFileId",
      )
      .leftJoin(
        "uploadedFiles as medicalFile",
        "medicalFile.id",
        "jobApplications.medicalReportFileId",
      )
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

        "resumeFile.name as resumeFileName",
        "resumeFile.url as resumeFileUrl",
        "resumeFile.fileType as resumeFileType",

        "passportFile.name as passportFileName",
        "passportFile.url as passportFileUrl",
        "passportFile.fileType as passportFileType",

        "medicalFile.name as medicalFileName",
        "medicalFile.url as medicalFileUrl",
        "medicalFile.fileType as medicalFileType",
      ])
      .where("jobApplications.id", "=", params.id as unknown as number)
      .executeTakeFirst();

    if (!row) {
      throw errors.NOT_FOUND({ message: "Application not found." });
    }

    if (auth.user.role !== "admin" && row.userId !== auth.user.id) {
      throw errors.FORBIDDEN({
        message: "You can only view your own applications.",
      });
    }

    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      phone: row.phone,
      email: row.email,
      preferredCountries: row.preferredCountries,
      preferredPosition: row.preferredPosition,
      resumeFileId: row.resumeFileId,
      passportFileId: row.passportFileId,
      medicalReportFileId: row.medicalReportFileId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resumeFile: row.resumeFileId
        ? {
            id: row.resumeFileId,
            name: row.resumeFileName,
            url: row.resumeFileUrl,
            fileType: row.resumeFileType,
          }
        : null,
      passportFile: row.passportFileId
        ? {
            id: row.passportFileId,
            name: row.passportFileName,
            url: row.passportFileUrl,
            fileType: row.passportFileType,
          }
        : null,
      medicalReportFile: row.medicalReportFileId
        ? {
            id: row.medicalReportFileId,
            name: row.medicalFileName,
            url: row.medicalFileUrl,
            fileType: row.medicalFileType,
          }
        : null,
    };
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
