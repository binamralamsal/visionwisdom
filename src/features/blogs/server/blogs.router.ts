import {
  deleteCategory,
  getAllCategories,
  getCategoryById,
  newCategory,
  updateCategory,
} from "./services/categories";

import { bos } from "@/orpc/bos";

export const blogs = bos
  .prefix("/blogs")
  .tag("Blogs")
  .router({
    categories: {
      delete: deleteCategory,
      all: getAllCategories,
      new: newCategory,
      update: updateCategory,
      get: getCategoryById,
    },
  });
