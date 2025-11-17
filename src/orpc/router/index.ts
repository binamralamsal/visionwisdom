import { jobs } from "@/features/jobs/server/jobs.router";
import { users } from "@/features/auth/server/user.router";
import { blogs } from "@/features/blogs/server/blogs.router";
import { contact } from "@/features/contact-entries/server/contact.router";

export default {
  users,
  contact,
  blogs,
  jobs,
};
