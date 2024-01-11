import { Response } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "id",
  "response_id",
  "value",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<Response>("response", PUBLIC_FIELDS);

export const actions = {
  findPageById: findById,
  updatePage: updateItem,
  createPage: createItem,
  deletePage: deleteItem,
};
