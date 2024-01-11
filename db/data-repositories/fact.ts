import { Fact } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "fact_id as id",
  "question_id",
  "response_id",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } = baseOperations<Fact>(
  "fact",
  PUBLIC_FIELDS
);

export const fact = {
  findById: findById,
  update: updateItem,
  create: createItem,
  delete: deleteItem,
};
