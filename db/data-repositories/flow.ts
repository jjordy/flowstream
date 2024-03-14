import { DB, Flow as FlowType } from "kysely-codegen";
import { baseOperations } from "../base";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { ExpressionBuilder } from "kysely";
import { db } from "../";
import { user } from "./user";

export const PUBLIC_FIELDS = [
  "id",
  "flow_id",
  "title",
  "description",
  "slug",
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
      .select(["page.page_id", "page.content"])
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
        "expression_type",
        "operator",
        "right_hand_expression",
      ])
      .whereRef("targeting_rule.flow_id", "=", "flow.flow_id"),
  ).as("rules");
}

export const flow = {
  findFlowById: findById,
  findFlowWithPages: async (id: string) => {
    return await db
      .selectFrom("flow")
      .select(PUBLIC_FIELDS)
      .select((eb) => [withPages(eb)])
      .where("flow.flow_id", "=", id)
      .executeTakeFirst();
  },
  findFlowsWithTargetingRules: async (userId: string) => {
    const u = await user.findById(userId);
    return await db
      .selectFrom("flow")
      .select([
        "flow.id",
        "flow.flow_id",
        "flow.title",
        "flow.description",
        "flow.slug",
        "flow.created_at",
        "flow.updated_at",
      ])
      .select((eb) => [withTargetingRules(eb)])
      .execute();
  },
  updateFlow: updateItem,
  createFlow: createItem,
  deleteFlow: deleteItem,
};

export type Flow = FlowType;
