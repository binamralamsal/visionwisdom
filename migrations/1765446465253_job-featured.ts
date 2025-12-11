import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("jobs")
    .addColumn("is_featured", "boolean", (col) =>
      col.defaultTo(false).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("jobs").dropColumn("is_featured").execute();
}
