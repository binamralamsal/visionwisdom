import { mos } from "../bos";

import { getCurrentUser } from "@/features/auth/server/services/user";

export const ensureAdmin = mos.middleware(async ({ errors, next }) => {
  try {
    const auth = await getCurrentUser();
    if (auth.user.role !== "admin") {
      throw errors.UNAUTHORIZED();
    }

    return next({ context: { auth } });
  } catch (error) {
    throw errors.UNAUTHORIZED();
  }
});
