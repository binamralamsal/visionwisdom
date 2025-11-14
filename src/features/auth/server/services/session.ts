import { getCookie } from "@tanstack/react-start/server";

import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from "../use-cases/sessions";

import { bos } from "@/orpc/bos";
import { SESSION_COOKIE_NAME } from "@/config/constants";

export const getCurrentSession = bos
  .route({ method: "GET", path: "/current/session" })
  .handler(async ({ errors }) => {
    const token = getCookie(SESSION_COOKIE_NAME);
    if (!token) throw errors.UNAUTHORIZED();

    const result = await validateSessionToken(token);
    if (!result) {
      deleteSessionTokenCookie();
      throw errors.UNAUTHORIZED();
    } else setSessionTokenCookie(token);

    return result;
  })
  .callable();
