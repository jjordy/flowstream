import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("page_question")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("page_question_id", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique(),
    )
    .addColumn("page_id", "integer", (col) =>
      col.references("page.id").notNull(),
    )
    .addColumn("question_id", "integer", (col) =>
      col.references("question.id").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex("page_question_page_id_index")
    .on("page")
    .column("page_id")
    .execute();

  await db.schema
    .createIndex("page_question_question_id_index")
    .on("question")
    .column("question_id")
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("page_question_page_id_index").execute();
  await db.schema.dropIndex("page_question_question_id_index").execute();
  await db.schema.dropTable("page_question").execute();
}
