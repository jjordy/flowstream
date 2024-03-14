import { DB, TargetingRule } from "kysely-codegen";
import { baseOperations } from "../base";
import { ExpressionBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export const PUBLIC_FIELDS = [
  "targeting_rule_id",
  "name",
  "left_hand_expression",
  "expression_type",
  "operator",
  "right_hand_expression",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<TargetingRule>("targeting_rule", PUBLIC_FIELDS);

export const actions = {
  findTargetingRuleById: findById,
  updateTargetingRule: updateItem,
  createTargetingRule: createItem,
  deleteTargetingRule: deleteItem,
};
