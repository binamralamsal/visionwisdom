import {
  deleteJob,
  getAllJobs,
  getJobById,
  getJobBySlug,
  newJob,
  updateJob,
} from "./services/jobs";
import {
  deleteJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  newJobCategory,
  updateJobCategory,
} from "./services/categories";

import { bos } from "@/orpc/bos";

export const jobs = bos
  .prefix("/jobs")
  .tag("Jobs")
  .router({
    new: newJob,
    update: updateJob,
    delete: deleteJob,
    get: getJobById,
    getBySlug: getJobBySlug,
    all: getAllJobs,

    categories: {
      delete: deleteJobCategory,
      all: getAllJobCategories,
      new: newJobCategory,
      update: updateJobCategory,
      get: getJobCategoryById,
    },
  });
