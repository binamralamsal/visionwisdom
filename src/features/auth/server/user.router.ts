import { getCurrentSession } from "./services/session";
import { getCurrentUser, loginUser, logoutUser } from "./services/user";
import {
  changeUserPassword,
  createNewUser,
  deleteUser,
  getAllUsers,
  getUser,
  terminateSession,
  updateUser,
} from "./services/admin-user";

import { bos } from "@/orpc/bos";

export const users = bos
  .prefix("/users")
  .tag("User")
  .router({
    login: loginUser,
    logout: logoutUser,
    current: {
      session: getCurrentSession,
      user: getCurrentUser,
    },
    admin: {
      get: getUser,
      all: getAllUsers,
      create: createNewUser,
      changePassword: changeUserPassword,
      terminateSession,
      delete: deleteUser,
      update: updateUser,
    },
  });
