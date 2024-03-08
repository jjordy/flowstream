import { actions as questionActions } from "./data-repositories/question";
import { actions as pageQuestionActions } from "./data-repositories/page_question";
import { flow as flowActions } from "./data-repositories/flow";
import { actions as pageActions } from "./data-repositories/page";
import { actions as flowPageActions } from "./data-repositories/flow_page";
import { user as userActions } from "./data-repositories/user";
import { actions as userFlowProgressActions } from "./data-repositories/user_flow_progress";
import { actions as targetingRuleActions } from "./data-repositories/targeting_rule";
import { UserService } from "../services/user";

import { nanoid } from "nanoid";

export async function seedDB() {
  try {
    const flows = await UserService.getFlows(
      "7779e2ff-d531-49be-b15c-87f67a08e0b1",
    );

    // const user = await userActions.create({
    //   email: "test@test.com",
    //   account_type: "admin",
    //   password: userActions.generatePasswordHash("$tudenT1"),
    // });
    //
    // const flow = await flowActions.createFlow({
    //   name: "My First Flow",
    // });
    //
    // const page1 = await pageActions.createPage({
    //   content: JSON.stringify({
    //     type: "text",
    //     text: "Welcome to my first page",
    //   }),
    // });
    //
    // const page2 = await pageActions.createPage({
    //   content: JSON.stringify({
    //     type: "text",
    //     text: "Welcome to my second page",
    //   }),
    // });
    //
    // await flowPageActions.createFlowPage({
    //   page_id: page1.id!,
    //   flow_id: flow.id!,
    // });
    //
    // await flowPageActions.createFlowPage({
    //   page_id: page2.id!,
    //   flow_id: flow.id!,
    // });
    //
    // const question = await questionActions.createQuestion({
    //   content: JSON.stringify({ type: "free", text: "How are you?" }),
    // });
    //
    // const question2 = await questionActions.createQuestion({
    //   content: JSON.stringify({ type: "free", text: "How old are you?" }),
    // });
    //
    // const question3 = await questionActions.createQuestion({
    //   content: JSON.stringify({
    //     text: "Did you enjoy this questionaire",
    //     type: "boolean",
    //   }),
    // });
    //
    // await pageQuestionActions.createPageQuestion({
    //   question_id: question.id!,
    //   page_id: page1.id!,
    // });
    //
    // await pageQuestionActions.createPageQuestion({
    //   question_id: question2.id!,
    //   page_id: page2.id!,
    // });
    //
    // await pageQuestionActions.createPageQuestion({
    //   question_id: question3.id!,
    //   page_id: page2.id!,
    // });
    //
    // await userFlowProgressActions.createUserFlowProgress({
    //   user_id: user.id!,
    //   flow_id: flow.id!,
    //   state: "active",
    //   progress: "text-0",
    // });
    //
    // await targetingRuleActions.createTargetingRule({
    //   name: "First Rule",
    //   left_hand_expression: "{{user_facts.first_name}}",
    //   left_hand_expression_type: "reference",
    //   comparison_type: "EQUALS",
    //   right_hand_expression: "Jordy",
    //   right_hand_expression_type: "string",
    //   flow_id: flow.flow_id as string,
    // });

    console.log("Finished running database seed");
  } catch (err) {
    console.log("Something went wrong seeding the db", err);
  }
}
