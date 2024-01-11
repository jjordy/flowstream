import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  /**
   * Fact Table
   */
  await db.schema
    .createTable("fact")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("fact_id", "varchar", (col) => col.notNull())
    .addColumn("question_id", "integer", (col) =>
      col.references("question.id").notNull()
    )
    .addColumn("response_id", "integer", (col) =>
      col.references("response.id").onDelete("cascade").notNull()
    )
    .addColumn("owner_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex("fact_owner_id_index")
    .on("fact")
    .column("owner_id")
    .execute();

  await db.schema
    .createIndex("fact_question_id_index")
    .on("fact")
    .column("question_id")
    .execute();

  await db.schema
    .createIndex("fact_response_id_index")
    .on("fact")
    .column("response_id")
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable("fact").execute();
}
