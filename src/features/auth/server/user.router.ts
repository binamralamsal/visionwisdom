import { getCurrentSession } from "./services/session";
import {
  changeUserPassword,
  createNewUser,
  deleteUser,
  getAllUsers,
  getUser,
  terminateSession,
  updateUser,
} from "./services/admin-user";
import {
  changeMyPassword,
  deleteMyAccount,
  getCurrentUser,
  getMyProfile,
  loginUser,
  logoutUser,
  registerUser,
  terminateMySession,
  updateMyProfile,
} from "./services/user";

import { bos } from "@/orpc/bos";

export const users = bos
  .prefix("/users")
  .tag("User")
  .router({
    login: loginUser,
    logout: logoutUser,
    register: registerUser,
    current: {
      session: getCurrentSession,
      user: getCurrentUser,
    },
    profile: {
      get: getMyProfile,
      update: updateMyProfile,
      changePassword: changeMyPassword,
      terminateSession: terminateMySession,
      deleteAccount: deleteMyAccount,
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
