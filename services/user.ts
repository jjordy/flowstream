import { executeRule, executeTargeting } from "../lib/targeting";
import { db } from "../db";
import { flow } from "../db/data-repositories/flow";
import { user } from "../db/data-repositories/user";

import crypto from "node:crypto";
import { ExpressionBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import { withTargetingRules } from "db/data-repositories/page";

function decryptPassword(password: string, passwordHash: string) {
  const [salt, hash] = passwordHash.split(":");
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return newHash === hash;
}

function withQuestions(eb: ExpressionBuilder<DB, "page">) {
  return jsonArrayFrom(
    eb
      .selectFrom("page_question")
      .innerJoin("question", "page_question.question_id", "question.id")
      .select([
        "question.id",
        "question.question_id",
        "question.content",
        "question.key",
      ])
      .whereRef("page.id", "=", "page_question.page_id"),
  ).as("questions");
}

export const UserService = {
  async getPage(userId: string, flowId: string, pageId?: string) {
    const startTime = performance.now();
    const currentPage = await db
      .selectFrom("user")
      .innerJoin("user_flow_progress", "user.id", "user_flow_progress.user_id")
      .innerJoin(
        "user_flow_page_progress",
        "user.id",
        "user_flow_page_progress.user_id",
      )
      .innerJoin("flow", "user_flow_progress.flow_id", "flow.id")
      .innerJoin(
        "flow_page",
        "user_flow_page_progress.flow_page_id",
        "flow_page.id",
      )
      .innerJoin("page", "flow_page.page_id", "page.id")
      .where("user.user_id", "=", userId)
      .where("flow.flow_id", "=", flowId)
      .where("user_flow_progress.state", "in", ["active", "completed"])
      .where("user_flow_page_progress.state", "in", ["active", "completed"])
      .$if(!!pageId, (qb) => qb.where("page.page_id", "=", pageId as string))
      .$if(!pageId, (qb) => qb.orderBy("flow_page.id", "desc"))
      .select([
        "page.id",
        "flow_page.id as flow_page_id",
        "flow.id as flow_id",
        "page.page_id",
        "page.content",
        "user_flow_progress.progress",
        "user_flow_progress.state",
        "page.created_at",
        "page.updated_at",
      ])
      .select((eb) => [withQuestions(eb)])
      .executeTakeFirst();
    const endTime = performance.now();
    console.log(
      `Query Execution: UserService.getPage: ${endTime - startTime} ms...`,
    );
    return currentPage;
  },
  async savePage(
    userId: string,
    flowId: string,
    pageId: string,
    submission: Record<string, any>,
  ) {
    const startTime = performance.now();
    const u = await user.findById(userId);
    const currentPage = await this.getPage(userId, flowId, pageId);
    /**
     * Iterate through the current pages questions creating response & fact
     * if theres a matching submission key
     * */
    if (currentPage?.questions) {
      for (const question of currentPage.questions) {
        if (submission[question.key]) {
          const response = await db
            .insertInto("response")
            .values({ value: submission[question.key] })
            .returning(["id"])
            .executeTakeFirst();
          if (u && response) {
            await db
              .insertInto("fact")
              .values({
                question_id: question.id,
                response_id: response.id,
                owner_id: u.id,
              })
              .execute();
          }
        }
      }
      // set the flow_progress to completed for this page.
      await db
        .updateTable("user_flow_page_progress")
        .set({ state: "completed" })
        .where("flow_page_id", "=", currentPage.flow_page_id)
        .execute();
      // find all nextPages and narrow with targeting.
      const nextPages = await db
        .selectFrom("flow_page")
        .innerJoin("page", "flow_page.page_id", "page.id")
        .select(["flow_page.id", "page.page_id"])
        .select((eb) => [withTargetingRules(eb)])
        .where("flow_page.id", ">", currentPage.flow_page_id)
        .where("flow_page.flow_id", "=", currentPage.flow_id)
        .execute();

      const available = await executeTargeting({
        userId: u?.user_id! as string,
        items: nextPages,
      });

      if (u && available[0]) {
        await db
          .insertInto("user_flow_page_progress")
          .values({
            user_id: u.id,
            flow_page_id: available[0].id,
            state: "active",
          })
          .execute();
        // update user_flow_progress progress
        await db
          .updateTable("user_flow_progress")
          .set({ progress: 100 / available.length })
          .where("id", "=", currentPage.flow_id)
          .execute();

        const endTimeSucces = performance.now();
        console.log(
          `Query Execution: UserService.savePage: ${
            endTimeSucces - startTime
          } ms...`,
        );
        return available[0].page_id;
      }

      if (u && available.length === 0) {
        await db
          .updateTable("user_flow_progress")
          .set({ state: "completed", progress: 100 })
          .where("flow_id", "=", currentPage.flow_id)
          .execute();
      }
      const endTimeFailure = performance.now();

      console.log(
        `Query Execution: UserService.savePage: ${
          endTimeFailure - startTime
        } ms...`,
      );
      return null;
    }
  },
  async startFlow(userId: string, flowId: string) {
    const u = await user.findById(userId);

    const flow = await db
      .selectFrom("flow")
      .select(["id"])
      .where("flow_id", "=", flowId)
      .executeTakeFirst();

    const nextPages = await db
      .selectFrom("flow_page")
      .innerJoin("page", "flow_page.page_id", "page.id")
      .select(["flow_page.id", "page.page_id"])
      .select((eb) => [withTargetingRules(eb)])
      .where("flow_page.flow_id", "=", flow?.id!)
      .execute();

    const existingFlowProgress = await db
      .selectFrom("user_flow_progress")
      .select(["id"])
      .where("id", "=", flow?.id!)
      .where("user_id", "=", u?.id!)
      .executeTakeFirst();

    const existingPageProgress = await db
      .selectFrom("user_flow_page_progress")
      .select(["id"])
      .where("flow_page_id", "=", nextPages[0].id)
      .where("user_id", "=", u?.id!)
      .executeTakeFirst();

    if (nextPages.length > 0) {
      if (!existingFlowProgress) {
        await db
          .insertInto("user_flow_progress")
          .values({
            state: "active",
            progress: 0,
            user_id: u?.id!,
            flow_id: flow?.id!,
          })
          .execute();
      }

      if (!existingPageProgress) {
        await db
          .insertInto("user_flow_page_progress")
          .values({
            flow_page_id: nextPages[0].id,
            state: "active",
            user_id: u?.id!,
          })
          .execute();
      }
      return nextPages[0].page_id;
    }
  },
  async getFlows(userId: string) {
    const u = await user.findById(userId);
    const flows = await flow.findFlowsWithTargetingRules();
    const available = await executeTargeting({
      userId: u?.user_id! as string,
      items: flows,
    });
    return available;
  },
  validatePassword: async (email: string, password: string) => {
    const user = await db
      .selectFrom("user")
      .select(["user_id", "email", "password"])
      .where("email", "=", email)
      .executeTakeFirst();
    if (!user) {
      return null;
    }
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
