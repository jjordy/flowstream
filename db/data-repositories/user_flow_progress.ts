import { UserFlowProgress } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "id",
  "user_flow_progress_id",
  "user_id",
  "flow_id",
  "state",
  "progress",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<UserFlowProgress>("user_flow_progress", PUBLIC_FIELDS);

export const actions = {
  findUserFlowProgressById: findById,
  updateUserFlowProgress: updateItem,
  createUserFlowProgress: createItem,
  deleteUserFlowProgress: deleteItem,
};
