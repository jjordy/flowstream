import { Hono } from "hono";
import { AdminDashboard } from "./pages/dashboard";
import { EntityResults } from "./components/entity/entity-results";
import { isAuthenticated } from "app/middlewares/isAuthenticated";
import { isAdmin } from "app/middlewares/isAdmin";
import { db } from "db";
import { CreateEntityModal } from "./components/entity/create-entity-modal";
import { flow } from "db/data-repositories/flow";
import { entityQuery } from "./queries/entity-search";
import { CreateFlowPage } from "./pages/flow/create";
import { UpdateFlowPage } from "./pages/flow/edit";
import { Modal } from "app/components/modal";
import { actions as flowPageActions } from "db/data-repositories/flow_page";
import { CreateEditFlowPagePage } from "./pages/flow-page/create-edit";
import { FlowPageForm } from "./components/flow-page/flow-page-form";
import { actions } from "db/data-repositories/page";

const app = new Hono();

/**
 * Root Route
 * */
app.get("/", isAuthenticated, isAdmin, async (c) => {
  const flows = await db.executeQuery(entityQuery("").compile());
  return c.render(<AdminDashboard entities={flows.rows} />);
});
/**
 * Entities
 * */
app.get("/entity-modal", (c) => {
  return c.html(<CreateEntityModal />);
});

app.post("/search", isAuthenticated, isAdmin, async (c) => {
  const body = await c.req.parseBody();
  const flows = await db.executeQuery(
    entityQuery(body?.entity_query as string).compile(),
  );
  return c.html(<EntityResults entities={flows.rows} />);
});
/**
 * Flows
 * */
app.get("/flows/create", isAuthenticated, isAdmin, async (c) => {
  return c.render(<CreateFlowPage />);
});

app.get("/flows/:flowId", isAuthenticated, isAdmin, async (c) => {
  return c.render(<UpdateFlowPage />);
});

app.get("/flows/:flowId/pages", isAuthenticated, isAdmin, (c) => {
  return c.render(<CreateEditFlowPagePage />);
});

app.post("/flows/:flowId/page-order", isAuthenticated, isAdmin, async (c) => {
  const body = await c.req.parseBody<{ [key: string]: string }>();
  let i = 0;
  for (const [flow_page_id, old_position] of Object.entries(body)) {
    if (Number(old_position) !== i) {
      console.log(
        `Updating flow_page ${flow_page_id} from ${old_position} to ${i}`,
      );
      await flowPageActions.updateFlowPage(flow_page_id, {
        position: i,
      });
    }
    i++;
  }
  return c.render(<CreateEditFlowPagePage />);
});

app.get("/flows/:flowId/add-page", isAuthenticated, isAdmin, async (c) => {
  const flowId = c.req.param("flowId");

  const flowPages = await db
    .selectFrom("flow_page")
    .innerJoin("flow", "flow.id", "flow_page.flow_id")
    .select("flow_page.page_id")
    .where("flow.flow_id", "=", flowId)
    .execute();
  const options = await db
    .selectFrom("page")
    .select(["page.title as label", "page.page_id as value"])
    .$if(flowPages.length > 0, (qb) =>
      qb.where(
        "page.id",
        "not in",
        flowPages.map((v) => v.page_id),
      ),
    )
    .execute();

  return c.html(
    <Modal title="Add page">
      <form method="POST" action={`/admin/flows/${flowId}/add-page`}>
        <label className="mb-1">Attach an existing page.</label>
        <select className="input" required name="pageId">
          <option value=""></option>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <p className="my-2">
          You can select an existing page to add to this flow or{" "}
          <a
            href="/admin/pages/create"
            className="underline text-indigo-500 font-semibold"
          >
            Create
          </a>{" "}
          a new page.
        </p>
        <button className="button mt-4">Save Page</button>
      </form>
    </Modal>,
  );
});

app.post("/flows/:flowId/add-page", async (c) => {
  const flowId = c.req.param("flowId");
  const { pageId } = await c.req.parseBody<{ pageId: string }>();
  const flow = await db
    .selectFrom("flow")
    .select(["id as flow_id"])
    .where("flow.flow_id", "=", flowId)
    .executeTakeFirst();

  const page = await db
    .selectFrom("page")
    .select(["id as page_id"])
    .where("page.page_id", "=", pageId)
    .executeTakeFirst();
  const highestFlowPagePosition = await db
    .selectFrom("flow_page")
    .select("position")
    .orderBy("position", "desc")
    .limit(1)
    .executeTakeFirst();
  await flowPageActions.createFlowPage({
    flow_id: flow!.flow_id,
    page_id: page!.page_id,
    position: highestFlowPagePosition ? Number(highestFlowPagePosition) + 1 : 0,
  });
  return c.redirect(`/admin/flows/${flowId}`);
});

app.post("/flows/create", isAuthenticated, isAdmin, async (c) => {
  const body = await c.req.parseBody<{
    title: string;
    slug: string;
    description: string;
  }>();
  const newFlow = await flow.createFlow({
    title: body.title,
    slug: body.slug,
    description: body.description,
  });
  return c.redirect(`/admin/flows/${newFlow.flow_id}`);
});

app.post("/flows/:flowId", isAuthenticated, isAdmin, async (c) => {
  const body = await c.req.parseBody<{
    title: string;
    slug: string;
    description: string;
  }>();
  const flowId = c.req.param("flowId");
  const updated = await flow.updateFlow(flowId, {
    ...body,
  });
  return c.render(<UpdateFlowPage flow={updated} />);
});

export default app;
