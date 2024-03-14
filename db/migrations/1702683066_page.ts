import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("page")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("page_id", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique(),
    )
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("slug", "varchar")
    .addColumn("content", "jsonb", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("page").execute();
}
