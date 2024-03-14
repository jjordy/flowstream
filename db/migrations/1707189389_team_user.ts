import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createType("user_account_type")
    .asEnum(["viewer", "editor", "admin", "owner"])
    .execute();
  await db.schema
    .createTable("team_user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("team_user_id", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique(),
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").notNull(),
    )
    .addColumn("team_id", "integer", (col) =>
      col.references("team.id").notNull(),
    )
    .addColumn("role", sql`user_account_type`, (col) => col.defaultTo("viewer"))
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("team_user").execute();
}
