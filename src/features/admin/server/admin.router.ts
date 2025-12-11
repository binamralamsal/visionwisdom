import {
  getAdminStats,
  getFeaturedJobs,
  toggleJobFeatured,
} from "./services/admin-stats";

import { bos } from "@/orpc/bos";

export const admin = bos.prefix("/admin").tag("Admin").router({
  stats: getAdminStats,
  featuredJobs: getFeaturedJobs,
  toggleJobFeatured,
});
