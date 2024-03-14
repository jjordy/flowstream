import { FC } from "hono/jsx";
import { FlowForm } from "../../components/flow/flow-form";
import { useRequestContext } from "hono/jsx-renderer";
import { flow as flowActions } from "db/data-repositories/flow";
import { actions } from "db/data-repositories/flow_page";
import { db } from "db";
import { sql } from "kysely";

export const UpdateFlowPage: FC<{
  flow?: Awaited<ReturnType<typeof flowActions.findFlowById>>;
}> = async ({ flow }) => {
  const c = useRequestContext();
  const flowId = c.req.param("flowId");
  const f = flow ? flow : await flowActions.findFlowById(flowId);
  const pages = await db
    .selectFrom("flow_page")
    .select((eb) => [eb.fn.count("id").as("total_pages")])
    .where("flow_page.flow_id", "=", f!.id)
    .executeTakeFirst();

  return (
    <section className="container mx-auto max-w-6xl mt-10">
      <h1 className="heading">
        Edit Flow{" "}
        <span className="text-2xl text-slate-500 ml-2">{f?.title}</span>
      </h1>
      <a href="/admin" className="link">
        Back to admin
      </a>
      <FlowForm flow={f} pages={pages} />
    </section>
  );
};
