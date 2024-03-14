import { FlowPage } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "id",
  "flow_page_id",
  "flow_id",
  "page_id",
  "position",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<FlowPage>("flow_page", PUBLIC_FIELDS);

export const actions = {
  findFlowPageById: findById,
  updateFlowPage: updateItem,
  createFlowPage: createItem,
  deleteFlowPage: deleteItem,
};
