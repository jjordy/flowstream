import { Question } from "kysely-codegen";
import { baseOperations } from "../base";

const PUBLIC_FIELDS = [
  "id",
  "question_id",
  "content",
  "title",
  "description",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<Question>("question", PUBLIC_FIELDS);

export const actions = {
  findQuestionById: findById,
  updateQuestion: updateItem,
  createQuestion: createItem,
  deleteQuestion: deleteItem,
};
