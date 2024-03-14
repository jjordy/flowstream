import { db } from "db";
import { withTargetingRules } from "db/data-repositories/page";
import { user } from "db/data-repositories/user";
import { TargetingRule } from "kysely-codegen";
import _ from "lodash";
/**
 * Resolve Mustache text between mustache style expression
 * */
const extractReferenceExpression = (str: string) =>
  str.match(/{{\s*[\w\.]+\s*}}/g)?.map(function (x) {
    return x?.match(/[\w\.]+/)?.[0];
  });

export function extractType(
  type: string,
  value: any,
  facts: Record<string, any>,
) {
  const resolved = _.get(
    facts,
    extractReferenceExpression(value)?.[0] as string,
    value,
  );
  switch (type) {
    case "string":
      return String(resolved || value);
    case "number":
      return Number(resolved || value);
    case "integer":
      return Number(resolved || value);
    case "decimal":
      return parseFloat(resolved || (value as string));
    default:
      return value;
  }
}

export function executeRule(
  rule: {
    expression_type: string;
    operator: string;
    left_hand_expression: any;
    right_hand_expression: any;
  },
  facts: {
    user_facts: Record<string, any>;
  },
) {
  switch (rule.operator) {
    case "EQUALS":
      console.log(
        extractType(rule.expression_type, rule.left_hand_expression, facts),
        extractType(rule.expression_type, rule.right_hand_expression, facts),
      );
      return (
        extractType(rule.expression_type, rule.left_hand_expression, facts) ===
        extractType(rule.expression_type, rule.right_hand_expression, facts)
      );
    case "CONTAINS":
      return extractType(rule.expression_type, rule.left_hand_expression, facts)
        ?.toString()
        .includes(
          extractType(
            rule.expression_type,
            rule.right_hand_expression,
            facts,
          ) as string,
        );
    case "GREATER_THAN":
      return (
        extractType(rule.expression_type, rule.left_hand_expression, facts) >
        extractType(rule.expression_type, rule.right_hand_expression, facts)
      );
    case "LESS_THAN":
      return (
        extractType(rule.expression_type, rule.left_hand_expression, facts) <
        extractType(rule.expression_type, rule.right_hand_expression, facts)
      );

    default:
      return false;
  }
}

type TargetableItem = {
  // rules: Awaited<ReturnType<typeof withTargetingRules>>[];
  [key: string]: any;
};

export const executeTargeting = async ({
  userId,
  items,
}: {
  userId: string;
  items?: TargetableItem[];
}) => {
  const u = await user.findById(userId);

  const facts = await db
    .selectFrom("fact")
    .innerJoin("response", "fact.response_id", "response.id")
    .innerJoin("question", "fact.question_id", "question.id")
    .select(["fact.fact_id", "response.value", "question.key"])
    .where("fact.owner_id", "=", u!.id)
    .execute();

  if (items) {
    const iter: any[] = [];
    let userData: Record<string, any> = {};

    for (const fact of facts) {
      userData[fact.key] = fact.value;
    }

    for (const item of items) {
      item.rules.forEach((rule: any) => {
        const startTime = performance.now();
        if (executeRule(rule, { user_facts: userData })) {
          const { rules, ...rest } = item;
          iter.push(rest);
        }
        const endTime = performance.now();
        console.log(
          `Rule Execution Branch took ${endTime - startTime} ms...`,
          rule,
          { user_facts: userData },
        );
      });
      // if an item has no rules it should just show up
      if (item.rules.length === 0) {
        const { rules, ...rest } = item;
        iter.push(rest);
      }
    }
    return iter;
  }
  return [];
};
