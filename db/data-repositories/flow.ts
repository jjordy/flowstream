import { DB, Flow as FlowType } from "kysely-codegen";
import { baseOperations } from "../base";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { ExpressionBuilder } from "kysely";
import { db } from "../";

export const PUBLIC_FIELDS = [
  "id",
  "flow_id",
  "name",
  "created_at",
  "updated_at",
] as const;

const { findById, updateItem, createItem, deleteItem } =
  baseOperations<FlowType>("flow", PUBLIC_FIELDS);

function withPages(eb: ExpressionBuilder<DB, "flow">) {
  return jsonArrayFrom(
    eb
      .selectFrom("flow_page")
      .innerJoin("page", "page.id", "flow_page.page_id")
      .select("page.content")
      .whereRef("flow_page.flow_id", "=", "flow.id"),
  ).as("pages");
}

function withTargetingRules(eb: ExpressionBuilder<DB, "flow">) {
  return jsonArrayFrom(
    eb
      .selectFrom("targeting_rule")
      .select([
        "targeting_rule_id",
        "name",
        "left_hand_expression",
        "left_hand_expression_type",
        "comparison_type",
        "right_hand_expression",
        "right_hand_expression_type",
      ])
      .whereRef("targeting_rule.flow_id", "=", "flow.flow_id"),
  ).as("rules");
}

export const flow = {
  findFlowById: findById,
  findFlowWithPages: async (id: number) => {
    return await db
      .selectFrom("flow")
      .select(PUBLIC_FIELDS)
      .select((eb) => [withPages(eb)])
      .where("flow.id", "=", id)
      .execute();
  },
  findFlowsWithTargetingRules: async () => {
    return await db
      .selectFrom("flow")
      .select(PUBLIC_FIELDS)
      .select((eb) => [withTargetingRules(eb)])
      .execute();
  },
  updateFlow: updateItem,
  createFlow: createItem,
  deleteFlow: deleteItem,
};

export type Flow = FlowType;
