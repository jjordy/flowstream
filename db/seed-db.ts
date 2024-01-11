import { actions as questionActions } from "./data-repositories/question";
import { actions as pageQuestionActions } from "./data-repositories/page_question";
import { flow as flowActions } from "./data-repositories/flow";
import { actions as pageActions } from "./data-repositories/page";
import { actions as flowPageActions } from "./data-repositories/flow_page";
import { user as userActions } from "./data-repositories/user";
import { actions as userFlowProgressActions } from "./data-repositories/user_flow_progress";

import { nanoid } from "nanoid";

export async function seedDB() {
  try {
    const user = await userActions.create({
      user_id: nanoid(),
      email: "jordanrileyaddison@gmail.com",
      account_type: "admin",
      password: "$tudenT1",
    });

    const flow = await flowActions.createFlow({
      name: "My First Flow",
      flow_id: nanoid(),
    });

    const page1 = await pageActions.createPage({
      page_id: nanoid(),
      content: JSON.stringify({
        type: "text",
        text: "Welcome to my first page",
      }),
    });

    const page2 = await pageActions.createPage({
      page_id: nanoid(),
      content: JSON.stringify({
        type: "text",
        text: "Welcome to my second page",
      }),
    });

    await flowPageActions.createFlowPage({
      flow_page_id: nanoid(),
      page_id: page1.id!,
      flow_id: flow.id!,
    });

    await flowPageActions.createFlowPage({
      flow_page_id: nanoid(),
      page_id: page2.id!,
      flow_id: flow.id!,
    });

    const question = await questionActions.createQuestion({
      question_id: nanoid(),
      content: JSON.stringify({ type: "free", text: "How are you?" }),
    });

    const question2 = await questionActions.createQuestion({
      question_id: nanoid(),
      content: JSON.stringify({ type: "free", text: "How old are you?" }),
    });

    const question3 = await questionActions.createQuestion({
      question_id: nanoid(),
      content: JSON.stringify({
        text: "Did you enjoy this questionaire",
        type: "boolean",
      }),
    });

    await pageQuestionActions.createPageQuestion({
      page_question_id: nanoid(),
      question_id: question.id!,
      page_id: page1.id!,
    });

    await pageQuestionActions.createPageQuestion({
      page_question_id: nanoid(),
      question_id: question2.id!,
      page_id: page2.id!,
    });

    await pageQuestionActions.createPageQuestion({
      page_question_id: nanoid(),
      question_id: question3.id!,
      page_id: page2.id!,
    });

    await userFlowProgressActions.createUserFlowProgress({
      user_flow_progress_id: nanoid(),
      user_id: user.id!,
      flow_id: flow.id!,
      state: "active",
      progress: "text-0",
    });

    console.log("Finished running database seed", user);
  } catch (err) {
    console.log("Something went wrong seeding the db", err);
  }
}
