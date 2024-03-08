import { db } from "../db";
import { Flow, flow } from "../db/data-repositories/flow";
import { user } from "../db/data-repositories/user";
import { fact } from "../db/data-repositories/fact";

import crypto from "node:crypto";

function decryptPassword(password: string, passwordHash: string) {
  const [salt, hash] = passwordHash.split(":");
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return newHash === hash;
}

function extractType(type: any, value: any, facts) {
  switch (type) {
    case "string":
      return String(value);
    case "number":
      return Number(value);
    case "integer":
      return Number(value);
    case "decimal":
      return parseFloat(value as string);
    case "reference":
      return;
  }
}

function executeRule(rule: any, facts: any) {
  console.log(rule, facts);
  switch (rule.comparison_type) {
    case "EQUALS":
      return (
        extractType(
          rule.left_hand_expression_type,
          rule.left_hand_expression,
          facts,
        ) ===
        extractType(
          rule.right_hand_expression_type,
          rule.right_hand_expression,
          facts,
        )
      );
    case "CONTAINS":
      return extractType(
        rule.left_hand_expression_type,
        rule.left_hand_expression,
        facts,
      )
        ?.toString()
        .includes(
          extractType(
            rule.right_hand_expression_type,
            rule.right_hand_expression,
            facts,
          ) as string,
        );
    default:
      return false;
  }
}

export const UserService = {
  async getFlows(userId: string) {
    const u = await user.findById(userId);
    const flows = await flow.findFlowsWithTargetingRules();
    const facts = await db
      .selectFrom("fact")
      .innerJoin("response", "fact.response_id", "response.id")
      .select(["fact.fact_id", "response.value"])
      .where("fact.owner_id", "=", u!.id)
      .execute();
    console.log(facts);
    const iter: any[] = [];

    for (const flow of flows) {
      flow.rules.forEach((rule: any) => {
        if (executeRule(rule, facts)) {
          const { rules, ...rest } = flow;
          iter.push(rest);
        }
      });
    }

    // console.log(iter[0]);
  },
  validatePassword: async (email: string, password: string) => {
    const user = await db
      .selectFrom("user")
      .select(["user_id", "email", "password", "account_type"])
      .where("email", "=", email)
      .executeTakeFirst();

    if (decryptPassword(password, user!.password)) {
      return user;
    }
    return null;
  },
  generatePasswordHash: (password: string) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return `${salt}:${hash}`;
  },
};
