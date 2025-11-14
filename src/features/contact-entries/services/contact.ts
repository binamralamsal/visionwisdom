import { z } from "zod";

import {
  contactEntrySchema,
  getAllContactEntriesSchema,
} from "../contact-entries.schema";

import { db } from "@/config/db";
import { bos, orpcInput } from "@/orpc/bos";
import { ensureAdmin } from "@/orpc/middlewares/ensure-admin";

export const newContactEntry = bos
  .route({ method: "POST", path: "/" })
  .input(
    orpcInput({
      body: contactEntrySchema,
    }),
  )
  .handler(async ({ input: { body } }) => {
    await db.insertInto("contactEntries").values(body).execute();

    return {
      message: "Message sent successfully! We'll get back to you soon.",
    };
  });

export const getAllContactEntries = bos
  .route({ method: "GET", path: "/all" })
  .input(orpcInput({ query: getAllContactEntriesSchema }))
  .use(ensureAdmin)
  .handler(async ({ input: { query } }) => {
    const { sort, page, pageSize, search } = query;

    function createBaseQuery() {
      let query = db.selectFrom("contactEntries");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("contactEntries.name", "ilike", searchTerm),
            eb("contactEntries.email", "ilike", searchTerm),
            eb("contactEntries.phone", "ilike", searchTerm),
            eb("contactEntries.message", "ilike", searchTerm),
          ]),
        );
      }

      return query;
    }

    let contactEntriesQuery = createBaseQuery().selectAll();

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      contactEntriesQuery = contactEntriesQuery.orderBy(
        column as keyof (typeof query)["sort"],
        direction,
      );
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    contactEntriesQuery = contactEntriesQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [contactEntries, countResult] = await Promise.all([
      contactEntriesQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      contactEntries,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });

export const deleteContactEntry = bos
  .route({ method: "POST", path: "/{id}/delete" })
  .input(orpcInput({ params: z.object({ id: z.coerce.number().int() }) }))
  .use(ensureAdmin)
  .handler(
    async ({
      input: {
        params: { id },
      },
    }) => {
      await db
        .deleteFrom("contactEntries")
        .where("contactEntries.id", "=", id)
        .execute();

      return { message: "Deleted contact entry successfully!" };
    },
  )
  .callable();
