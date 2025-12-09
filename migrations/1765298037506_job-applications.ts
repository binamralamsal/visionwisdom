import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("job_applications")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("phone", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("preferred_countries", "text")
    .addColumn("preferred_position", "text")
    .addColumn("resume_file_id", "integer", (col) =>
      col.references("uploaded_files.id").onDelete("set null"),
    )
    .addColumn("passport_file_id", "integer", (col) =>
      col.references("uploaded_files.id").onDelete("set null"),
    )
    .addColumn("medical_report_file_id", "integer", (col) =>
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
    CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("job_applications").ifExists().execute();
}
