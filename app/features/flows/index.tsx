import { BooleanInput } from "app/components/inputs/boolean";
import { TextInput } from "app/components/inputs/text";
import { FC, Fragment } from "hono/jsx";
import { UserService } from "services/user";

type Page = {
  content: {
    content: string;
    title: string;
    text: string;
    legend?: string;
  };
  questions: {
    content: {
      type: string;
      description?: string;
    };
  }[];
} & Awaited<ReturnType<typeof UserService.getPage>>;

export const FlowPage: FC<{ page: Page; flowId: string }> = ({
  page,
  flowId,
}) => {
  return (
    <Fragment>
      <progress
        value={page?.progress}
        className="w-full h-2 align-top bg-transparent [&::-moz-progress-bar]:bg-teal-400"
        max={100}
      />
      <div className="container mx-auto mt-10 max-w-4xl">
        <h1 className="text-4xl my-4 font-bold">{page?.content.title}</h1>

        <hr className="my-8" />
        <div className="my-8">
          {page?.content.content && (
            <div dangerouslySetInnerHTML={{ __html: page?.content.content }} />
          )}
        </div>
        <form method="POST" action={`/flows/${flowId}/${page?.page_id}`}>
          {page?.questions?.length > 0 && (
            <fieldset
              className="border-2 border-slate-300 bg-slate-100 p-8 rounded"
              disabled={page.state === "completed"}
            >
              <legend className="font-medium text-slate-900">
                {page.content.legend || page?.content.text}
              </legend>
              <div className="space-y-8">
                {page?.questions.map((question, id) => (
                  <div key={`page_question_${id}`}>
                    {question.content.type === "text" && (
                      <TextInput question={question} />
                    )}
                    {question.content.type === "boolean" && (
                      <BooleanInput question={question} />
                    )}
                    <p className="my-2 text-slate-600 text-sm">
                      {question.content?.description}
                    </p>
                  </div>
                ))}
              </div>
            </fieldset>
          )}
          <button className="button mt-4">Submit</button>
        </form>
      </div>
    </Fragment>
  );
};
