import "dotenv/config";
import path from "node:path";

import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  FileMigrationProvider,
  PostgresDialect,
  NO_MIGRATIONS,
} from "kysely";
import { DB } from "kysely-codegen";
import * as url from "url";
import pg from "pg";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export async function migrateToLatest() {
  const dialect = new PostgresDialect({
    pool: new pg.Pool({
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 10,
    }),
  });
  const db = new Kysely<DB>({
    dialect,
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(
        `Up migration for "${it.migrationName}" was executed successfully`
      );
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
  process.exit(0);
}

export async function migrateDown() {
  const dialect = new PostgresDialect({
    pool: new pg.Pool({
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 10,
    }),
  });
  const db = new Kysely<DB>({
    dialect,
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(
        `Down migration for "${it.migrationName}" was executed successfully`
      );
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
  process.exit(0);
}
