import { Page } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "id",
  "page_id",
  "content",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } = baseOperations<Page>(
  "page",
  PUBLIC_FIELDS
);

export const actions = {
  findPageById: findById,
  updatePage: updateItem,
  createPage: createItem,
  deletePage: deleteItem,
};
