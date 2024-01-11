import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("page_question")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("page_question_id", "varchar", (col) => col.notNull())
    .addColumn("page_id", "integer", (col) =>
      col.references("page.id").notNull()
    )
    .addColumn("question_id", "integer", (col) =>
      col.references("question.id").notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("baby").execute();
}
