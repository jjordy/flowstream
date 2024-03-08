import { TargetingRule } from "kysely-codegen";
import { baseOperations } from "../base";

export const PUBLIC_FIELDS = [
  "targeting_rule_id",
  "name",
  "left_hand_expression",
  "left_hand_expression_type",
  "comparison_type",
  "right_hand_expression",
  "right_hand_expression_type",
  "created_at",
  "updated_at",
];

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<TargetingRule>("targeting_rule", PUBLIC_FIELDS);

export const actions = {
  findTargetingRuleById: findById,
  updateTargetingRule: updateItem,
  createTargetingRule: createItem,
  deleteTargetingRule: deleteItem,
};
