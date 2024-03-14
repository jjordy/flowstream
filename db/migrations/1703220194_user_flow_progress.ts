import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createType("user_flow_progress_state")
    .asEnum(["active", "inactive", "skipped", "completed"])
    .execute();
  await db.schema
    .createTable("user_flow_progress")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user_flow_progress_id", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique(),
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").notNull(),
    )
    .addColumn("flow_id", "integer", (col) =>
      col.references("flow.id").notNull(),
    )
    .addColumn("state", sql`user_flow_progress_state`, (col) =>
      col.defaultTo("inactive").notNull(),
    )
    .addColumn("progress", "decimal", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("user_flow_progress").execute();
  await db.schema.dropType("user_flow_progress_state").execute();
}
