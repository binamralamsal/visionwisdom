import z from "zod";
import { sql } from "kysely";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-admin";

export const getAdminStats = bos
  .route({ method: "GET", path: "/stats" })
  .use(ensureAdmin)
  .handler(async () => {
    const [
      blogsCount,
      jobsCount,
      usersCount,
      jobApplicationsCount,
      contactEntriesCount,
      featuredJobsCount,
    ] = await Promise.all([
      db
        .selectFrom("blogs")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("jobs")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("users")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("jobApplications")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("contactEntries")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("jobs")
        .where("isFeatured", "=", true)
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
    ]);

    const usersByRole = await db
      .selectFrom("users")
      .select(["role", db.fn.countAll().as("count")])
      .groupBy("role")
      .execute();

    const jobApplicationsByDay = await db
      .selectFrom("jobApplications")
      .select((cb) => [
        sql<string>`DATE(${cb.ref("createdAt")})`.as("date"),
        db.fn.countAll().as("count"),
      ])
      .where("createdAt", ">=", sql<Date>`NOW() - INTERVAL '30 days'`)
      .groupBy((cb) => sql`DATE(${cb.ref("createdAt")})`)
      .orderBy("date", "asc")
      .execute();

    const contactEntriesByDay = await db
      .selectFrom("contactEntries")
      .select((cb) => [
        sql<string>`DATE(${cb.ref("createdAt")})`.as("date"),
        db.fn.countAll().as("count"),
      ])
      .where("createdAt", ">=", sql<Date>`NOW() - INTERVAL '30 days'`)
      .groupBy((cb) => sql`DATE(${cb.ref("createdAt")})`)
      .orderBy("date", "asc")
      .execute();

    return {
      counts: {
        blogs: Number(blogsCount?.count || 0),
        jobs: Number(jobsCount?.count || 0),
        users: Number(usersCount?.count || 0),
        jobApplications: Number(jobApplicationsCount?.count || 0),
        contactEntries: Number(contactEntriesCount?.count || 0),
        featuredJobs: Number(featuredJobsCount?.count || 0),
      },
      usersByRole: usersByRole.map((r) => ({
        role: r.role,
        count: Number(r.count),
      })),
      jobApplicationsByDay: jobApplicationsByDay.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
      contactEntriesByDay: contactEntriesByDay.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
    };
  });

export const getFeaturedJobs = bos
  .route({ method: "GET", path: "/featured-jobs" })
  .use(ensureAdmin)
  .handler(async () => {
    const jobs = await db
      .selectFrom("jobs")
      .select([
        "id",
        "title",
        "slug",
        "company",
        "location",
        "salary",
        "isFeatured",
        "createdAt",
      ])
      .where("isFeatured", "=", true)
      .orderBy("createdAt", "desc")
      .execute();

    return jobs;
  });

export const toggleJobFeatured = bos
  .route({ method: "POST", path: "/jobs/{id}/toggle-featured" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number().int().positive(),
      }),
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { params } }) => {
    const job = await db
      .selectFrom("jobs")
      .select(["isFeatured"])
      .where("id", "=", params.id)
      .executeTakeFirst();

    if (!job) {
      throw new Error("Job not found");
    }

    await db
      .updateTable("jobs")
      .set({ isFeatured: !job.isFeatured })
      .where("id", "=", params.id)
      .execute();

    return {
      message: job.isFeatured
        ? "Job removed from featured"
        : "Job added to featured",
    };
  });
