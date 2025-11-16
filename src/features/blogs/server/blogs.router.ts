import {
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  newBlog,
  updateBlog,
} from "./services/blogs";
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
    new: newBlog,
    update: updateBlog,
    delete: deleteBlog,
    all: getAllBlogs,
    get: getBlogById,
    getBySlug: getBlogBySlug,
    categories: {
      delete: deleteCategory,
      all: getAllCategories,
      new: newCategory,
      update: updateCategory,
      get: getCategoryById,
    },
  });
