import { PageQuestion } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "id",
  "page_question_id",
  "page_id",
  "question_id",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<PageQuestion>("page_question", PUBLIC_FIELDS);

export const actions = {
  findPageQuestionById: findById,
  updatePageQuestion: updateItem,
  createPageQuestion: createItem,
  deletePageQuestion: deleteItem,
};
