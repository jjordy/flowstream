import { actions as questionActions } from "./data-repositories/question";
import { actions as pageQuestionActions } from "./data-repositories/page_question";
import { flow as flowActions } from "./data-repositories/flow";
import { actions as pageActions } from "./data-repositories/page";
import { actions as flowPageActions } from "./data-repositories/flow_page";
import { user as userActions } from "./data-repositories/user";
import { actions as targetingRuleActions } from "./data-repositories/targeting_rule";
import { actions as teamActions } from "./data-repositories/team";
import { actions as teamUserActions } from "./data-repositories/team_user";

import { UserService } from "../services/user";

export async function seedDB() {
  try {
    const team = await teamActions.create({
      name: "Jordys Team",
    });

    const user = await userActions.create({
      email: "test@test.com",
      password: UserService.generatePasswordHash("$tudenT1"),
    });

    const teamUser = await teamUserActions.create({
      team_id: team.id,
      user_id: user.id,
      role: "owner",
    });

    const flow = await flowActions.createFlow({
      title: "My First Flow",
      description: "Personal information check",
    });

    const page1 = await pageActions.createPage({
      title: "Welcome to my first page",
      description: "Here we will take your personal information",
      content: {
        title: "Welcome to my first page",
        legend: "Personal Information",
      },
    });

    const page2 = await pageActions.createPage({
      title: "Welcome to my second page",
      description: "Age & Satisfaction section",
      content: {
        title: "Welcome to my second page",
        legend: "Age & Satisfaction",
      },
    });

    const page3 = await pageActions.createPage({
      title: "Welcome to my third page",
      description: "old person section",
      content: {
        title: "This is a conditional page. You are old as fuck bra...",
        legend: "How does it feel to be over 35 bitch....",
      },
    });

    const page4 = await pageActions.createPage({
      title: "Celebrate success",
      description: "You have completed the page.",
      content: {
        title: "Congratulations you have completed the initial section",
        content:
          "<div>Thanks for completing this section click the button to go home.</div>",
      },
    });

    await flowPageActions.createFlowPage({
      page_id: page1.id!,
      flow_id: flow.id!,
      position: 1,
    });

    await flowPageActions.createFlowPage({
      page_id: page2.id!,
      flow_id: flow.id!,
      position: 2,
    });

    await flowPageActions.createFlowPage({
      page_id: page3.id!,
      flow_id: flow.id!,
      position: 3,
    });

    await flowPageActions.createFlowPage({
      page_id: page4.id!,
      flow_id: flow.id!,
      position: 4,
    });

    const question = await questionActions.createQuestion({
      key: "email",
      title: "Email Address Question",
      description: "Question to take the email address fact.",
      content: {
        type: "text",
        text: "To get started enter your email address",
        placeholder: "me@test.com",
        description:
          "Enter an email with the @test.com domain to receive page 2!",
      },
    });

    const question2 = await questionActions.createQuestion({
      key: "age",
      title: "Age Question",
      description: "Question to take the email address fact.",
      content: {
        type: "text",
        text: "How old are you?",
        placeholder: "18",
        description:
          "If you enter an age over 35 you will see a conditional page.",
      },
    });

    const question3 = await questionActions.createQuestion({
      title: "Satisfaction Question",
      description: "Question to check users satisfaction.",
      key: "satisfied",
      content: {
        text: "Did you enjoy this questionaire",
        type: "boolean",
      },
    });

    const question4 = await questionActions.createQuestion({
      title: "Old Confirmation Question",
      description: "Have the user confirm their old age.",
      key: "old_af",
      content: {
        text: "I agree to the fact that im old.",
        type: "boolean",
      },
    });

    await pageQuestionActions.createPageQuestion({
      question_id: question.id!,
      page_id: page1.id!,
    });

    await pageQuestionActions.createPageQuestion({
      question_id: question2.id!,
      page_id: page2.id!,
    });

    await pageQuestionActions.createPageQuestion({
      question_id: question3.id!,
      page_id: page2.id!,
    });

    await pageQuestionActions.createPageQuestion({
      question_id: question4.id!,
      page_id: page3.id!,
    });

    await targetingRuleActions.createTargetingRule({
      name: "First Rule",
      left_hand_expression: "{{user_facts.email}}",
      expression_type: "string",
      operator: "CONTAINS",
      right_hand_expression: "@test.com",
      page_id: page2.page_id as string,
    });

    await targetingRuleActions.createTargetingRule({
      name: "Old rule for people over 35 years old.",
      left_hand_expression: "{{user_facts.age}}",
      expression_type: "integer",
      operator: "GREATER_THAN",
      // because we keep the expression_type handy above we can cast this in the evaluation.
      right_hand_expression: "35",
      page_id: page3.page_id as string,
    });

    console.log("Finished running database seed");
    process.exit();
  } catch (err) {
    console.log("Something went wrong seeding the db", err);
  }
}
