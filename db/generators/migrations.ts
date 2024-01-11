import fs from "node:fs/promises";
import path from "node:path";

export async function createMigration(name: string = "thing") {
  const FILE_PATH = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "migrations",
    `${Date.parse(new Date().toUTCString()) / 1000}${name ? `_${name}` : ""}.ts`
  );

  const fileContent = `import { Kysely, sql } from "kysely";
  import { DB } from "kysely-codegen";

  export async function up(db: Kysely<DB>): Promise<void> {
      await db.schema
        .createTable("${name || "thing"}")
        .addColumn("id", "integer", (col) => col.primaryKey())
        .addColumn("created_at", "text", (col) =>
          col.defaultTo(sql\`CURRENT_TIMESTAMP\`).notNull(),
        )
        .addColumn("updated_at", "text", (col) =>
          col.defaultTo(sql\`CURRENT_TIMESTAMP\`).notNull(),
        )
        .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
      await db.schema.dropTable("${name || "thing"}").execute();
  }`;
  try {
    console.log(`Creating Migration@${FILE_PATH}`);
    await fs.writeFile(FILE_PATH, fileContent);
  } catch (err) {
    console.log(err);
  }
}
