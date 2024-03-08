import "dotenv/config";
import { program } from "commander";
import { createDataRepository } from "../db/generators/data-repository";
import { createMigration } from "../db/generators/migrations";
import { migrateToLatest, migrateDown } from "../db/migrate";
import { seedDB } from "../db/seed-db";

program
  .command("create-migration")
  .argument("<name>", "Migration Name")
  .action((name) => createMigration(name));

program
  .command("create-data-repository")
  .argument("<name>", "Data Repository Name")
  .action((name) => createDataRepository(name));

program.command("migrate").action(migrateToLatest);
program.command("migrate-down").action(migrateDown);

program.command("seed-db").action(seedDB);

program.parse();
