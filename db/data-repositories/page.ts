import { DB, Page } from "kysely-codegen";
import { baseOperations } from "../base";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { ExpressionBuilder } from "kysely";

export const PUBLIC_FIELDS = [
  "id",
  "page_id",
  "content",
  "title",
  "description",
  "slug",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } = baseOperations<Page>(
  "page",
  PUBLIC_FIELDS,
);

export function withTargetingRules(eb: ExpressionBuilder<DB, "page">) {
  return jsonArrayFrom(
    eb
      .selectFrom("targeting_rule")
      .select([
        "targeting_rule_id",
        "name",
        "left_hand_expression",
        "expression_type",
        "operator",
        "right_hand_expression",
      ])
      .whereRef("targeting_rule.page_id", "=", "page.page_id"),
  ).as("rules");
}

export const actions = {
  findPageById: findById,
  updatePage: updateItem,
  createPage: createItem,
  deletePage: deleteItem,
};
