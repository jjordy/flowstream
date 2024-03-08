import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createType("targeting_rule_comparison_type")
    .asEnum([
      "EQUALS",
      "CONTAINS",
      "REGEX",
      "RANGE",
      "LIST",
      "EXISTS",
      "NOT_EXISTS",
      "GREATER_THAN",
      "LESS_THAN",
    ])
    .execute();

  await db.schema
    .createType("targeting_rule_expression_type")
    .asEnum(["string", "integer", "decimal", "reference"])
    .execute();

  await db.schema
    .createTable("targeting_rule")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("targeting_rule_id", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .notNull()
        .unique(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("left_hand_expression", "text", (col) => col.notNull())
    .addColumn("operator", sql`targeting_rule_comparison_type`, (col) =>
      col.defaultTo("EQUALS").notNull(),
    )
    .addColumn("right_hand_expression", "text", (col) => col.notNull())
    .addColumn("expression_type", sql`targeting_rule_expression_type`, (col) =>
      col.notNull(),
    )
    .addColumn("flow_id", "uuid", (col) => col.references("flow.flow_id"))
    .addColumn("page_id", "uuid", (col) => col.references("page.page_id"))
    .addColumn("question_id", "uuid", (col) =>
      col.references("question.question_id"),
    )
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  await db.schema
    .createIndex("targeting_rule_flow_id_index")
    .on("flow")
    .column("flow_id")
    .execute();

  await db.schema
    .createIndex("targeting_rule_page_id_index")
    .on("page")
    .column("page_id")
    .execute();

  await db.schema
    .createIndex("targeting_rule_question_id_index")
    .on("question")
    .column("question_id")
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex("targeting_rule_flow_id_index").execute();
  await db.schema.dropIndex("targeting_rule_page_id_index").execute();
  await db.schema.dropIndex("targeting_rule_question_id_index").execute();
  await db.schema.dropTable("targeting_rule").execute();
  await db.schema.dropType("targeting_rule_comparison_type").execute();
  await db.schema.dropType("targeting_rule_expression_type").execute();
}
