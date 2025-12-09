import z from "zod";
import { UAParser } from "ua-parser-js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { getRequestHeader } from "@tanstack/react-start/server";

import { getCurrentSession } from "./session";
import { getIPAddress } from "../use-cases/location";
import { hashPassword, verifyPassword } from "../use-cases/password";
import {
  loginUserSchema,
  nameSchema,
  newPasswordSchema,
  phoneSchema,
  registerUserSchema,
} from "../../auth.schema";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
} from "../use-cases/sessions";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";

export const loginUser = bos
  .route({ method: "POST", path: "/login" })
  .input(orpcInput({ body: loginUserSchema }))
  .handler(
    async ({
      input: {
        body: { email, password },
      },
      errors,
    }) => {
      const user = await db
        .selectFrom("users")
        .innerJoin("emails", "emails.userId", "users.id")
        .select([
          "users.id as id",
          "users.name",
          "users.password",
          "users.role",
          "emails.email",
        ])
        .where("email", "=", email)
        .executeTakeFirst();

      const errorMessage =
        "Oops! Incorrect email or password. Please try again";

      if (!user) throw errors.UNAUTHORIZED({ message: errorMessage });

      const isPasswordValid = await verifyPassword({
        hashedPassword: user.password,
        password,
      });

      if (!isPasswordValid)
        throw errors.UNAUTHORIZED({ message: errorMessage });

      const ip = getIPAddress() || "0.0.0.0";
      const userAgent = getRequestHeader("user-agent");

      if (!userAgent)
        throw errors.UNAUTHORIZED({ message: "Invalid login attempt" });

      const token = generateSessionToken();
      await createSession({ token, userId: user.id, ip, userAgent });

      setSessionTokenCookie(token);

      return { message: "Login successful" };
    },
  )
  .callable();

export const getCurrentUser = bos
  .route({ method: "GET", path: "/current/user" })
  .handler(async ({ errors }) => {
    const currentSesion = await getCurrentSession();

    const currentUser = await db
      .selectFrom("users")
      .innerJoin("emails", "emails.userId", "users.id")
      .select([
        "users.id",
        "users.name",
        "users.createdAt",
        "users.updatedAt",
        "users.role",
        "emails.email",
      ])
      .where("users.id", "=", currentSesion.userId)
      .executeTakeFirst();

    if (!currentUser) throw errors.UNAUTHORIZED();

    return { session: currentSesion, user: currentUser };
  })
  .callable();

export const logoutUser = bos
  .route({ method: "POST", path: "/logout" })
  .handler(async () => {
    const currentSesion = await getCurrentSession();
    if (currentSesion) {
      await invalidateSession(currentSesion.id);
      deleteSessionTokenCookie();
    }

    return { message: "Logout successful" };
  })
  .callable();

export const registerUser = bos
  .route({ method: "POST", path: "/register" })
  .input(orpcInput({ body: registerUserSchema }))
  .handler(
    async ({
      input: {
        body: { email, password, name, phone },
      },
      errors,
    }) => {
      const existingEmail = await db
        .selectFrom("emails")
        .select("email")
        .where("email", "=", email)
        .executeTakeFirst();

      if (existingEmail) {
        throw errors.CONFLICT({
          message: "An account with this email already exists.",
        });
      }

      const ip = getIPAddress() || "0.0.0.0";
      const userAgent = getRequestHeader("user-agent");

      if (!userAgent) {
        throw errors.INTERNAL_SERVER_ERROR({
          message: "Unable to complete registration",
        });
      }

      const hashedPassword = await hashPassword(password);

      const user = await db
        .insertInto("users")
        .values({
          name,
          password: hashedPassword,
          role: "user",
          phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning(["id"])
        .executeTakeFirstOrThrow();

      await db
        .insertInto("emails")
        .values({
          email,
          userId: user.id,
        })
        .execute();

      const token = generateSessionToken();
      await createSession({ token, userId: user.id, ip, userAgent });
      setSessionTokenCookie(token);

      return {
        message: "Registration successful. Welcome!",
        userId: user.id,
      };
    },
  )
  .callable();

export const getMyProfile = bos
  .route({ method: "GET", path: "/profile" })
  .handler(async ({ errors }) => {
    const auth = await getCurrentUser();

    const user = await db
      .selectFrom("users")
      .innerJoin("emails", "emails.userId", "users.id")
      .select((eb) => [
        "users.id",
        "users.name",
        "users.phone",
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
      .where("users.id", "=", auth.user.id)
      .executeTakeFirst();

    if (!user) throw errors.NOT_FOUND({ message: "User not found" });

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
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
  });

export const updateMyProfile = bos
  .route({ method: "PUT", path: "/profile" })
  .input(
    orpcInput({
      body: z.object({
        name: nameSchema,
        phone: phoneSchema,
      }),
    }),
  )
  .handler(async ({ input: { body }, errors }) => {
    const auth = await getCurrentUser();

    try {
      await db.transaction().execute(async (trx) => {
        await trx
          .updateTable("users")
          .set({
            name: body.name,
            phone: body.phone,
            updatedAt: new Date(),
          })
          .where("users.id", "=", auth.user.id)
          .execute();
      });

      return { message: "Profile updated successfully!" };
    } catch (err) {
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to update profile",
      });
    }
  });

export const changeMyPassword = bos
  .route({ method: "POST", path: "/change-password" })
  .input(
    orpcInput({
      body: z.object({
        password: newPasswordSchema,
      }),
    }),
  )
  .handler(
    async ({
      input: {
        body: { password },
      },
    }) => {
      const hashedPassword = await hashPassword(password);
      const auth = await getCurrentUser();

      await db.transaction().execute(async (trx) => {
        await trx
          .updateTable("users")
          .set({
            password: hashedPassword,
            updatedAt: new Date(),
          })
          .where("users.id", "=", auth.user.id)
          .execute();

        await trx
          .deleteFrom("sessions")
          .where("sessions.userId", "=", auth.user.id)
          .where("sessions.id", "!=", auth.session.id)
          .execute();
      });

      return {
        message:
          "Password changed successfully! Other sessions have been logged out.",
      };
    },
  );

export const terminateMySession = bos
  .route({ method: "POST", path: "/sessions/{id}/terminate" })
  .input(orpcInput({ params: z.object({ id: z.string() }) }))
  .handler(
    async ({
      input: {
        params: { id },
      },
      errors,
    }) => {
      const auth = await getCurrentUser();

      const session = await db
        .selectFrom("sessions")
        .select(["id", "userId"])
        .where("sessions.id", "=", id)
        .executeTakeFirst();

      if (!session) {
        throw errors.NOT_FOUND({ message: "Session not found" });
      }

      if (session.userId !== auth.user.id) {
        throw errors.FORBIDDEN({
          message: "You can only terminate your own sessions",
        });
      }

      if (session.id === auth.session.id) {
        throw errors.BAD_REQUEST({
          message: "You cannot terminate your current session",
        });
      }

      await invalidateSession(id);

      return {
        message: "Session terminated successfully!",
      };
    },
  );

export const deleteMyAccount = bos
  .route({ method: "POST", path: "/delete-account" })
  .handler(async () => {
    const auth = await getCurrentUser();

    await db.deleteFrom("users").where("users.id", "=", auth.user.id).execute();

    return { message: "Account deleted successfully!" };
  });
