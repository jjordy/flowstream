import { FC } from "hono/jsx";
import { FlowForm } from "../../components/flow/flow-form";

export const CreateFlowPage: FC = () => {
  return (
    <section className="container mx-auto max-w-6xl space-y-4 mt-10">
      <h1 className="heading">Create Flow</h1>
      <a href="/admin" className="link">
        Back to admin
      </a>
      <FlowForm />
    </section>
  );
};
