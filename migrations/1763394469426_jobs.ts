import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("job_categories")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_job_categories_updated_at
    BEFORE UPDATE ON job_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await db.schema
    .createType("job_status")
    .asEnum(["draft", "published", "closed", "archived"])
    .execute();

  await db.schema
    .createType("job_gender")
    .asEnum(["any", "male", "female"])
    .execute();

  await db.schema
    .createTable("jobs")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("company", "text")
    .addColumn("location", "text")
    .addColumn("gender", sql`job_gender`, (col) =>
      col.defaultTo("any").notNull(),
    )
    .addColumn("salary", "text")
    .addColumn("contract_length", "text")
    .addColumn("working_hours", "text")
    .addColumn("experience", "text")
    .addColumn("documents_required", "text")
    .addColumn("status", sql`job_status`, (col) =>
      col.defaultTo("draft").notNull(),
    )
    .addColumn("category_id", "integer", (col) =>
      col.references("job_categories.id").onDelete("set null"),
    )
    .addColumn("file_id", "integer", (col) =>
      col.references("uploaded_files.id").onDelete("set null"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("jobs").ifExists().execute();
  await db.schema.dropTable("job_categories").ifExists().execute();
  await db.schema.dropType("job_status").ifExists().execute();
  await db.schema.dropType("job_gender").ifExists().execute();
}
