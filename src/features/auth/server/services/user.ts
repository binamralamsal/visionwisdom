import { getRequestHeader } from "@tanstack/react-start/server";

import { getCurrentSession } from "./session";
import { loginUserSchema } from "../../auth.schema";
import { getIPAddress } from "../use-cases/location";
import { verifyPassword } from "../use-cases/password";
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
  // .output(z.object({ token: z.string() }))
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
