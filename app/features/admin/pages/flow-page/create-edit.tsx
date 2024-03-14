import { FC } from "hono/jsx";

import { FlowPageForm } from "../../components/flow-page/flow-page-form";
import { useRequestContext } from "hono/jsx-renderer";
import { flow as flowActions } from "db/data-repositories/flow";
import { db } from "db";

export const CreateEditFlowPagePage: FC = async () => {
  const c = useRequestContext();
  const flowId = c.req.param("flowId");
  const flow = await flowActions.findFlowById(flowId);
  const pages = await db
    .selectFrom("flow_page")
    .innerJoin("page", "page.id", "flow_page.page_id")
    .select([
      "flow_page.flow_page_id",
      "flow_page.position",
      "page.page_id",
      "page.content",
      "page.slug",
      "page.title",
      "page.description",
    ])
    .where("flow_page.flow_id", "=", flow!.id)
    .orderBy("flow_page.position", "asc")
    .execute();

  return (
    <section className="container mx-auto max-w-6xl mt-10">
      <h1 className="text-4xl tracking-tight leading-none text-slate-600 font-semibold mb-2">
        Edit Flow Pages{" "}
        <span className="text-2xl text-slate-500 ml-2">{flow?.title}</span>
      </h1>
      <a href={`/admin/flows/${flowId}`} className="link ">
        Back to flow
      </a>
      <FlowPageForm pages={pages} flow={flow} />
    </section>
  );
};
