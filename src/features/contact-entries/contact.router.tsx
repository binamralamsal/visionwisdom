import {
  deleteContactEntry,
  getAllContactEntries,
  newContactEntry,
} from "./services/contact";

import { bos } from "@/orpc/bos";

export const contact = bos.prefix("/contact").tag("Contact").router({
  new: newContactEntry,
  all: getAllContactEntries,
  delete: deleteContactEntry,
});
