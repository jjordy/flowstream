import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  /**
   * Response Table
   */
  await db.schema
    .createTable("response")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("response_id", "varchar", (col) => col.notNull())
    .addColumn("value", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("response").execute();
}
