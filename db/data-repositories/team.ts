import { Team } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = ["id", "team_id", "name"] as const;

const { findById, updateItem, createItem, deleteItem } = baseOperations<Team>(
  "team",
  PUBLIC_FIELDS,
);

export const actions = {
  findById: findById,
  update: updateItem,
  create: createItem,
  delete: deleteItem,
};
