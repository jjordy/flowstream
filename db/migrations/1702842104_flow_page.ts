import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable("flow_page")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("flow_page_id", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique(),
    )
    .addColumn("flow_id", "integer", (col) =>
      col.references("flow.id").notNull(),
    )
    .addColumn("page_id", "integer", (col) =>
      col.references("page.id").notNull(),
    )
    .addColumn("position", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("flow_page").execute();
}
