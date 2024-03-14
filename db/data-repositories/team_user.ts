import { TeamUser } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "team_user_id",
  "team_id",
  "user_id",
  "role",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<TeamUser>("team_user", PUBLIC_FIELDS);

export const actions = {
  findById: findById,
  update: updateItem,
  create: createItem,
  delete: deleteItem,
};
