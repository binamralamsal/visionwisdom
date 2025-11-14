import pg from "pg";
import z from "zod";
import { UAParser } from "ua-parser-js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { hashPassword } from "../use-cases/password";
import { invalidateSession } from "../use-cases/sessions";
import {
  getAllUsersSchema,
  newPasswordSchema,
  newUserSchema,
  updateUserSchema,
} from "../../auth.schema";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const getUser = bos
  .route({ method: "GET", path: "/{id}" })
  .input(orpcInput({ params: z.object({ id: z.coerce.number() }) }))
  .use(ensureAdmin)
  .handler(
    async ({
      errors,
      input: {
        params: { id },
      },
      context: { auth },
    }) => {
      const user = await db
        .selectFrom("users")
        .innerJoin("emails", "emails.userId", "users.id")
        .select((eb) => [
          "users.id",
          "users.name",
          "users.role",
          "emails.email",
          jsonArrayFrom(
            eb
              .selectFrom("sessions")
              .select([
                "sessions.id",
                "sessions.userAgent",
                "sessions.ip",
                "sessions.country",
                "sessions.region",
                "sessions.city",
              ])
              .whereRef("sessions.userId", "=", "users.id")
              .orderBy("sessions.createdAt", "desc"),
          ).as("sessions"),
        ])
        .where("users.id", "=", id)
        .executeTakeFirst();

      if (!user) throw errors.NOT_FOUND({ message: "User not found" });

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        sessions: user.sessions.map((session) => {
          const { browser, os } = UAParser(session.userAgent);

          return {
            id: session.id,
            ip: session.ip,
            userAgent: session.userAgent,
            isCurrent: session.id === auth.session.id,
            browser: browser.name,
            os: os.name,
            country: session.country,
            region: session.region,
            city: session.city,
          };
        }),
      };
    },
  );

export const getAllUsers = bos
  .route({ method: "GET", path: "/all" })
  .input(orpcInput({ query: getAllUsersSchema }))
  .use(ensureAdmin)
  .handler(async ({ input: { query } }) => {
    const { sort, page, pageSize, search, role } = query;

    function createBaseQuery() {
      let query = db
        .selectFrom("users")
        .innerJoin("emails", "emails.userId", "users.id");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("users.name", "ilike", searchTerm),
            eb("emails.email", "ilike", searchTerm),
          ]),
        );
      }

      if (role && role.length > 0) {
        query = query.where("users.role", "in", role);
      }

      return query;
    }

    let usersQuery = createBaseQuery().select([
      "users.id",
      "users.name",
      "users.role",
      "users.createdAt",
      "users.updatedAt",
      "emails.email",
    ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      if (column === "email") {
        usersQuery = usersQuery.orderBy("emails.email", direction);
      } else {
        const columnName = `users.${column}` as Exclude<
          keyof (typeof query)["sort"],
          "email"
        >;
        usersQuery = usersQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    usersQuery = usersQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [users, countResult] = await Promise.all([
      usersQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      users,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });

export const createNewUser = bos
  .route({ method: "POST", path: "/" })
  .input(
    orpcInput({
      body: newUserSchema,
    }),
  )
  .use(ensureAdmin)
  .handler(async ({ input: { body }, errors }) => {
    const hashedPassword = await hashPassword(body.password);

    try {
      await db.transaction().execute(async (trx) => {
        const { id: userId } = await trx
          .insertInto("users")
          .values({
            name: body.name,
            password: hashedPassword,
            role: body.role,
          })
          .returning(["id"])
          .executeTakeFirstOrThrow();
        await trx
          .insertInto("emails")
          .values({ userId, email: body.email })
          .executeTakeFirstOrThrow();
      });
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        throw errors.UNAUTHORIZED({
          message:
            "A user with this email address already exists. Please try a different email.",
        });
      }

      throw errors.INTERNAL_SERVER_ERROR({
        message: "Internal server error occured while creating user!",
      });
    }

    return { message: "User created successfully!" };
  });

export const changeUserPassword = bos
  .route({ method: "POST", path: "/{id}/change-password" })
  .input(
    orpcInput({
      params: z.object({
        id: z.coerce.number(),
      }),
      body: z.object({ password: newPasswordSchema }),
    }),
  )
  .use(ensureAdmin)
  .handler(
    async ({
      input: {
        params: { id },
        body: { password },
      },
    }) => {
      const hashedPassword = await hashPassword(password);

      await db.transaction().execute(async (trx) => {
        await trx
          .updateTable("users")
          .set({ password: hashedPassword })
          .where("users.id", "=", id)
          .execute();

        await trx
          .deleteFrom("sessions")
          .where("sessions.userId", "=", id)
          .execute();
      });

      return {
        message: "User password updated successfully!",
      };
    },
  );

// export const terminateSessionFn = createServerFn()
//   .middleware([ensureAdmin])
//   .validator(z.string())
//   .handler(async ({ data }) => {
//     await invalidateSession(data);

//     return { status: "SUCCESS", message: "Terminated the given user session!" };
//   });
export const terminateSession = bos
  .route({ method: "POST", path: "/{id}/terminate" })
  .input(orpcInput({ params: z.object({ id: z.string() }) }))
  .use(ensureAdmin)
  .handler(
    async ({
      input: {
        params: { id },
      },
    }) => {
      await invalidateSession(id);

      return {
        message: "Terminated the given user session!",
      };
    },
  )
  .callable();

export const deleteUser = bos
  .route({ method: "POST", path: "/{id}/delete" })
  .input(orpcInput({ params: z.object({ id: z.coerce.number().int() }) }))
  .use(ensureAdmin)
  .handler(
    async ({
      input: {
        params: { id },
      },
    }) => {
      await db.deleteFrom("users").where("users.id", "=", id).execute();

      return { message: "Deleted user successfully!" };
    },
  )
  .callable();

export const updateUser = bos
  .route({ method: "PUT", path: "/{id}" })
  .input(
    orpcInput({
      params: z.object({ id: z.coerce.number().int() }),
      body: updateUserSchema,
    }),
  )
  .use(ensureAdmin)
  .handler(
    async ({
      input: {
        body,
        params: { id },
      },
    }) => {
      await db.transaction().execute(async (trx) => {
        await trx
          .updateTable("users")
          .set({ name: body.name, role: body.role })
          .where("users.id", "=", id)
          .execute();

        await trx
          .updateTable("emails")
          .set({ email: body.email })
          .where("emails.userId", "=", id)
          .execute();
      });

      return { message: "User updated successfully!" };
    },
  );
